export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-7 text-muted">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
