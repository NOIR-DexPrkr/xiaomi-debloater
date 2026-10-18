# NoirXD

Wails v2 desktop app (Go backend, React + Vite frontend in `frontend/`) that
debloats Xiaomi phones over adb. Fork of fadeltd/xiaomi-debloater, rebranded
**NoirXD**: the UI and messages are in Spanish (LatAm), the design follows the
Flat Noir identity in `ID-VISUAL-DEXNR.md`, and the binary is `noirxd`. The
package list is `bloatware.json`, which the app downloads from this repo's
`main` at runtime (override with the `NOIRXD_LIST_URL` env var).

## Pull requests: always check CHANGELOG.md

Whenever you open a pull request or push to one, check `CHANGELOG.md` first:

- If the PR changes the app or its packages (Go, `frontend/`, `build/`,
  `packaging/`, `wails.json`, `go.mod`), it needs a bullet under
  `## [Unreleased]`, under a Keep a Changelog heading in Spanish (`Añadido`,
  `Cambiado`, `Corregido`, `Eliminado`, `Seguridad`, `Ruptura`; the English
  equivalents also work). Update the entry when later pushes change what the
  PR does, so it describes the final result.
- The heading decides the version: `Ruptura` → major, `Añadido` → minor,
  anything else → patch. Pick it deliberately.
- Changes only to `bloatware.json`, Markdown, `docs/`, `.github/` or
  `scripts/` are exempt; they ship without a release.
- Never write a version number or release date, never edit
  `info.productVersion` in `wails.json`, and never edit a released
  `## [x.y.z]` section. The Release workflow does all of that on merge.
- Write entries for users of the app, not for reviewers of the diff.

CI's "Changelog entry" check enforces the first rule. Preview the release a
merge would cut with `go run ./scripts/release -dry-run`.

## Releases

Merge to `main` → `release.yml` cuts the version from `[Unreleased]`, tags it
and opens a draft release → `publish.yml` builds every platform and uploads the
artifacts to the GitHub release (the Homebrew/Scoop/winget/Snap/Chocolatey
channels from upstream were removed in this fork). `.deb` and `.rpm` come from
`packaging/nfpm.yaml`. Details are in `CONTRIBUTING.md`.

## Commands

```bash
wails dev                          # live development
wails build                        # build for this OS into build/bin/
wails build -tags webkit2_41       # Linux (needs libgtk-3-dev, libwebkit2gtk-4.1-dev)
go test ./scripts/...              # release tool tests
```
