export function DefinitionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-brand-100 bg-brand-50 p-5">
      <div className="text-sm font-semibold text-brand-700">{title}</div>
      <div className="mt-2 text-sm leading-7 text-ink">{children}</div>
    </div>
  )
}
