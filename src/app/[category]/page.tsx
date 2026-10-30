import { notFound } from "next/navigation"
import Link from "next/link"
import { categories } from "@/data/categories"
import { getArticlesByCategory } from "@/lib/site"
import { absoluteUrl } from "@/lib/seo"
import { ArticleCard } from "@/components/common/ArticleCard"
import { DesignExperienceHub } from "@/components/design/DesignExperienceHub"
import { FeatureFlow } from "@/components/common/FeatureFlow"
import { Suspense } from "react"
import { OperationDirectory } from "@/components/operation/OperationDirectory"
import { operationTopicArticles } from "@/lib/operation-navigation"
import SportsPage from "@/app/sports/page"
const maps: Record<string, string[]> = {
  industry: ["会员与代理", "游戏与内容", "支付与钱包", "后台与风控"],
  "white-label": ["前台页面", "后台系统", "游戏与支付", "上线与维护"],
  product: ["会员状态", "资金流程", "代理关系", "活动与报表"],
  design: ["页面布局", "组件与状态", "移动端反馈", "素材规范"],
  development: ["接口接入", "状态流转", "数据记录", "异常处理"],
  "devops-risk": ["发现异常", "判断影响", "处理与恢复", "日志追溯"],
}
export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }))
}
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = categories.find((item) => item.slug === slug)
  return category
    ? { title: category.title, description: category.description, alternates: { canonical: absoluteUrl(`/${slug}`) } }
    : {}
}
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = categories.find((item) => item.slug === slug)
  if (!category) notFound()
  if (slug === "sportsbook") return <SportsPage />
  const articles = getArticlesByCategory(slug)
  return (
    <div className="container-shell py-8">
      <h1 className="text-3xl font-semibold text-ink">{category.title}</h1>
      <p className="mt-3 text-sm leading-7 text-muted">{category.description}</p>
      {slug === "operation" ? <Suspense fallback={<p className="py-6 text-sm text-muted">正在读取运营目录…</p>}><OperationDirectory articles={operationTopicArticles()} /></Suspense> : <FeatureFlow
        title={`${category.title}全景`}
        caption="选择下面的图解或原型查看具体内容。"
        steps={(maps[slug] ?? []).map((title, index) => ({
          title,
          text: ["认识对象与关系", "看清页面与流程", "对齐状态与反馈", "查看完整方案"][index],
        }))}
      />}
      {slug === "design" ? <DesignExperienceHub /> : null}
      {slug !== "operation" ? <section className="mt-6" aria-label="栏目图解">
        <h2 className="mb-5 text-xl font-semibold text-ink">本主题图解</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section> : null}
      <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-5">
        <Link href="/cases" className="text-sm font-semibold text-brand-700">
          查看案例 →
        </Link>
        <Link href="/templates" className="text-sm font-semibold text-brand-700">
          可用模板 →
        </Link>
      </div>
    </div>
  )
}
