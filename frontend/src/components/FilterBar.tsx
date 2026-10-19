interface FilterBarProps {
  searchText: string
  activeCategory: string
  mode: 'disable' | 'uninstall'
  onSearchChange: (text: string) => void
  onCategoryChange: (category: string) => void
}

// Keys stay in English; PackageList matches them against pkg.category
const BASE_CATEGORIES: { key: string; label: string }[] = [
  { key: 'All', label: 'Todas' },
  { key: 'Bloatware', label: 'Bloatware' },
  { key: 'OEM', label: 'OEM' },
  { key: 'System', label: 'Sistema' },
  { key: 'User', label: 'Usuario' },
]

// State filters only make sense in the mode that can act on them
const MODE_CATEGORIES: Record<'disable' | 'uninstall', { key: string; label: string }> = {
  disable: { key: 'Disabled', label: 'Deshabilitadas' },
  uninstall: { key: 'Removed', label: 'Eliminadas' },
}

function FilterBar({
  searchText,
  activeCategory,
  mode,
  onSearchChange,
  onCategoryChange,
}: FilterBarProps) {
  const categories = [...BASE_CATEGORIES, MODE_CATEGORIES[mode]]

  return (
    <div className="space-y-1.5">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Buscar paquetes..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-noir-surface border border-noir-border rounded-md px-3 py-1.5 text-sm text-noir-text placeholder-noir-muted focus:outline-none focus:border-noir-cyan"
      />

      {/* Category Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
            className={`px-2 py-0.5 rounded border font-display font-bold text-[9px] uppercase tracking-[0.08em] transition-colors ${
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
