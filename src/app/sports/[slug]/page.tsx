import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { sportsModules } from "@/data/sports"
import { sportsGuides } from "@/data/sportsGuides"
import { articles } from "@/data/articles"
import { absoluteUrl } from "@/lib/seo"
import { SportsProductWalkthrough } from "@/components/sports/SportsProductWalkthrough"
import { SportsOddsDemo } from "@/components/sports/SportsOddsDemo"
import { BetTicketTimeline } from "@/components/sports/BetTicketTimeline"
import { MatchStatusDemo } from "@/components/sports/MatchStatusDemo"
import { SportsAdminConfigDemo } from "@/components/sports/SportsAdminConfigDemo"
import { SportsRiskScenarioDemo } from "@/components/sports/SportsRiskScenarioDemo"
import { SportsTradingDemo } from "@/components/sports/SportsTradingDemo"
import { SportsSettlementReconciliationDemo } from "@/components/sports/SportsSettlementReconciliationDemo"
import { SportsOperationScenesDemo } from "@/components/sports/SportsOperationScenesDemo"
import { SportsServiceRulesDemo } from "@/components/sports/SportsServiceRulesDemo"
import { SportsDesignExperienceDemo } from "@/components/sports/SportsDesignExperienceDemo"
import { SportsIntegrationDemo } from "@/components/sports/SportsIntegrationDemo"
import { SportsManagementDashboardDemo } from "@/components/sports/SportsManagementDashboardDemo"

export const dynamicParams = false

export function generateStaticParams() {
  return sportsGuides.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const module = sportsModules.find((item) => item.slug === slug)
  if (!module) notFound()
  return { title: module.title, description: module.description, alternates: { canonical: absoluteUrl(module.href) } }
}

export default async function SportsGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = sportsGuides.find((item) => item.slug === slug)
  const module = sportsModules.find((item) => item.slug === slug)
  if (!guide || !module) notFound()
  const related = guide.relatedArticleSlugs.flatMap((articleSlug) => articles.filter((article) => article.slug === articleSlug))
  const guideModules = sportsModules.filter((item) => sportsGuides.some((entry) => entry.slug === item.slug))
  const currentIndex = guideModules.findIndex((item) => item.slug === slug)
  const previousGuide = currentIndex > 0 ? guideModules[currentIndex - 1] : undefined
  const nextGuide = currentIndex >= 0 && currentIndex < guideModules.length - 1 ? guideModules[currentIndex + 1] : undefined
  const introductions: Record<string, string> = {
    "match-data-status": "比赛进行到哪一步，盘口和注单就该怎样处理？用六个场景看清它们之间的关系。",
    "sports-product": "从找比赛到查注单，看看四个页面怎样接起来，以及钱包和后台各自负责什么。",
    "sports-odds-basics": "换个玩法、换个比分，看看盘口怎样影响判定，再分清盘口条件与赔率数字。",
    "bet-ticket-lifecycle": "跟着一张注单走过提交、受理、结算与到账，再看看超时、退款和更正时发生什么。",
    "sports-admin-config": "在后台调整赛事、玩法、限额和赔率，看看前台、投注单和操作日志如何一起变化。",
    "sports-risk": "从普通投注到异常信号，看看体育风控如何做出放行、限额、复核或拦截判断。",
    "sports-trading": "从赛前到滚球，观察事件、赔率、市场状态和已受理注单怎样被清楚地区分和处理。",
    "sports-settlement-reconciliation": "把赛果、注单和钱包流水放在一起，看看什么情况下可以派奖，什么情况下必须先暂停核对。",
    "sports-operation-scenes": "从热门赛事推荐到赛前提醒，看看运营触达如何同时照顾用户条件、赛事状态和清楚说明。",
    "sports-service-rules": "从用户提问出发，看看客服如何通过注单、赛果和资金记录解释当前处理状态。",
    "sports-design-experience": "从一张投注单的四种状态，看看体育页面如何把关键信息、操作和反馈讲清楚。",
    "sports-integration": "从数据事件到资金结算，看看体育接口如何通过状态、版本和唯一标识保持链路一致。",
    "sports-management-dashboard": "从赛事、结算、风险与资金状态出发，看看管理看板如何帮助负责人发现并处理异常。",
  }

  return (
    <div className="container-shell py-10 md:py-12">
      <Link href="/sports" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />返回体育模块
      </Link>
      <header className="mt-8 rounded-lg border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-brand-700">{module.category} · 专题阅读</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink md:text-3xl">{module.title}</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-muted">{introductions[slug] ?? module.description}</p>
      </header>
      <nav aria-label="本页导航" className="mt-4 flex flex-wrap gap-2 rounded-lg border border-line bg-paper p-3">
        <a href="#demo" className="rounded-md bg-white px-3 py-2 text-sm font-medium text-brand-700 hover:underline">互动演示</a>
        <a href="#guide" className="rounded-md bg-white px-3 py-2 text-sm font-medium text-brand-700 hover:underline">核心概念</a>
        <a href="#related" className="rounded-md bg-white px-3 py-2 text-sm font-medium text-brand-700 hover:underline">延伸阅读</a>
      </nav>
      <div id="demo" className="scroll-mt-24">
        {slug === "sports-product" && <SportsProductWalkthrough />}
        {slug === "sports-odds-basics" && <SportsOddsDemo />}
        {slug === "bet-ticket-lifecycle" && <BetTicketTimeline />}
        {slug === "match-data-status" && <MatchStatusDemo />}
        {slug === "sports-admin-config" && <SportsAdminConfigDemo />}
        {slug === "sports-risk" && <SportsRiskScenarioDemo />}
        {slug === "sports-trading" && <SportsTradingDemo />}
        {slug === "sports-settlement-reconciliation" && <SportsSettlementReconciliationDemo />}
        {slug === "sports-operation-scenes" && <SportsOperationScenesDemo />}
        {slug === "sports-service-rules" && <SportsServiceRulesDemo />}
        {slug === "sports-design-experience" && <SportsDesignExperienceDemo />}
        {slug === "sports-integration" && <SportsIntegrationDemo />}
        {slug === "sports-management-dashboard" && <SportsManagementDashboardDemo />}
      </div>
      <article id="guide" className="mt-6 scroll-mt-24 space-y-6">
        {guide.sections.map((section, index) => (
          <details key={section.title} id={`section-${index + 1}`} className="scroll-mt-24 rounded-lg border border-line bg-white p-6 shadow-sm md:p-8">
            <summary className="cursor-pointer text-base font-semibold text-ink">深入了解：{section.title}</summary>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 max-w-3xl text-base leading-8 text-muted">{paragraph}</p>)}
            <div className="mt-5 rounded-lg bg-paper p-4">
              <h3 className="text-sm font-semibold text-ink">评审时检查</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
                {section.checks.map((check) => <li key={check}>{check}</li>)}
              </ul>
            </div>
          </details>
        ))}
      </article>
      <section id="related" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-ink">延伸阅读</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/sports/betting-explanation" className="rounded-lg border border-line bg-white p-4 text-sm font-semibold text-brand-700 hover:underline">玩法解读与规则对照 <ArrowRight className="inline h-4 w-4" aria-hidden="true" /></Link>
          {related.map((article) => <Link key={article.slug} href={`/articles/${article.slug}`} className="rounded-lg border border-line bg-white p-4 text-sm font-semibold text-brand-700 hover:underline">{article.title} <ArrowRight className="inline h-4 w-4" aria-hidden="true" /></Link>)}
        </div>
      </section>
      {(previousGuide || nextGuide) && <section className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="继续学习">
        {previousGuide ? <Link href={previousGuide.href} className="rounded-lg border border-line bg-white p-4 text-sm transition hover:border-brand-100"><span className="text-xs text-muted">前置阅读</span><span className="mt-2 flex items-center gap-2 font-semibold text-brand-700"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{previousGuide.title}</span></Link> : <div />}
        {nextGuide ? <Link href={nextGuide.href} className="rounded-lg border border-line bg-white p-4 text-right text-sm transition hover:border-brand-100"><span className="text-xs text-muted">下一篇</span><span className="mt-2 flex items-center justify-end gap-2 font-semibold text-brand-700">{nextGuide.title}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span></Link> : null}
      </section>}
    </div>
  )
}
