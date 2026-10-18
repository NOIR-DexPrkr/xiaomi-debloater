import type { CSSProperties } from 'react'
import icon from '../assets/images/noirxd-icon.png'

type AppView = 'home' | 'debloat' | 'guide' | 'settings'

interface SidebarProps {
  view: AppView
  onNavigate: (view: AppView) => void
  isMac: boolean
  devicesConnected: number
  adbOk: boolean
}

const NAV_ITEMS: { view: AppView; label: string; icon: JSX.Element }[] = [
  {
    view: 'debloat',
    label: 'Debloater',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M3 6h18" />
        <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    ),
  },
  {
    view: 'guide',
    label: 'Guía',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    view: 'settings',
    label: 'Configuración',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

function Sidebar({ view, onNavigate, isMac, devicesConnected, adbOk }: SidebarProps) {
  return (
    <aside className="w-[220px] flex-shrink-0 bg-noir-surface border-r border-noir-border flex flex-col">
      {/* Drag strip: window drag handle with macOS traffic-light clearance */}
      <div
        className={`flex items-center ${isMac ? 'h-13 pl-24 pr-4' : 'h-14 pl-4'}`}
        style={{ '--wails-draggable': 'drag' } as CSSProperties}
      >
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          style={{ '--wails-draggable': 'no-drag' } as CSSProperties}
          title="Volver al inicio"
        >
          <img src={icon} alt="" className="w-6 h-6 select-none" />
          <span className="font-display font-black text-[15px] tracking-[-0.03em] uppercase text-noir-text">
            NOIR<span className="text-noir-cyan">XD</span>
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active = view === item.view
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`relative flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors text-left ${
                active
                  ? 'bg-noir text-noir-text'
                  : 'text-noir-body hover:text-noir-text hover:bg-noir-hover'
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-noir-cyan" />}
              <span className={active ? 'text-noir-cyan' : 'text-noir-muted'}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Status footer */}
      <div className="mt-auto border-t border-noir-border p-3 flex flex-col gap-1.5">
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 text-xs text-noir-muted hover:text-noir-body transition-colors text-left"
        >
          <span className={`w-2 h-2 rounded-full ${adbOk ? 'bg-noir-cyan' : 'bg-red-500'}`} />
          {adbOk ? 'ADB listo' : 'ADB no encontrado'}
        </button>
        <span className="flex items-center gap-2 text-xs text-noir-muted">
          <span className="w-2 h-2 rounded-full bg-noir-border-hover" />
          {devicesConnected} dispositivo{devicesConnected === 1 ? '' : 's'}
        </span>
      </div>
    </aside>
  )
}

export default Sidebar
