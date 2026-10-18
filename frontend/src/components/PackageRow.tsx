import { main } from '../../wailsjs/go/models.js'
import AppIcon from './AppIcon'

interface PackageRowProps {
  pkg: main.AppPackage
  isSelected: boolean
  onToggleSelect: (name: string) => void
}

function PackageRow({ pkg, isSelected, onToggleSelect }: PackageRowProps) {
  const getRiskBadgeClass = () => {
    switch (pkg.risk) {
      case 'safe':
        return 'bg-noir-accent border-noir-cyan text-noir-cyan'
      case 'caution':
        return 'bg-[#1A1400] border-amber-500 text-amber-500'
      case 'danger':
        return 'bg-[#1A0505] border-red-500 text-red-500'
      default:
        return 'bg-noir-surface border-noir-border text-noir-body'
    }
  }

  const getCategoryLabel = () => {
    switch (pkg.category) {
      case 'bloatware':
        return 'Bloatware'
      case 'oem':
        return 'OEM'
      case 'system':
        return 'Sistema'
      case 'user':
        return 'Usuario'
      default:
        return pkg.category
    }
  }

  const getRiskLabel = () => {
    switch (pkg.risk) {
      case 'safe':
        return 'Seguro'
      case 'caution':
        return 'Precaución'
      case 'danger':
        return 'Peligro'
      default:
        return pkg.risk
    }
  }

  return (
    <tr className="border-t border-noir-border hover:bg-noir-hover transition-colors">
      <td className="px-4 py-2 w-10 align-middle">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(pkg.name)}
          className="noir-checkbox"
        />
      </td>
      <td className="px-4 py-2">
        <div className="flex items-start gap-3 min-w-0">
          <AppIcon pkg={pkg.name} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-noir-body break-all" title={pkg.name}>
                {pkg.name}
              </span>
              {!pkg.is_installed && (
                <span className="shrink-0 px-1.5 py-0.5 rounded border border-noir-blue/60 text-noir-blue text-[9px] uppercase tracking-[0.08em]">
                  eliminado
                </span>
              )}
              {pkg.is_installed && !pkg.is_enabled && (
                <span className="shrink-0 px-1.5 py-0.5 rounded border border-amber-500/60 text-amber-500 text-[9px] uppercase tracking-[0.08em]">
                  deshabilitado
                </span>
              )}
            </div>
            <div className="text-[11px] text-noir-muted leading-snug">{pkg.description}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-2">
        <span className="px-2 py-0.5 rounded border bg-noir-surface border-noir-border text-noir-body font-display font-bold text-[10px] uppercase tracking-[0.08em] whitespace-nowrap">
          {getCategoryLabel()}
        </span>
      </td>
      <td className="px-4 py-2">
        <span
          className={`px-2 py-0.5 rounded border font-display font-bold text-[10px] uppercase tracking-[0.08em] whitespace-nowrap ${getRiskBadgeClass()}`}
        >
          {getRiskLabel()}
        </span>
      </td>
    </tr>
  )
}

export default PackageRow
