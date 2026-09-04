import Link from "next/link"
import { SectionHeader } from "@/components/common/SectionHeader"
import { getGlossaryPreview } from "@/lib/site"

export function GlossaryPreview() {
  return (
    <section className="container-shell py-12">
      <div className="rounded-xl border border-line bg-white p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader title="术语库" description="快速查清行业常见词，理解它出现在哪些产品和运营场景里。" />
          <Link href="/glossary" className="text-sm font-semibold text-brand-700 hover:underline">
            查看全部术语
          </Link>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {getGlossaryPreview().map((term) => (
            <Link key={term.id} href={`/glossary#${term.id}`} className="rounded-lg border border-line bg-paper p-4 hover:border-brand-100">
              <div className="text-base font-semibold text-ink">{term.term}</div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{term.shortDescription}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
