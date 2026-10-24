import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { ShowcaseItem } from "@/data/showcase"
import { assetPath } from "@/lib/assets"

export function ShowcaseGrid({ items, titleAs: Heading = "h2" }: { items: ShowcaseItem[]; titleAs?: "h2" | "h3" }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className="group min-w-0 overflow-hidden rounded-xl border border-line bg-white transition hover:border-brand-200 hover:shadow-soft"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-paper">
            <img
              src={assetPath(item.cover)}
              alt={item.title}
              width={1440}
              height={900}
              loading={index < 2 ? "eager" : "lazy"}
              className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
            />
            <span className="absolute left-3 top-3 rounded-full border border-line bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink">
              {item.kind}
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <Heading className="text-lg font-semibold text-ink">{item.title}</Heading>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
            </div>
            <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
