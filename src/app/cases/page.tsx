import { ShowcaseGrid } from "@/components/common/ShowcaseGrid"
import { showcaseItems } from "@/data/showcase"
import { absoluteUrl } from "@/lib/seo"
import Link from "next/link"
import { businessCaseEntries } from "@/data/caseLibrary"
export const metadata = {
  title: "案例",
  description: "直接查看后台原型、官网预览与手机界面改版。",
  alternates: { canonical: absoluteUrl("/cases") },
}
export default function CasesPage() {
  return (
    <div className="container-shell py-8">
      <h1 className="text-3xl font-semibold text-ink">案例</h1>
      <p className="mt-3 text-sm leading-7 text-muted">后台原型、网站预览与界面优化对照。</p>
      <a href="#business-cases" className="mt-3 inline-block text-sm font-semibold text-brand-700">按业务流程查看案例 ↓</a>
      <div className="mt-6">
        <ShowcaseGrid items={showcaseItems.filter((item) => item.href.startsWith("/cases/"))} />
      </div>
      <section id="business-cases" aria-label="业务流程案例" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-ink">业务流程案例</h2>
        <p className="mt-2 text-sm leading-7 text-muted">切换界面与处理状态，沿同一演示编号核对业务记录。</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">{businessCaseEntries.map((item) => <Link key={item.id} href={item.href} className="min-w-0 rounded-xl border border-line bg-white p-5 hover:border-brand-200"><h3 className="text-lg font-semibold text-ink">{item.title} →</h3><p className="mt-3 text-sm leading-7 text-muted">{item.description}</p><div className="mt-4 flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag} className="rounded bg-paper px-2 py-1 text-xs text-muted">{tag}</span>)}</div></Link>)}</div>
      </section>
    </div>
  )
}
