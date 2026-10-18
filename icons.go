package main

import (
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"
)

// GetAppIcon returns a data URI with the app's Play Store icon, or "" when it
// has none. Lookups are serialized and rate-limited, capped per session and
// cached on disk (misses too), so scrolling the list never hammers Play.
const (
	maxIconFetches  = 200
	iconFetchGap    = 300 * time.Millisecond
	maxIconBytes    = 512 << 10 // per icon download
	maxPlayHTMLSize = 3 << 20   // Play Store details page
)

var (
	iconMu        sync.Mutex
	iconFetched   int
	iconLastFetch time.Time
	iconClient    = &http.Client{Timeout: 15 * time.Second}

	ogImageRe = regexp.MustCompile(`property="og:image"\s+content="(https://play-lh\.googleusercontent\.com/[^"]+)"`)
	playImgRe = regexp.MustCompile(`https://play-lh\.googleusercontent\.com/[A-Za-z0-9_\-]+`)
	iconExts  = []string{".png", ".jpg", ".jpeg", ".webp"}
	iconMimes = map[string]string{".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}
)

// GetAppIcon implements the lazy icon lookup used by the package list.
func (a *App) GetAppIcon(pkg string) (string, error) {
	if !isValidPackageName(pkg) {
		return "", fmt.Errorf("nombre de paquete no válido")
	}
	dir, err := iconCacheDir()
	if err != nil {
		return "", nil // no cache dir: caller keeps the monogram
	}

	if data, ext, found := readIconCache(dir, pkg); found {
		if ext == "" {
			return "", nil // cached miss
		}
		return iconDataURI(ext, data), nil
	}

	iconMu.Lock()
	defer iconMu.Unlock()

	// Re-check under the lock: a queued row may have just fetched it
	if data, ext, found := readIconCache(dir, pkg); found {
		if ext == "" {
			return "", nil
		}
		return iconDataURI(ext, data), nil
	}
	if iconFetched >= maxIconFetches {
		return "", nil
	}
	if wait := iconFetchGap - time.Since(iconLastFetch); wait > 0 {
		time.Sleep(wait)
	}

	data, ext, ok := fetchPlayIcon(pkg)
	iconLastFetch = time.Now()
	iconFetched++
	if !ok {
		_ = os.WriteFile(filepath.Join(dir, pkg+".missing"), nil, 0o644)
		return "", nil
	}
	_ = os.WriteFile(filepath.Join(dir, pkg+ext), data, 0o644)
	return iconDataURI(ext, data), nil
}

func iconCacheDir() (string, error) {
	base, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(base, "noirxd", "icons"), nil
}

// readIconCache returns (bytes, ext, hit). ext == "" with found == true is a
// cached miss.
func readIconCache(dir, pkg string) ([]byte, string, bool) {
	for _, ext := range iconExts {
		if data, err := os.ReadFile(filepath.Join(dir, pkg+ext)); err == nil && len(data) > 0 {
			return data, ext, true
		}
	}
	if _, err := os.Stat(filepath.Join(dir, pkg+".missing")); err == nil {
		return nil, "", true
	}
	return nil, "", false
}

func iconDataURI(ext string, data []byte) string {
	mime := iconMimes[ext]
	if mime == "" {
		mime = "image/png"
	}
	return "data:" + mime + ";base64," + base64.StdEncoding.EncodeToString(data)
}

// fetchPlayIcon opens the app's Play Store page, extracts the icon URL from
// og:image and downloads it. found == false means the app is not on Play.
func fetchPlayIcon(pkg string) (data []byte, ext string, found bool) {
	pageURL := "https://play.google.com/store/apps/details?id=" + url.QueryEscape(pkg) + "&hl=es"
	req, err := http.NewRequest(http.MethodGet, pageURL, nil)
	if err != nil {
		return nil, "", false
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36")
	req.Header.Set("Accept-Language", "es-419,es;q=0.9")

	resp, err := iconClient.Do(req)
	if err != nil {
		return nil, "", false
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, "", false
	}
	page, err := io.ReadAll(io.LimitReader(resp.Body, maxPlayHTMLSize))
	if err != nil {
		return nil, "", false
	}

	iconURL := ""
	if m := ogImageRe.FindSubmatch(page); m != nil {
		iconURL = string(m[1])
	} else if m := playImgRe.Find(page); m != nil {
		iconURL = string(m)
	}
	if iconURL == "" {
		return nil, "", false
	}
	iconURL = strings.ReplaceAll(iconURL, `&amp;`, `&`)

	imgReq, err := http.NewRequest(http.MethodGet, iconURL, nil)
	if err != nil {
		return nil, "", false
	}
	imgReq.Header.Set("User-Agent", req.Header.Get("User-Agent"))
	imgResp, err := iconClient.Do(imgReq)
	if err != nil {
		return nil, "", false
	}
	defer imgResp.Body.Close()
	if imgResp.StatusCode != http.StatusOK {
		return nil, "", false
	}
	img, err := io.ReadAll(io.LimitReader(imgResp.Body, maxIconBytes))
	if err != nil || len(img) == 0 {
		return nil, "", false
	}

	switch ct := strings.ToLower(imgResp.Header.Get("Content-Type")); {
	case strings.Contains(ct, "jpeg"), strings.Contains(ct, "jpg"):
		ext = ".jpg"
	case strings.Contains(ct, "webp"):
		ext = ".webp"
	default:
		ext = ".png"
	}
	return img, ext, true
}
