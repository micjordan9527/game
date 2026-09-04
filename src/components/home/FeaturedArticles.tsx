import { ArticleCard } from "@/components/common/ArticleCard"
import { SectionHeader } from "@/components/common/SectionHeader"
import { getFeaturedArticles } from "@/lib/site"

export function FeaturedArticles() {
  return (
    <section className="container-shell py-12">
      <SectionHeader title="推荐先读文章" description="先建立全局概念，再逐步进入钱包、代理、后台、接口和风控等主题。" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {getFeaturedArticles().map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  )
}
