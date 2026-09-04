type BadgeProps = {
  children: React.ReactNode
  tone?: "brand" | "neutral" | "blue"
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    neutral: "bg-white text-muted ring-line",
    blue: "bg-signal-50 text-signal-600 ring-blue-100",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${tones[tone]}`}>
      {children}
    </span>
  )
}
