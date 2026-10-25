import { contentUpdates } from "@/data/contentUpdates"
import Link from "next/link"
import {
  ArrowRight,
  Gift,
  LayoutDashboard,
  Network,
  Search,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { ShowcaseGrid } from "@/components/common/ShowcaseGrid"
import { homeContent } from "@/data/homeContent"
import { showcaseItems } from "@/data/showcase"
import { imagePrompts } from "@/data/imagePrompts"
import { aiWorkflows } from "@/data/aiWorkflowLibrary"
import { workRoles } from "@/data/workRoles"
import { assetPath } from "@/lib/assets"

const topicIcons: Record<string, LucideIcon> = {
  member: Users,
  wallet: Wallet,
  agent: Network,
  campaign: Gift,
  admin: LayoutDashboard,
  sports: Trophy,
}

function selectResource<T extends { slug: string }>(items: T[], slug: string): T {
  const item = items.find((entry) => entry.slug === slug)
  if (!item) throw new Error(`Homepage resource missing: ${slug}`)
  return item
}

export default function HomePage() {
  const cases = homeContent.caseSlugs.map((slug) => selectResource(showcaseItems, slug))
  const diagrams = homeContent.diagrams.map((selection) => ({
    ...selection,
    image: selectResource(imagePrompts, selection.slug),
  }))
  const workflows = homeContent.workflowSlugs.map((slug) => selectResource(aiWorkflows, slug))
  const updates = contentUpdates

  return (
    <div className="container-shell py-6 md:py-8">
      <header aria-label="知识库搜索">
        <h1 className="text-3xl font-semibold text-ink md:text-4xl">包网知识库</h1>
        <p className="mt-2 text-sm leading-7 text-muted">案例、业务图解、AI 工作流、素材与模板。</p>
        <form
          action={assetPath("/search")}
          method="get"
          role="search"
          aria-label="首页搜索"
          className="mt-4 flex min-w-0 items-center gap-2 rounded-xl border border-line bg-white p-1.5 focus-within:border-brand-300"
        >
          <Search className="ml-2 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <label htmlFor="home-query" className="sr-only">
            搜索知识库
          </label>
          <input
            id="home-query"
            type="search"
            name="q"
            placeholder="搜索会员、钱包、代理、后台、素材…"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            搜索
          </button>
        </form>
        <nav aria-label="常用资料" className="mt-3 flex flex-wrap gap-2">
          {homeContent.quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex h-9 items-center rounded-md border border-line bg-white px-3 text-xs font-semibold text-muted hover:text-brand-700"
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </header>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <section aria-labelledby="home-topics-title" className="min-w-0 xl:order-2">
          <h2 id="home-topics-title" className="text-xl font-semibold text-ink">
            业务主题
          </h2>
          <nav aria-label="业务主题导航" className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
            {homeContent.topics.map((topic) => {
              const Icon = topicIcons[topic.icon]
              return (
                <Link
                  key={topic.href}
                  href={topic.href}
                  className="min-w-0 rounded-lg border border-line bg-white p-3 transition hover:border-brand-200 hover:bg-brand-50/40"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink">{topic.title}</span>
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted">{topic.description}</span>
                </Link>
              )
            })}
          </nav>
          <nav aria-label="按角色浏览" className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
            <span className="mr-1 text-xs text-muted">角色</span>
            {workRoles.map((role) => (
              <Link
                key={role.slug}
                href={`/roles/${role.slug}`}
                className="rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-muted hover:bg-brand-50 hover:text-brand-700"
              >
                {role.title}
              </Link>
            ))}
          </nav>
        </section>
        <section aria-labelledby="home-cases-title" className="min-w-0 xl:order-1">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="home-cases-title" className="text-xl font-semibold text-ink">
              精选案例
            </h2>
            <Link href="/cases" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
              全部案例
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ShowcaseGrid items={cases} titleAs="h3" />
        </section>
      </div>

      <section aria-labelledby="home-diagrams-title" className="mt-8 border-t border-line pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="home-diagrams-title" className="text-xl font-semibold text-ink">
            功能图解
          </h2>
          <Link href="/articles" className="text-xs font-semibold text-brand-700">
            全部图解 →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {diagrams.map((item) => (
            <Link
              key={item.slug}
              href={`/articles/${item.image.articleSlug}#scenario`}
              className="group min-w-0 overflow-hidden rounded-xl border border-line bg-white hover:border-brand-200"
            >
              <div className="aspect-[16/9] overflow-hidden bg-paper">
                <img
                  src={assetPath(item.image.imageSrcAvif ?? item.image.imageSrcWebp ?? item.image.imageSrc)}
                  alt={`${item.title}图解预览`}
                  width={item.image.width ?? 1600}
                  height={item.image.height ?? 900}
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-ink group-hover:text-brand-700">{item.title}</h3>
                <p className="mt-1 text-sm leading-7 text-muted">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-workflows-title" className="mt-8 border-t border-line pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="home-workflows-title" className="text-xl font-semibold text-ink">
            AI 工作流
          </h2>
          <Link href="/ai-workflows" className="text-xs font-semibold text-brand-700">
            全部工作流 →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {workflows.map((workflow) => {
            const output = workflow.outputs[0]
            return (
              <Link
                key={workflow.slug}
                href={`/ai-workflows/${workflow.slug}`}
                className="group grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-white hover:border-brand-200 sm:grid-cols-[9rem_minmax(0,1fr)]"
              >
                <img
                  src={assetPath(output.image)}
                  alt={`${workflow.title}成果预览`}
                  width={output.width}
                  height={output.height}
                  loading="lazy"
                  className="h-full min-h-32 w-full bg-paper object-cover object-top"
                />
                <div className="min-w-0 p-4">
                  <span className="text-xs font-semibold text-brand-700">
                    {workflow.scenario} · {workflow.outputs.length} 张成果
                  </span>
                  <h3 className="mt-2 font-semibold text-ink group-hover:text-brand-700">{workflow.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted">{workflow.summary}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="home-updates-title" className="mt-8 border-t border-line pt-6">
        <h2 id="home-updates-title" className="text-xl font-semibold text-ink">
          最近更新
        </h2>
        <ul className="mt-4 divide-y divide-line rounded-xl border border-line bg-white">
          {updates.map((article) => (
            <li key={article.href}>
              <Link
                href={article.href}
                className="flex flex-col gap-2 px-4 py-3 hover:bg-paper sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="min-w-0"><span className="block text-sm font-semibold leading-6 text-ink">{article.title}</span><span className="mt-1 block text-xs leading-6 text-muted">{article.description}</span></span>
                <span className="flex shrink-0 gap-3 text-xs text-muted">
                  <span>{article.kind}</span>
                  <time dateTime={article.date}>{article.date}</time>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
