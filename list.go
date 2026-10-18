package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"
)

// remoteListURL is where the maintained package list is published; the app pulls it
// so users get updates for new MIUI/HyperOS releases without a new app build.
// remoteListURL is the fork's package list; override with NOIRXD_LIST_URL
const remoteListURL = "https://raw.githubusercontent.com/NOIR-DexPrkr/xiaomi-debloater/main/bloatware.json"

// maxListSize caps the downloaded list so a bad response cannot exhaust memory
const maxListSize = 5 << 20

//go:embed bloatware.json
var embeddedList []byte

// BloatList is the on-disk and remote format of the package database
type BloatList struct {
	Version  string         `json:"version"` // YYYY.MM.DD, optionally with a .N suffix
	Updated  string         `json:"updated"`
	Packages []PackageEntry `json:"packages"`
}

// PackageEntry describes one known package
type PackageEntry struct {
	Package     string   `json:"package"`
	Description string   `json:"description"`
	Category    string   `json:"category"` // "bloatware", "oem", "system"
	Risk        string   `json:"risk"`     // "safe", "caution", "danger"
	OS          []string `json:"os,omitempty"`
}

// ListInfo tells the frontend which package list is active
type ListInfo struct {
	Version string `json:"version"`
	Updated string `json:"updated"`
	Count   int    `json:"count"`
	Source  string `json:"source"` // "integrada", "caché", "descargada"
}

var (
	listMu     sync.RWMutex
	knownList  = map[string]BloatwareInfo{}
	activeInfo ListInfo
)

// parseList decodes and sanity-checks a package list
func parseList(data []byte) (*BloatList, error) {
	var list BloatList
	if err := json.Unmarshal(data, &list); err != nil {
		return nil, fmt.Errorf("al analizar la lista de paquetes: %w", err)
	}
	if list.Version == "" || len(list.Packages) == 0 {
		return nil, fmt.Errorf("la lista de paquetes no tiene versión o paquetes")
	}
	return &list, nil
}

// applyList makes list the active package database
func applyList(list *BloatList, source string) {
	m := make(map[string]BloatwareInfo, len(list.Packages))
	for _, p := range list.Packages {
		if !isValidPackageName(p.Package) {
			continue
		}
		m[p.Package] = BloatwareInfo{Description: p.Description, Category: p.Category, Risk: p.Risk}
	}

	listMu.Lock()
	defer listMu.Unlock()
	knownList = m
	activeInfo = ListInfo{Version: list.Version, Updated: list.Updated, Count: len(m), Source: source}
}

// lookupKnown returns the list entry for a package, if any
func lookupKnown(name string) (BloatwareInfo, bool) {
	listMu.RLock()
	defer listMu.RUnlock()
	info, ok := knownList[name]
	return info, ok
}

// cachePath is where the last downloaded list is kept between runs
func cachePath() (string, error) {
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "noirxd", "bloatware.json"), nil
}

// loadLists activates the built-in list, then a cached download if it is newer
func loadLists() {
	builtIn, err := parseList(embeddedList)
	if err != nil {
		panic(fmt.Sprintf("la lista de paquetes integrada no es válida: %v", err))
	}
	applyList(builtIn, "integrada")

	path, err := cachePath()
	if err != nil {
		return
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return
	}
	if cached, err := parseList(data); err == nil && cached.Version > builtIn.Version {
		applyList(cached, "caché")
	}
}

// GetListInfo reports which package list version is active
func (a *App) GetListInfo() ListInfo {
	listMu.RLock()
	defer listMu.RUnlock()
	return activeInfo
}

// UpdateList downloads the latest package list and activates it when newer
func (a *App) UpdateList() (ListInfo, error) {
	url := os.Getenv("NOIRXD_LIST_URL")
	if url == "" {
		url = remoteListURL
	}
	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return a.GetListInfo(), fmt.Errorf("al descargar la lista de paquetes: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return a.GetListInfo(), fmt.Errorf("al descargar la lista de paquetes: HTTP %d", resp.StatusCode)
	}

	data, err := io.ReadAll(io.LimitReader(resp.Body, maxListSize))
	if err != nil {
		return a.GetListInfo(), fmt.Errorf("al leer la lista de paquetes: %w", err)
	}
	remote, err := parseList(data)
	if err != nil {
		return a.GetListInfo(), err
	}

	if remote.Version <= a.GetListInfo().Version {
		return a.GetListInfo(), nil
	}

	applyList(remote, "descargada")
	if path, err := cachePath(); err == nil {
		if err := os.MkdirAll(filepath.Dir(path), 0o755); err == nil {
			_ = os.WriteFile(path, data, 0o644)
		}
	}
	return a.GetListInfo(), nil
}
