import { ArticleCard } from "@/components/common/ArticleCard"
import { SectionHeader } from "@/components/common/SectionHeader"
import { articles } from "@/data/articles"

export function LatestArticles() {
  const latestArticles = [...articles].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")).slice(0, 4)

  return (
    <section className="container-shell py-12">
      <SectionHeader title="最新更新" description="最近补充和精修的内容，适合回访时快速查看。" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {latestArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  )
}
