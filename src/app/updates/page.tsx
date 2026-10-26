import type { Metadata } from "next"
import Link from "next/link"
import { ChevronDown, ExternalLink } from "lucide-react"
import { ReleaseHashNavigation } from "@/components/updates/ReleaseHashNavigation"
import { CopyTemplateButton } from "@/components/templates/CopyTemplateButton"
import { articles } from "@/data/articles"
import { knowledgeContentUpdates } from "@/data/knowledgeContentUpdates"
import releases from "@/data/releaseHistory.json"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "更新记录",
  description: "按发布版本查看变化、所在位置和直接入口。",
  alternates: { canonical: absoluteUrl("/updates") },
}

type Change = {
  id: string
  title: string
  description: string
  location: string
  href: string
  linkLabel: string
  titleHref?: string
  related?: { href: string; label: string }
}

const relatedLabels: Record<string, string> = {
  "/articles/agent-system-design#agent-settlement-case": "代理结算演示",
  "/articles/wallet-payment-reconciliation#reconciliation-case": "钱包对账演示",
  "/articles/campaign-risk-review#scenario": "活动规则场景",
  "/articles/bet-ticket-status#scenario": "注单状态场景",
  "/cases/admin-optimization#admin-role-tour": "后台三角色导览",
  "/articles/wallet-payment-reconciliation#withdrawal-case": "提现异常演示",
  "/articles/data-report-metrics": "报表口径说明",
  "/cases/white-label-official#official-responsive-comparison": "官网桌面与手机对照",
  "/articles/monitoring-incident-recovery": "故障恢复说明",
  "/design/states": "界面状态对照",
}

function ChangeRow({ item, compact = false }: { item: Change; compact?: boolean }) {
  return (
    <li id={item.id} className={`min-w-0 scroll-mt-24 first:pt-0 last:pb-0 ${compact ? "py-3" : "py-5"}`}>
      <h3 className="font-semibold leading-7 text-ink">
        {item.titleHref ? <Link href={item.titleHref} className="hover:text-brand-700">{item.title}</Link> : item.title}
      </h3>
      <p className={`mt-1 text-sm text-muted ${compact ? "leading-6" : "leading-7"}`}>{item.description}</p>
      <div className={compact ? "mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1" : "mt-2"}>
        <p className="text-xs leading-6 text-muted">位置：{item.location}</p>
        <div className={`${compact ? "" : "mt-2"} flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-brand-700`}>
          <Link href={item.href}>{item.linkLabel} →</Link>
          {item.related ? <Link href={item.related.href}>{item.related.label} →</Link> : null}
        </div>
      </div>
    </li>
  )
}

function formatPublished(value: string) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Kuala_Lumpur", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(value))
}

export default function UpdatesPage() {
  const current = releases.current
  return (
    <div className="container-shell max-w-5xl py-8 md:py-10">
      <ReleaseHashNavigation />
      <header>
        <h1 className="text-3xl font-semibold text-ink">更新记录</h1>
        <p className="mt-2 text-sm leading-7 text-muted">查看每次发布的变化、所在位置和对应入口。</p>
      </header>

      <section id="current-release" className="mt-6 scroll-mt-24 rounded-xl border border-brand-100 bg-white p-5 md:p-7" aria-labelledby="current-release-title">
        <span id={`v${current.version}`} className="block scroll-mt-24" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-ink px-3 py-1 text-sm font-semibold text-white">v{current.version}</span>
            <span className="text-xs font-semibold text-brand-700">当前版本</span>
            <CopyTemplateButton content={absoluteUrl(`/updates#v${current.version}`)} label={`复制 v${current.version} 链接`} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            <p>更新日期：<time dateTime={current.date}>{current.date}</time></p>
            <a href="https://github.com/micjordan9527/game/tree/main" className="inline-flex items-center gap-1 font-semibold text-brand-700">GitHub 源码<ExternalLink className="h-3 w-3" aria-hidden="true" /></a>
          </div>
        </div>
        <h2 id="current-release-title" className="mt-4 text-xl font-semibold text-ink">{current.title}</h2>
        <p className="mt-2 text-sm leading-7 text-muted">{current.summary}</p>
        <p className="mt-2 text-xs text-muted">本次页面调整 {current.changes.length} 项</p>
        <ul className="mt-5 divide-y divide-line">
          {current.changes.map((item) => <ChangeRow key={item.id} item={item} compact />)}
        </ul>
      </section>

      <section id="release-history" className="scroll-mt-24 pt-8" aria-labelledby="release-history-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="release-history-title" className="text-xl font-semibold text-ink">历史版本</h2>
          <nav aria-label="版本定位" className="flex flex-wrap gap-2">
            {releases.history.map((release) => <a key={release.version} href={`#v${release.version}`} className="rounded-md border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted hover:text-brand-700">v{release.version}</a>)}
          </nav>
        </div>
        <div id="knowledge-content" className="scroll-mt-24">
          <p className="mt-3 text-xs leading-6 text-muted">v11–v13 内容更新：新增 8 篇、补充 7 篇、GPT 配图 15 张。全站文章 {articles.length} 篇。演算与生成配图均有示例标识。</p>
          <div className="mt-4 space-y-3">
            {releases.history.map((release) => {
              const content = release.articleSlugs.map((slug) => {
                const item = knowledgeContentUpdates.find((entry) => entry.slug === slug)
                if (!item) throw new Error(`Missing release article: ${slug}`)
                return item
              })
              const added = content.filter((item) => item.kind === "新增").length
              const enriched = content.length - added
              const counts = [added ? `新增文章 ${added} 篇` : "", enriched ? `补充文章 ${enriched} 篇` : "", content.length ? `GPT 配图 ${content.length} 张` : "", release.changes.length ? `页面变化 ${release.changes.length} 项` : ""].filter(Boolean).join(" · ")
              const changes: Change[] = [
                ...content.map((item) => ({ id: item.slug, title: item.title, description: item.description, location: "文章正文 · " + decodeURIComponent(item.detailHref.split("#")[1]), href: item.detailHref, linkLabel: item.kind === "补充" ? "查看补充说明" : "查看专题重点", titleHref: item.href, related: { href: item.relatedHref, label: relatedLabels[item.relatedHref] ?? "相关说明" } })),
                ...release.changes,
              ]
              return (
                <details key={release.version} id={`v${release.version}`} data-release-version={release.version} data-release-kind={content.length ? "content" : "interface"} className="group scroll-mt-24 rounded-xl border border-line bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 md:p-5 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-semibold text-ink">v{release.version}</span>
                        <span className="text-sm font-semibold leading-6 text-ink">{release.title}</span>
                      </span>
                      <span className="mt-1 block text-xs leading-6 text-muted">{counts}</span>
                      <time dateTime={release.publishedAt} className="mt-1 block text-xs leading-5 text-muted">发布于 {formatPublished(release.publishedAt)}（UTC+8）</time>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="border-t border-line p-4 md:p-5">
                    {release.version === 14 ? <div id="top-navigation" className="scroll-mt-24"><p id="top-navigation-title" className="mb-4 text-xs font-semibold text-muted">顶部导航调整</p></div> : null}
                    <ul className="divide-y divide-line" data-release-items>
                      {changes.map((item) => <ChangeRow key={item.id} item={item} />)}
                    </ul>
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-4">
                      <CopyTemplateButton content={absoluteUrl(`/updates#v${release.version}`)} label={`复制 v${release.version} 链接`} />
                      <a href={`https://github.com/micjordan9527/game/commit/${release.githubCommit}`} className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700">查看 v{release.version} 源码提交 <ExternalLink className="h-3 w-3" aria-hidden="true" /></a>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      <section id="demonstrations" className="mt-8 scroll-mt-24 border-t border-line pt-6" aria-labelledby="demonstrations-title">
        <h2 id="demonstrations-title" className="text-lg font-semibold text-ink">功能演示目录</h2>
        <p className="mt-2 text-sm leading-7 text-muted">钱包、账号、代理、BM、U8、官网与界面状态等 10 个已有演示。</p>
        <Link href="/updates/demonstrations" className="mt-3 inline-block text-sm font-semibold text-brand-700">查看 10 个功能演示 →</Link>
      </section>
    </div>
  )
}
