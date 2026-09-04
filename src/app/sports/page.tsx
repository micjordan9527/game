import Link from "next/link"
import { ArrowRight, ChartNoAxesCombined, ShieldCheck, Trophy } from "lucide-react"
import { sportsModules } from "@/data/sports"
import { absoluteUrl } from "@/lib/seo"

export const metadata = {
  title: "体育博彩模块",
  description: "系统整理体育博彩玩法、产品结构、风控场景和操盘基础资料。",
  alternates: {
    canonical: absoluteUrl("/sports"),
  },
}

export default function SportsPage() {
  return (
    <div className="container-shell py-10 md:py-12">
      <section className="rounded-lg border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="mb-2 text-sm font-semibold text-brand-700">Sports</p>
        <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">体育博彩模块</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
          这里系统整理体育博彩的玩法规则、产品结构、风控场景、操盘语言、盘口赔率和后台配置等资料。
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-paper p-4">
            <Trophy className="h-5 w-5 text-brand-700" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-ink">玩法基础</p>
            <p className="mt-1 text-xs leading-5 text-muted">先把用户能看到、客服要解释的玩法讲清楚。</p>
          </div>
          <div className="rounded-lg bg-paper p-4">
            <ChartNoAxesCombined className="h-5 w-5 text-brand-700" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-ink">产品结构</p>
            <p className="mt-1 text-xs leading-5 text-muted">理解赛事、盘口、注单、结算和后台配置。</p>
          </div>
          <div className="rounded-lg bg-paper p-4">
            <ShieldCheck className="h-5 w-5 text-brand-700" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-ink">风控操盘</p>
            <p className="mt-1 text-xs leading-5 text-muted">理解限额、审核、异常识别和盘口变化。</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {sportsModules.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className={[
              "group rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-brand-100 hover:shadow-soft",
              item.status === "待开放" ? "pointer-events-none opacity-75" : "",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Trophy className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className={["rounded-md px-2.5 py-1 text-xs font-medium", item.status === "已开放" ? "bg-brand-50 text-brand-700" : "bg-paper text-muted"].join(" ")}>
                {item.status}
              </span>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <span className="rounded-md bg-paper px-2.5 py-1 text-xs font-medium text-muted">{item.category}</span>
              <span className="text-xs text-muted">建议 {item.estimatedMinutes} 分钟</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-ink">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-paper px-2.5 py-1 text-xs font-medium text-muted">
                  {tag}
                </span>
              ))}
            </div>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 group-hover:underline">
              {item.status === "已开放" ? "查看模块" : "待开放"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}
