import Link from "next/link"
import { ArrowRight, BookOpen, BriefcaseBusiness, ClipboardList, Layers3, Library, Search, Sparkles } from "lucide-react"
import { CategoryGrid } from "@/components/home/CategoryGrid"
import { FeaturedArticles } from "@/components/home/FeaturedArticles"
import { LatestArticles } from "@/components/home/LatestArticles"
import { learningPaths } from "@/data/topicGuides"
import { articles } from "@/data/articles"
import { glossary } from "@/data/glossary"
import { templates } from "@/data/templates"
import { caseItems } from "@/data/cases"

const startingPoints = [
  { href: "/industry", title: "新手入门", description: "先认识平台角色、业务关系与基本术语。", icon: BookOpen },
  { href: "/product", title: "专题研究", description: "围绕产品、运营、设计和系统结构深入理解。", icon: Layers3 },
  { href: "/cases", title: "实战复用", description: "从案例、模板和 AI 工作流开始解决具体问题。", icon: BriefcaseBusiness },
]

const resources = [
  { href: "/articles", label: "文章资料", description: "按主题、难度和读者角色查阅", icon: BookOpen },
  { href: "/glossary", label: "术语库", description: "快速理解概念及实际业务场景", icon: Search },
  { href: "/templates", label: "工作模板", description: "复制需求清单、评审及复盘材料", icon: ClipboardList },
  { href: "/ai-workflows", label: "AI 工作流", description: "复用设计与内容生产流程", icon: Sparkles },
]

export default function HomePage() {
  return (
    <>
      <section className="container-shell py-10 md:py-14">
        <div className="grid gap-6 rounded-xl border border-line bg-white p-6 shadow-sm lg:grid-cols-[1.3fr_0.7fr] lg:p-10">
          <div>
            <span className="inline-flex rounded-md bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">专业知识与实战资料</span>
            <h1 className="mt-5 text-4xl font-semibold tracking-normal text-ink md:text-5xl">包网知识库</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">用产品、运营、设计与技术视角，理解平台系统和真实业务问题。从概念解释到实战案例，再到可以直接复用的工作模板。</p>
            <Link href="/search" className="mt-6 flex items-center gap-3 rounded-lg border border-line bg-paper px-4 py-4 text-sm text-muted transition hover:border-brand-200 hover:bg-white" aria-label="搜索全站知识库">
              <Search className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
              <span className="flex-1">搜索钱包、注单、风控、后台设计、工作流...</span>
              <span className="hidden text-xs text-muted sm:inline">全站搜索</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/industry" className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">从基础开始 <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/cases" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:border-brand-200">查看实战案例</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 self-center">
            {[
              { label: "知识文章", count: articles.length },
              { label: "行业术语", count: glossary.length },
              { label: "工作模板", count: templates.length },
              { label: "项目案例", count: caseItems.length },
            ].map((item) => <div key={item.label} className="rounded-lg border border-line bg-paper p-5">
              <div className="text-3xl font-semibold text-ink">{item.count}</div>
              <div className="mt-2 text-xs text-muted">{item.label}</div>
            </div>)}
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {startingPoints.map(({ href, title, description, icon: Icon }) => (
            <Link key={title} href={href} className="group flex gap-4 rounded-lg border border-line bg-white p-5 transition hover:border-brand-200 hover:shadow-soft">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></span>
              <span><strong className="text-base text-ink group-hover:text-brand-700">{title}</strong><span className="mt-2 block text-sm leading-6 text-muted">{description}</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell py-8 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-semibold text-brand-700">推荐阅读顺序</p><h2 className="mt-2 text-2xl font-semibold text-ink">从基础认知到项目交付</h2></div>
          <Link href="/articles" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">全部文章 <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {learningPaths.map((path, index) => <Link key={path.slug} href={path.href} className="rounded-lg border border-line bg-white p-5 hover:border-brand-200">
            <span className="text-xs font-semibold text-brand-700">阶段 {index + 1} · {path.difficulty}</span>
            <h3 className="mt-2 text-lg font-semibold text-ink">{path.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{path.description}</p>
            <p className="mt-4 text-xs text-muted">推荐阅读 {path.articleSlugs.length} 篇</p>
          </Link>)}
        </div>
      </section>

      <CategoryGrid />
      <FeaturedArticles />
      <section className="container-shell py-8 md:py-12">
        <div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-sm font-semibold text-brand-700">实用工具与资料</p><h2 className="mt-2 text-2xl font-semibold text-ink">把知识转成可复用成果</h2></div><Link href="/cases" className="text-sm font-semibold text-brand-700">查看案例 →</Link></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map(({ href, label, description, icon: Icon }) => <Link key={href} href={href} className="rounded-lg border border-line bg-white p-5 transition hover:border-brand-200 hover:shadow-soft">
            <Icon className="h-5 w-5 text-brand-700" /><h3 className="mt-4 font-semibold text-ink">{label}</h3><p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </Link>)}
        </div>
      </section>
      <LatestArticles />
    </>
  )
}
