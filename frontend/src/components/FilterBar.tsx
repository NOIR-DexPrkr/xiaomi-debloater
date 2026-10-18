interface FilterBarProps {
  searchText: string
  activeCategory: string
  onSearchChange: (text: string) => void
  onCategoryChange: (category: string) => void
}

// Keys stay in English; PackageList matches them against pkg.category
const CATEGORIES: { key: string; label: string }[] = [
  { key: 'All', label: 'Todas' },
  { key: 'Bloatware', label: 'Bloatware' },
  { key: 'OEM', label: 'OEM' },
  { key: 'System', label: 'Sistema' },
  { key: 'User', label: 'Usuario' },
  { key: 'Disabled', label: 'Deshabilitadas' },
  { key: 'Removed', label: 'Eliminadas' },
]

function FilterBar({ searchText, activeCategory, onSearchChange, onCategoryChange }: FilterBarProps) {
  return (
    <div className="space-y-2">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Buscar paquetes..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-noir-surface border border-noir-border rounded-md px-3 py-2 text-sm text-noir-text placeholder-noir-muted focus:outline-none focus:border-noir-cyan"
      />

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
            className={`px-2.5 py-1 rounded border font-display font-bold text-[10px] uppercase tracking-[0.08em] transition-colors ${
              activeCategory === cat.key
                ? 'bg-noir-accent border-noir-cyan text-noir-cyan'
                : 'bg-noir-surface border-noir-border text-noir-body hover:border-noir-border-hover hover:text-noir-text'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterBar
