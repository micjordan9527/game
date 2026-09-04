import { articles } from "@/data/articles"
import { ArticleCard } from "@/components/common/ArticleCard"

export function RelatedArticles({ category, currentSlug, tags = [] }: { category: string; currentSlug: string; tags?: string[] }) {
  const related = articles
    .filter((article) => article.slug !== currentSlug)
    .map((article) => ({
      article,
      score: (article.category === category ? 2 : 0) + article.tags.filter((tag) => tags.includes(tag)).length * 3,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.article)

  if (related.length === 0) return null

  return (
    <section className="container-shell max-w-4xl py-10">
      <h2 className="text-2xl font-semibold text-ink">相关阅读</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {related.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  )
}
