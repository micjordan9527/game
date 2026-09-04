import Link from "next/link"
import {
  BookOpen,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Code2,
  LucideIcon,
  Palette,
  ShieldCheck,
  Trophy,
  WalletCards,
} from "lucide-react"
import type { Category } from "@/data/categories"

const categoryIcons: Record<string, LucideIcon> = {
  industry: BookOpen,
  sportsbook: Trophy,
  "white-label": BriefcaseBusiness,
  product: WalletCards,
  operation: ChartNoAxesCombined,
  design: Palette,
  development: Code2,
  "devops-risk": ShieldCheck,
}

export function CategoryCard({ category }: { category: Category }) {
  const Icon = categoryIcons[category.slug] ?? BookOpen

  return (
    <Link
      href={`/${category.slug}`}
      className="group rounded-lg border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-soft"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
        <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-semibold text-ink">{category.title}</h3>
      <p className="mt-2 min-h-14 text-sm leading-7 text-muted">{category.description}</p>
      <span className="mt-4 inline-flex text-sm font-medium text-brand-700 group-hover:underline">查看栏目</span>
    </Link>
  )
}
