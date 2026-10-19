import {
  UninstallPackage,
  DisablePackage,
  EnablePackage,
  ReinstallPackage,
} from '../../wailsjs/go/main/App.js'

export type ActionType = 'uninstall' | 'disable' | 'enable' | 'restore'

interface ConfirmDialogProps {
  action: ActionType
  title: string
  message: string
  selectedPackages: string[]
  serial: string
  onConfirm: () => void
  onCancel: () => void
  onActionStart: () => void
  onAddLog: (pkgName: string, message: string, success: boolean) => void
  onActionError: (pkgName: string, message: string) => void
}

const ACTION_LABELS: Record<ActionType, string> = {
  uninstall: 'Desinstalar',
  disable: 'Deshabilitar',
  enable: 'Habilitar',
  restore: 'Restaurar',
}

const CONFIRM_BUTTON_CLASS: Record<ActionType, string> = {
  uninstall: 'bg-red-600 hover:bg-red-500 text-white',
  disable: 'bg-amber-500 hover:bg-amber-400 text-noir',
  enable: 'bg-noir-cyan hover:bg-noir-cyan-hover text-noir',
  restore: 'bg-noir-blue hover:opacity-85 text-white',
}

function ConfirmDialog({
  action,
  title,
  message,
  selectedPackages,
  serial,
  onConfirm,
  onCancel,
  onActionStart,
  onAddLog,
  onActionError,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    // The operation log opens itself as soon as the action starts
    onActionStart()
    for (const pkg of selectedPackages) {
      try {
        let result
        switch (action) {
          case 'uninstall':
            result = await UninstallPackage(serial, pkg)
            break
          case 'disable':
            result = await DisablePackage(serial, pkg)
            break
          case 'enable':
            result = await EnablePackage(serial, pkg)
            break
          case 'restore':
            result = await ReinstallPackage(serial, pkg)
            break
        }
        onAddLog(pkg, result.message, result.success)
        if (!result.success) onActionError(pkg, result.message)
      } catch (err) {
        const message = `Error: ${err}`
        onAddLog(pkg, message, false)
        onActionError(pkg, message)
      }
    }
    onConfirm()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-noir-surface border border-noir-border rounded-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b border-noir-border px-6 py-4">
          <h2 className="font-display font-bold text-lg text-noir-text">{title}</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <p className="text-noir-body text-sm leading-relaxed">{message}</p>
          <div className="bg-noir-sunken border border-noir-border rounded-md p-3 max-h-40 overflow-y-auto">
            <ul className="space-y-1 text-xs font-mono text-noir-muted">
              {selectedPackages.map((pkg) => (
                <li key={pkg}>• {pkg}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-noir-border px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-noir-surface border border-noir-border hover:border-noir-cyan hover:bg-noir-hover rounded-md text-sm font-medium text-noir-text transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${CONFIRM_BUTTON_CLASS[action]}`}
          >
            {ACTION_LABELS[action]}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
