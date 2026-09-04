import Link from "next/link"
import { ArrowLeft, BookOpen, ListChecks, Smartphone } from "lucide-react"
import { bettingExplanationRowCount, bettingExplanationSections } from "@/data/sports"
import { BettingExplanationBrowser } from "@/components/sports/BettingExplanationBrowser"
import { absoluteUrl } from "@/lib/seo"

export const metadata = {
  title: "玩法解读",
  description: "体育玩法解读对照表：玩法类型、方向、盘口、UI 展示和用户理解说明。",
  alternates: {
    canonical: absoluteUrl("/sports/betting-explanation"),
  },
}

export default function BettingExplanationPage() {
  return (
    <div className="container-shell py-10 md:py-12">
      <Link href="/sports" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        返回体育模块
      </Link>

      <section className="mt-8 rounded-lg border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="mb-2 text-sm font-semibold text-brand-700">Sports Playbook</p>
        <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">玩法解读</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
          把常见体育玩法拆成玩法类型、方向、盘口、前端展示和一句话解释，方便产品、运营、客服、规则页和帮助中心统一理解。
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-paper p-4">
            <BookOpen className="h-5 w-5 text-brand-700" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-ink">{bettingExplanationSections.length} 个玩法分组</p>
            <p className="mt-1 text-xs leading-5 text-muted">让球、大小、独赢、波胆、双重机会、半全场、角球。</p>
          </div>
          <div className="rounded-lg bg-paper p-4">
            <ListChecks className="h-5 w-5 text-brand-700" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-ink">{bettingExplanationRowCount} 条对照规则</p>
            <p className="mt-1 text-xs leading-5 text-muted">每条都对应 UI 展示和用户理解说明。</p>
          </div>
          <div className="rounded-lg bg-paper p-4">
            <Smartphone className="h-5 w-5 text-brand-700" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-ink">适合多端阅读</p>
            <p className="mt-1 text-xs leading-5 text-muted">桌面端看表格，移动端看卡片，方便快速解释规则。</p>
          </div>
        </div>
      </section>

      <BettingExplanationBrowser sections={bettingExplanationSections} />
    </div>
  )
}
