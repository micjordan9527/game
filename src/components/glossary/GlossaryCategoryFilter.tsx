type GlossaryCategoryFilterProps = {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

export function GlossaryCategoryFilter({ categories, active, onChange }: GlossaryCategoryFilterProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${
            active === category ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:text-ink"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
