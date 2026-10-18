import type { ReactNode } from 'react'
import type { main } from '../../wailsjs/go/models.js'
import { BrowserOpenURL } from '../../wailsjs/runtime/runtime.js'

interface SettingsProps {
  adbState: 'checking' | 'installed' | 'missing'
  adbVersion: string
  onRecheckAdb: () => void
  listInfo: main.ListInfo | null
  listStatus: string
  onUpdateList: () => void
  showDanger: boolean
  onToggleDanger: () => void
  devices: main.Device[]
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display font-bold text-[11px] uppercase tracking-[0.08em] text-noir-muted mb-3">
      {children}
    </h2>
  )
}

function Settings({
  adbState,
  adbVersion,
  onRecheckAdb,
  listInfo,
  listStatus,
  onUpdateList,
  showDanger,
  onToggleDanger,
  devices,
}: SettingsProps) {
  const connected = devices.filter((d) => d.state === 'device')

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="font-display font-black text-2xl tracking-[-0.03em] text-noir-text">
            Configuración
          </h1>
          <p className="text-sm text-noir-body mt-1">Estado del sistema y opciones de la app.</p>
        </div>

        {/* ADB */}
        <section className="bg-noir-surface border border-noir-border rounded-lg p-5">
          <SectionTitle>ADB (Android Debug Bridge)</SectionTitle>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  adbState === 'installed' ? 'bg-noir-cyan' : adbState === 'missing' ? 'bg-red-500' : 'bg-noir-border-hover'
                }`}
              />
              <span className="text-sm text-noir-text">
                {adbState === 'checking'
                  ? 'Comprobando…'
                  : adbState === 'installed'
                    ? 'ADB instalado'
                    : 'ADB no encontrado'}
              </span>
              {adbState === 'installed' && (
                <span className="font-mono text-[11px] text-noir-muted truncate" title={adbVersion}>
                  {adbVersion}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onRecheckAdb}
                className="px-3 py-1 bg-noir border border-noir-border hover:border-noir-cyan hover:bg-noir-hover rounded-md text-xs font-medium text-noir-text transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={() =>
                  BrowserOpenURL('https://developer.android.com/tools/releases/platform-tools')
                }
                className="px-3 py-1 bg-noir border border-noir-border hover:border-noir-cyan hover:bg-noir-hover rounded-md text-xs font-medium text-noir-blue hover:text-noir-cyan transition-colors"
              >
                Instalar ADB ↗
              </button>
            </div>
          </div>
          {adbState === 'missing' && (
            <p className="text-xs text-noir-muted mt-3">
              En la pestaña Inicio encontrarás el comando de instalación más fácil para tu sistema
              y alternativas.
            </p>
          )}
        </section>

        {/* Package list */}
        <section className="bg-noir-surface border border-noir-border rounded-lg p-5">
          <SectionTitle>Lista de paquetes</SectionTitle>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-noir-body">
              {listInfo ? (
                <>
                  Versión <span className="font-mono text-noir-text">{listInfo.version}</span>
                  <span className="text-noir-muted"> · {listInfo.count} paquetes · fuente: </span>
                  <span className="font-mono text-noir-text">{listInfo.source}</span>
                </>
              ) : (
                <span className="text-noir-muted">Sin información de la lista</span>
              )}
            </div>
            <button
              onClick={onUpdateList}
              className="px-3 py-1 bg-noir border border-noir-border hover:border-noir-cyan hover:bg-noir-hover rounded-md text-xs font-medium text-noir-text transition-colors"
            >
              {listStatus === 'Comprobando…' ? 'Comprobando…' : 'Actualizar lista'}
            </button>
          </div>
          {listStatus && listStatus !== 'Comprobando…' && (
            <p className="text-xs text-noir-muted mt-3">{listStatus}</p>
          )}
        </section>

        {/* Advanced mode */}
        <section className="bg-noir-surface border border-noir-border rounded-lg p-5">
          <SectionTitle>Modo avanzado</SectionTitle>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showDanger}
              onChange={onToggleDanger}
              className="noir-checkbox"
            />
            <span>
              <span className="block text-sm font-semibold text-noir-text">
                Mostrar aplicaciones peligrosas
              </span>
              <span className="block text-xs text-noir-muted leading-relaxed mt-0.5">
                Las apps con riesgo "peligroso" están ocultas por defecto para que no las elimines
                sin querer. Pueden romper llamadas, SIM, Ajustes o el arranque del teléfono.
              </span>
            </span>
          </label>
        </section>

        {/* Devices */}
        <section className="bg-noir-surface border border-noir-border rounded-lg p-5">
          <SectionTitle>
            Dispositivos ({connected.length} conectado{connected.length === 1 ? '' : 's'})
          </SectionTitle>
          {devices.length === 0 ? (
            <p className="text-sm text-noir-muted">Ningún dispositivo conectado.</p>
          ) : (
            <ul className="space-y-2">
              {devices.map((d) => (
                <li
                  key={d.serial}
                  className="flex items-center justify-between gap-3 text-sm border border-noir-border rounded-md px-3 py-2"
                >
                  <span className="text-noir-text truncate">
                    {d.model || d.product || d.serial}
                  </span>
                  <span
                    className={`font-display font-bold text-[10px] uppercase tracking-[0.08em] px-2 py-0.5 rounded border flex-shrink-0 ${
                      d.state === 'device'
                        ? 'bg-noir-accent border-noir-cyan text-noir-cyan'
                        : 'bg-noir border-noir-border text-noir-muted'
                    }`}
                  >
                    {d.state === 'device' ? 'Conectado' : d.state}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default Settings
