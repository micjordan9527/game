export function ProcessFlow({ steps }: { steps: string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => (
        <div key={step} className="rounded-lg border border-line bg-white p-4">
          <div className="text-xs font-semibold text-brand-700">STEP {index + 1}</div>
          <div className="mt-2 text-sm leading-6 text-ink">{step}</div>
        </div>
      ))}
    </div>
  )
}
