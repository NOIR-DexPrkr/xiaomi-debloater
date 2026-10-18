import { useEffect, useRef, useState } from 'react'
import { GetAppIcon } from '../../wailsjs/go/main/App.js'

interface AppIconProps {
  pkg: string
  size?: number
}

// Deterministic hue from the package name so every app keeps a stable color
function hashHue(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) % 360
  }
  return hash
}

// "com.miui.player" -> "MP" (last two segments), falling back to the first letters
function monogram(pkg: string): string {
  const segments = pkg.split('.').filter(Boolean)
  if (segments.length === 0) return '?'
  const first = segments.length >= 2 ? segments[segments.length - 2][0] : segments[segments.length - 1][0]
  const last = segments[segments.length - 1][0]
  return (first + last).toUpperCase()
}

// Monogram avatar first; the real Play Store icon replaces it once loaded
// (the backend fetches it lazily, throttled and cached on disk).
function AppIcon({ pkg, size = 32 }: AppIconProps) {
  const [iconUri, setIconUri] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Only ask for the network icon when the row is actually on screen
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect()
          GetAppIcon(pkg)
            .then((uri) => {
              if (uri) setIconUri(uri)
            })
            .catch(() => {
              /* monogram stays */
            })
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [pkg])

  const hue = hashHue(pkg)

  return (
    <div
      ref={containerRef}
      className="flex-shrink-0 rounded-md overflow-hidden flex items-center justify-center select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: iconUri ? 'transparent' : `hsl(${hue}, 32%, 14%)`,
        border: iconUri ? 'none' : `1px solid hsl(${hue}, 40%, 28%)`,
      }}
      title={pkg}
    >
      {iconUri ? (
        <img src={iconUri} alt="" className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span
          className="font-display font-bold"
          style={{
            fontSize: size * 0.36,
            color: `hsl(${hue}, 65%, 68%)`,
          }}
        >
          {monogram(pkg)}
        </span>
      )}
    </div>
  )
}

export default AppIcon
