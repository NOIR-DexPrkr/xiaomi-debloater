import { useEffect, useState } from 'react'
import icon from '../assets/images/noirxd-icon.png'
import avatar from '../assets/images/avatar.webp'
import { CheckADB } from '../../wailsjs/go/main/App.js'
import { BrowserOpenURL, ClipboardSetText, Environment } from '../../wailsjs/runtime/runtime.js'

interface HomeProps {
  onStart: () => void
  onGuide: () => void
}

// Kinetic typography: several marquee rows, alternating directions (DEXNR hero)
const MARQUEE_ROWS = [
  { words: ['DEBLOAT', 'HYPEROS', 'NOIRXD', 'XIAOMI'], direction: 'left' as const },
  { words: ['MIUI', 'ADB', 'SIN ROOT', 'REVERSIBLE'], direction: 'right' as const },
  { words: ['ANUNCIOS', 'TELEMETRÍA', 'MIUI', 'HYPEROS'], direction: 'left' as const },
  { words: ['ADB', 'DEBLOAT', 'NOIRXD', 'SIN ROOT'], direction: 'right' as const },
  { words: ['REDMI', 'POCO', 'XIAOMI', 'HYPEROS'], direction: 'left' as const },
]

const PLATFORM_TOOLS_URL = 'https://developer.android.com/tools/releases/platform-tools'

// Easiest install command per platform, with fallbacks when it fails
const INSTALL_OPTIONS: Record<
  string,
  { label: string; primary: string; alternatives: { text: string; command?: string; url?: string }[] }
> = {
  windows: {
    label: 'Windows',
    primary: 'winget install Google.PlatformTools',
    alternatives: [
      {
        text: '¿No tienes winget? Descarga platform-tools y agrégalo al PATH',
        url: PLATFORM_TOOLS_URL,
      },
    ],
  },
  darwin: {
    label: 'macOS',
    primary: 'brew install android-platform-tools',
    alternatives: [
      {
        text: '¿No tienes Homebrew? Descarga platform-tools y agrégalo al PATH',
        url: PLATFORM_TOOLS_URL,
      },
    ],
  },
  linux: {
    label: 'Linux',
    primary: 'sudo apt install adb',
    alternatives: [
      { text: 'Fedora, openSUSE', command: 'sudo dnf install android-tools' },
      { text: 'Arch, Manjaro', command: 'sudo pacman -S android-tools' },
      { text: 'Descarga oficial de platform-tools', url: PLATFORM_TOOLS_URL },
    ],
  },
}

const CARD_ICON_CLASS = 'w-[18px] h-[18px]'
const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: CARD_ICON_CLASS,
}

const CARDS = [
  {
    title: 'Iniciar',
    description: 'Conecta tu teléfono por ADB y empieza a quitar el bloatware de MIUI y HyperOS.',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="m4 6 5 5-5 5" />
        <path d="M12 17h8" />
      </svg>
    ),
  },
  {
    title: 'Guía',
    description: 'Cómo debloatear MIUI y HyperOS sin romper nada: pasos, ajustes y paquetes que nunca debes tocar.',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
]

function Home({ onStart, onGuide }: HomeProps) {
  const handlers = [onStart, onGuide]

  const [adbState, setAdbState] = useState<'checking' | 'installed' | 'missing'>('checking')
  const [adbVersion, setAdbVersion] = useState('')
  const [platform, setPlatform] = useState('')
  const [copiedCmd, setCopiedCmd] = useState('')

  const checkAdb = async () => {
    setAdbState('checking')
    try {
      const version = await CheckADB()
      setAdbVersion(version.split('\n')[0])
      setAdbState('installed')
    } catch {
      setAdbVersion('')
      setAdbState('missing')
    }
  }

  useEffect(() => {
    Environment().then((env) => setPlatform(env.platform)).catch(() => setPlatform(''))
    checkAdb()
  }, [])

  const copyCmd = async (cmd: string) => {
    await ClipboardSetText(cmd)
    setCopiedCmd(cmd)
    setTimeout(() => setCopiedCmd(''), 1500)
  }

  const installOptions = INSTALL_OPTIONS[platform]

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section: kinetic letters + avatar, its own section above the cards (DEXNR style) */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-12 overflow-hidden min-h-[440px] border-b border-noir-border">
        {/* Kinetic typography background: several rows, flat, no glow */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col justify-around select-none opacity-[0.18]"
          aria-hidden="true"
        >
          {MARQUEE_ROWS.map((row, idx) => (
            <div key={idx} className="noir-marquee-row">
              <div
                className={`noir-marquee-track ${
                  row.direction === 'left' ? 'noir-marquee-track-left' : 'noir-marquee-track-right'
                }`}
              >
                {[0, 1].map((group) => (
                  <div key={group} className="flex items-center flex-nowrap">
                    {row.words.map((word, i) => (
                      <span
                        key={`${group}-${i}`}
                        className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-wider mx-5 sm:mx-7 flex-shrink-0 text-noir-text"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dex Parker avatar, fused into the background with a mask */}
        <div className="pointer-events-none absolute right-2 sm:right-6 md:right-12 bottom-0 top-10 flex items-end justify-end select-none z-[1]">
          <img
            src={avatar}
            alt="Dex Parker"
            className="h-full w-auto max-w-[200px] sm:max-w-[260px] md:max-w-[320px] object-contain object-bottom"
            style={{
              WebkitMaskImage:
                'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.9) 16%, black 90%)',
              maskImage:
                'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.9) 16%, black 90%)',
            }}
          />
        </div>

        {/* Branding */}
        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <img src={icon} alt="NoirXD" className="h-14 sm:h-16 w-auto select-none" />
            <h1 className="font-display font-black text-5xl sm:text-6xl tracking-[-0.03em] leading-none uppercase text-noir-text select-none">
              NOIR<span className="text-noir-cyan">XD</span>
            </h1>
          </div>

          <span className="inline-block rounded bg-noir-accent border border-noir-cyan px-2.5 py-1 font-display font-bold text-[10px] uppercase tracking-[0.08em] text-noir-cyan mb-5">
            Noir - Xiaomi Debloater
          </span>

          <p className="font-sans text-noir-body text-sm sm:text-base max-w-xl leading-relaxed">
            Elimina el bloatware, los anuncios y la telemetría de tus teléfonos Xiaomi, Redmi y POCO
            con MIUI y HyperOS. Funciona por ADB, sin root y sin desbloquear el bootloader: cada
            paquete está clasificado por riesgo y todas las acciones se pueden deshacer.
          </p>
        </div>
      </section>

      {/* Quick access section (like the DEXNR category grid) */}
      <section className="w-full px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
          {CARDS.map((card, idx) => (
            <button
              key={card.title}
              onClick={handlers[idx]}
              className="group text-left bg-noir-surface border border-noir-border rounded-lg p-6 hover:border-noir-cyan transition-colors flex flex-col justify-between min-h-[150px]"
            >
              <div>
                <div className="w-9 h-9 rounded-md bg-noir border border-noir-border flex items-center justify-center text-noir-muted group-hover:text-noir-cyan group-hover:border-noir-cyan transition-colors mb-4">
                  {card.icon}
                </div>
                <h3 className="font-display font-bold text-base text-noir-text group-hover:text-noir-cyan transition-colors mb-1.5">
                  {card.title}
                </h3>
                <p className="font-sans text-xs text-noir-body leading-relaxed">{card.description}</p>
              </div>
              <div className="flex justify-end pt-4 mt-4 border-t border-noir-border">
                <span className="text-noir-cyan font-sans text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Abrir →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* ADB status card (download-box style: 3px accent border-left) */}
        <div className="w-full max-w-2xl mx-auto mt-4">
          <div className="bg-noir-surface border border-noir-border border-l-[3px] border-l-noir-cyan rounded-lg p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-noir border border-noir-border flex items-center justify-center text-noir-cyan flex-shrink-0">
                  <svg {...ICON_PROPS}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m7 9 3 3-3 3" />
                    <path d="M13 15h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-noir-text">ADB</h3>
                  <p className="font-sans text-xs text-noir-body leading-relaxed">
                    Android Debug Bridge. NoirXD lo busca en el PATH y en las rutas habituales.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {adbState === 'checking' && (
                  <span className="px-2 py-0.5 rounded border bg-noir-surface border-noir-border text-noir-muted font-display font-bold text-[10px] uppercase tracking-[0.08em]">
                    Comprobando…
                  </span>
                )}
                {adbState === 'installed' && (
                  <span
                    className="px-2 py-0.5 rounded border bg-noir-accent border-noir-cyan text-noir-cyan font-display font-bold text-[10px] uppercase tracking-[0.08em] max-w-[260px] truncate"
                    title={adbVersion}
                  >
                    ADB instalado
                  </span>
                )}
                {adbState === 'missing' && (
                  <span className="px-2 py-0.5 rounded border bg-[#1A1400] border-amber-500 text-amber-500 font-display font-bold text-[10px] uppercase tracking-[0.08em]">
                    ADB no encontrado
                  </span>
                )}
                <button
                  onClick={checkAdb}
                  className="px-2 py-0.5 bg-noir border border-noir-border hover:border-noir-cyan rounded text-[11px] font-medium text-noir-body hover:text-noir-text transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>

            {adbState === 'installed' && (
              <p className="font-mono text-[11px] text-noir-muted truncate">{adbVersion}</p>
            )}

            {adbState === 'missing' && installOptions && (
              <div>
                <p className="font-sans text-sm text-noir-body mb-3">
                  Para conectar tu teléfono hace falta. La forma más fácil en{' '}
                  <span className="text-noir-text font-semibold">{installOptions.label}</span>:
                </p>
                <div className="flex items-center gap-2 bg-noir-sunken border border-noir-border rounded-md px-3 py-2 mb-3">
                  <code className="font-mono text-xs text-noir-cyan flex-1 truncate">
                    {installOptions.primary}
                  </code>
                  <button
                    onClick={() => copyCmd(installOptions.primary)}
                    className="px-2 py-1 bg-noir border border-noir-border hover:border-noir-cyan rounded text-[11px] font-medium text-noir-body hover:text-noir-text transition-colors flex-shrink-0"
                  >
                    {copiedCmd === installOptions.primary ? 'Copiado ✓' : 'Copiar'}
                  </button>
                </div>
                <p className="font-sans text-[11px] uppercase tracking-[0.08em] font-display font-bold text-noir-muted mb-1.5">
                  Si eso falla
                </p>
                <ul className="space-y-1.5">
                  {installOptions.alternatives.map((alt) => (
                    <li key={alt.text} className="flex items-center gap-2 text-xs text-noir-body">
                      <span className="flex-1">
                        {alt.text}
                        {alt.command && (
                          <code className="font-mono text-[11px] text-noir-cyan ml-1.5">{alt.command}</code>
                        )}
                      </span>
                      {alt.command && (
                        <button
                          onClick={() => copyCmd(alt.command!)}
                          className="px-2 py-0.5 bg-noir border border-noir-border hover:border-noir-cyan rounded text-[10px] font-medium text-noir-muted hover:text-noir-text transition-colors flex-shrink-0"
                        >
                          {copiedCmd === alt.command ? 'Copiado ✓' : 'Copiar'}
                        </button>
                      )}
                      {alt.url && (
                        <button
                          onClick={() => BrowserOpenURL(alt.url!)}
                          className="px-2 py-0.5 bg-noir border border-noir-border hover:border-noir-cyan rounded text-[10px] font-medium text-noir-blue hover:text-noir-cyan transition-colors flex-shrink-0"
                        >
                          Descargar ↗
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="font-sans text-[11px] text-noir-muted mt-3">
                  Después de instalarlo, conecta el teléfono con la depuración por USB activada y
                  pulsa <span className="text-noir-body">Reintentar</span>.
                </p>
              </div>
            )}

            {adbState === 'missing' && !installOptions && (
              <p className="font-sans text-sm text-noir-body">
                Para conectar tu teléfono hace falta. Descarga la versión oficial de{' '}
                <button
                  onClick={() => BrowserOpenURL(PLATFORM_TOOLS_URL)}
                  className="text-noir-blue hover:text-noir-cyan underline transition-colors"
                >
                  platform-tools ↗
                </button>{' '}
                y agrégala al PATH; después pulsa{' '}
                <span className="text-noir-text">Reintentar</span>.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Credit */}
      <section className="w-full px-6 pb-8">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-noir-muted text-xs font-sans flex items-center gap-1.5">
            Creado con <span className="text-red-500">♥</span> por{' '}
            <span className="text-noir-body font-semibold">Dex Parker</span>
          </span>
          <span className="text-noir-muted text-[11px] font-sans">
            Basado en{' '}
            <a
              href="https://github.com/fadeltd/xiaomi-debloater"
              target="_blank"
              rel="noopener noreferrer"
              className="text-noir-blue hover:text-noir-cyan transition-colors"
            >
              Xiaomi Debloater
            </a>{' '}
            de Fadel Trivandi Dipantara · GPL-3.0
          </span>
        </div>
      </section>
    </div>
  )
}

export default Home
