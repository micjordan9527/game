import Link from "next/link"
import { articles } from "@/data/articles"
import { glossary } from "@/data/glossary"
import { imagePrompts } from "@/data/imagePrompts"
import { templates } from "@/data/templates"

const hotKeywords = ["钱包", "代理", "注单", "支付通道", "风控规则", "上线检查"]

export function HomeStats() {
  const stats = [
    { label: "文章", value: articles.length },
    { label: "术语", value: glossary.length },
    { label: "模板", value: templates.length },
    { label: "信息图", value: imagePrompts.length },
  ]

  return (
    <section className="container-shell py-8">
      <div className="grid gap-4 rounded-xl border border-line bg-white p-6 shadow-sm md:grid-cols-[0.8fr_1.2fr] md:p-8">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-paper p-4">
              <div className="text-3xl font-semibold text-ink">{stat.value}</div>
              <div className="mt-1 text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">热门搜索</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {hotKeywords.map((keyword) => (
              <Link key={keyword} href={`/search?q=${encodeURIComponent(keyword)}`} className="rounded-full border border-line bg-white px-3 py-2 text-sm text-muted hover:border-brand-100 hover:text-brand-700">
                {keyword}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-muted">从热门词进入，可以同时检索文章、术语和模板，适合快速定位知识点。</p>
        </div>
      </div>
    </section>
  )
}
