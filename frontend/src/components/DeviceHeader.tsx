import { main } from '../../wailsjs/go/models.js'

interface DeviceHeaderProps {
  devices: main.Device[]
  selectedSerial: string
  onSelectDevice: (serial: string) => void
  deviceInfo: Record<string, string>
  onRefresh: () => void
  isLoading: boolean
}

function DeviceHeader({
  devices,
  selectedSerial,
  onSelectDevice,
  deviceInfo,
  onRefresh,
  isLoading,
}: DeviceHeaderProps) {
  const activeDevice = devices.find((d) => d.serial === selectedSerial)

  if (!activeDevice) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-noir-muted">Ningún dispositivo conectado</div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-3 py-1 bg-noir-surface border border-noir-border rounded-md text-sm font-medium text-noir-text hover:border-noir-cyan hover:bg-noir-hover disabled:text-noir-muted transition-colors"
        >
          {isLoading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Device Selector and Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-noir-cyan flex-shrink-0"
          >
            <rect x="7" y="2" width="10" height="20" rx="2" />
            <path d="M11 18h2" />
          </svg>
          {devices.length > 1 ? (
            <select
              value={selectedSerial}
              onChange={(e) => onSelectDevice(e.target.value)}
              className="bg-noir-surface border border-noir-border rounded px-2 py-1 text-sm text-noir-text focus:border-noir-cyan focus:outline-none"
            >
              {devices.map((d) => (
                <option key={d.serial} value={d.serial}>
                  {d.model || d.product || d.serial} ({d.serial})
                </option>
              ))}
            </select>
          ) : (
            <span className="font-display font-bold text-lg text-noir-text truncate">
              {activeDevice.model || activeDevice.product}
            </span>
          )}
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-3 py-1 bg-noir-surface border border-noir-border rounded-md text-sm font-medium text-noir-text hover:border-noir-cyan hover:bg-noir-hover disabled:text-noir-muted transition-colors"
        >
          {isLoading ? '⟳ Actualizando...' : '⟳ Actualizar'}
        </button>
      </div>

      {/* Device Info */}
      <div className="grid grid-cols-2 gap-3 font-mono text-[11px] text-noir-body">
        <div>
          <span className="text-noir-muted">Modelo:</span> {deviceInfo.model || activeDevice.model || 'Desconocido'}
        </div>
        <div>
          <span className="text-noir-muted">Número de serie:</span> {selectedSerial}
        </div>
        <div>
          {deviceInfo.hyperos ? (
            <>
              <span className="text-noir-muted">HyperOS:</span> {deviceInfo.hyperos}
            </>
          ) : (
            <>
              <span className="text-noir-muted">MIUI:</span> {deviceInfo.miui_version || 'Desconocido'}
            </>
          )}
        </div>
        <div>
          <span className="text-noir-muted">Android:</span> {deviceInfo.android || 'Desconocido'}
        </div>
      </div>
    </div>
  )
}

export default DeviceHeader
