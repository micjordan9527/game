export function FAQBlock({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.question} className="rounded-lg border border-line bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-ink">{item.question}</summary>
          <p className="mt-3 text-sm leading-7 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
