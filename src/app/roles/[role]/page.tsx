import Link from "next/link"
import { notFound } from "next/navigation"
import { getWorkRole, workRoles } from "@/data/workRoles"
import { showcaseItems } from "@/data/showcase"
import { templates } from "@/data/templates"
import { articles } from "@/data/articles"
import { ShowcaseGrid } from "@/components/common/ShowcaseGrid"
import { ArticleCard } from "@/components/common/ArticleCard"
import { absoluteUrl } from "@/lib/seo"
export function generateStaticParams() {
  return workRoles.map((role) => ({ role: role.slug }))
}
export async function generateMetadata({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const entry = getWorkRole(role)
  return entry
    ? {
        title: `${entry.title}精选`,
        description: `从${entry.title}视角查看案例、功能图解与实用资料。`,
        alternates: { canonical: absoluteUrl(`/roles/${role}`) },
      }
    : {}
}
export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const entry = getWorkRole(role)
  if (!entry) notFound()
  const hrefs = new Set(entry.steps.map((step) => step.href))
  const works = showcaseItems.filter((item) => hrefs.has(item.href))
  const selectedArticles = articles.filter((item) => hrefs.has(`/articles/${item.slug}`))
  const extra = entry.steps.filter(
    (item) => !item.href.startsWith("/articles/") && !works.some((work) => work.href === item.href)
  )
  return (
    <div className="container-shell py-8">
      <Link href="/" className="text-sm font-semibold text-muted">
        ← 首页
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-ink">{entry.title}精选</h1>
      <p className="mt-3 text-sm leading-7 text-muted">从{entry.title}视角查看案例、功能图解与实用资料。</p>
      <nav aria-label="角色资料筛选" className="my-5 flex flex-wrap gap-2">
        {workRoles.map((item) => (
          <Link
            key={item.slug}
            href={`/roles/${item.slug}`}
            aria-current={item.slug === role ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${item.slug === role ? "border-ink bg-ink text-white" : "border-line bg-white text-muted"}`}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      {works.length ? <ShowcaseGrid items={works} /> : null}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {selectedArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {extra.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-lg border border-line bg-white p-4">
            <span className="text-xs text-muted">{item.kind}</span>
            <h2 className="mt-2 font-semibold text-ink">
              {templates.find((template) => item.href === `/templates/${template.slug}`)?.title ?? item.title} →
            </h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
