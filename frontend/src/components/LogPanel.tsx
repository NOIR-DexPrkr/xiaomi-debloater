import { useEffect, useRef } from 'react'

interface LogEntry {
  Timestamp: string
  Package: string
  Message: string
  Success: boolean
}

interface LogPanelProps {
  entries: LogEntry[]
  onClear: () => void
  open: boolean
  onToggle: () => void
}

function LogPanel({ entries, onClear, open, onToggle }: LogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [entries])

  const failures = entries.filter((e) => !e.Success).length

  // Collapsed strip: click to expand
  if (!open) {
    return (
      <button
        onClick={onToggle}
        className="w-full border-t border-noir-border bg-noir flex items-center justify-between px-4 h-9 hover:bg-noir-hover transition-colors"
      >
        <span className="font-display font-bold text-[11px] uppercase tracking-[0.08em] text-noir-muted">
          Registro de operaciones
          {entries.length > 0 && (
            <span className="ml-2 font-sans normal-case tracking-normal text-noir-body">
              · {entries.length}
              {failures > 0 && <span className="text-red-400"> · {failures} con error</span>}
            </span>
          )}
        </span>
        <span className="text-noir-muted text-xs">▲</span>
      </button>
    )
  }

  return (
    <div className="border-t border-noir-border bg-noir flex flex-col" style={{ height: '170px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-noir-border flex-shrink-0">
        <span className="font-display font-bold text-[11px] uppercase tracking-[0.08em] text-noir-text">
          Registro de operaciones
          {entries.length > 0 && (
            <span className="ml-2 font-sans normal-case tracking-normal text-noir-muted">
              · {entries.length}
              {failures > 0 && <span className="text-red-400"> · {failures} con error</span>}
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="px-2 py-1 bg-noir-surface border border-noir-border hover:border-noir-cyan rounded-md text-xs font-medium text-noir-text transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={onToggle}
            className="px-2 py-1 bg-noir-surface border border-noir-border hover:border-noir-cyan rounded-md text-xs font-medium text-noir-body transition-colors"
            title="Colapsar"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Log Entries */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto font-mono text-xs space-y-1 px-4 py-2"
      >
        {entries.length === 0 ? (
          <span className="text-noir-muted">Aún no hay operaciones...</span>
        ) : (
          entries.map((entry, idx) => (
            <div key={idx} className={entry.Success ? 'text-noir-cyan' : 'text-red-400'}>
              <span className="text-noir-muted">[{entry.Timestamp}]</span>
              {entry.Package && <span className="ml-2 text-noir-blue">{entry.Package}</span>}
              <span className="ml-2">{entry.Message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LogPanel
