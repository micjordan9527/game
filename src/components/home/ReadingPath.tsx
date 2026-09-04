import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { articles } from "@/data/articles"
import { learningPaths } from "@/data/topicGuides"
import { SectionHeader } from "@/components/common/SectionHeader"

export function ReadingPath() {
  const pathCards = learningPaths.map((path) => ({
    ...path,
    articleCount: path.articleSlugs.length,
    articleTitleHint: path.articleSlugs
      .map((slug) => articles.find((article) => article.slug === slug))
      .filter((article): article is (typeof articles)[number] => Boolean(article))
      .slice(0, 2)
      .map((article) => article.title)
      .join(" · "),
  }))

  return (
    <section className="container-shell py-12">
      <SectionHeader title="新手阅读路径" description="如果你刚开始了解这个行业，可以按这个顺序建立完整认知。" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {pathCards.map((step, index) => (
          <Link key={step.title} href={step.href} className="group rounded-lg border border-line bg-white p-5 shadow-sm hover:border-brand-100 hover:shadow-soft">
            <div className="text-sm font-semibold text-brand-700">0{index + 1}</div>
            <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{step.description}</p>
            <p className="mt-2 text-xs text-muted">
              关键文章：{step.articleCount > 0 ? step.articleTitleHint : "持续补充中"}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
              进入阅读
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
