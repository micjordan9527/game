type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  as?: "h1" | "h2"
}

export function SectionHeader({ eyebrow, title, description, as: Heading = "h2" }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="mb-2 text-sm font-semibold text-brand-700">{eyebrow}</p> : null}
      <Heading className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">{title}</Heading>
      {description ? <p className="mt-3 text-base leading-8 text-muted">{description}</p> : null}
    </div>
  )
}
