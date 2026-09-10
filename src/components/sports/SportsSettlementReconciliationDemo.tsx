"use client"

import { useState } from "react"
import { CheckCircle2, CircleAlert, CreditCard, FileCheck2, Landmark, PauseCircle } from "lucide-react"

type ReconciliationScene = {
  name: string
  icon: typeof CheckCircle2
  tone: "ok" | "review" | "pause"
  result: string
  ticket: { status: string; result: string; amount: string }
  wallet: { status: string; flow: string; amount: string }
  source: { status: string; result: string; version: string }
  conclusion: string
  explanation: string
}

const scenes: ReconciliationScene[] = [
  {
    name: "正常派奖",
    icon: CheckCircle2,
    tone: "ok",
    result: "三方一致",
    ticket: { status: "已受理", result: "主胜 · 赔率 2.10", amount: "投注 100" },
    wallet: { status: "已入账", flow: "派奖流水 PAY-1024", amount: "+210" },
    source: { status: "已确认", result: "全场比分 2 : 0", version: "赛果版本 R-18" },
    conclusion: "可以完成结算",
    explanation: "赛果支持这张主胜注单，钱包也只生成一笔对应的派奖流水；注单、赛果与资金记录可相互追溯。",
  },
  {
    name: "等待赛果",
    icon: PauseCircle,
    tone: "pause",
    result: "赛果未确认",
    ticket: { status: "待结算", result: "主胜 · 赔率 2.10", amount: "投注 100" },
    wallet: { status: "无资金动作", flow: "等待结算指令", amount: "0" },
    source: { status: "同步中", result: "比赛已完场，赛果待确认", version: "等待版本" },
    conclusion: "暂停自动派奖",
    explanation: "比赛结束不代表可以立即改动余额。赛果来源与版本确认前，注单保持待结算，钱包不应提前生成派奖或退款。",
  },
  {
    name: "赛果冲突",
    icon: CircleAlert,
    tone: "review",
    result: "来源不一致",
    ticket: { status: "复核中", result: "主胜 · 赔率 2.10", amount: "投注 100" },
    wallet: { status: "资金冻结", flow: "不新增流水", amount: "0" },
    source: { status: "冲突", result: "来源 A 2 : 0 / 来源 B 1 : 0", version: "R-18 与 R-19" },
    conclusion: "先核对数据版本",
    explanation: "赛果互相矛盾时，不能根据任一来源直接派奖。要保留冲突版本、影响注单和最终判定依据，再统一处理。",
  },
  {
    name: "重复派奖",
    icon: CreditCard,
    tone: "review",
    result: "流水重复",
    ticket: { status: "已结算", result: "主胜 · 赔率 2.10", amount: "投注 100" },
    wallet: { status: "发现重复", flow: "PAY-1024 已存在", amount: "+210（重复请求）" },
    source: { status: "已确认", result: "全场比分 2 : 0", version: "赛果版本 R-18" },
    conclusion: "拒绝重复入账",
    explanation: "重复结算请求不能再次改变余额。用注单标识与资金流水唯一标识核对，可把重复请求留痕而不重复派奖。",
  },
]

const toneClasses = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-700",
  review: "border-amber-200 bg-amber-50 text-amber-700",
  pause: "border-sky-200 bg-sky-50 text-sky-700",
}

export function SportsSettlementReconciliationDemo() {
  const [index, setIndex] = useState(0)
  const scene = scenes[index]
  const Icon = scene.icon

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-line bg-white shadow-sm" aria-labelledby="settlement-demo-title">
      <div className="p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="settlement-demo-title" className="text-xl font-semibold text-ink">结算前，三份记录要怎样核对？</h2>
          <span className="rounded-md bg-paper px-2 py-1 text-xs text-muted">虚构注单 · 对账示意</span>
        </div>
        <p className="mt-3 text-sm leading-7 text-muted">切换场景，看看赛果、注单和钱包流水是否能支持同一个结论。</p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="选择结算场景">
          {scenes.map((item, next) => <button key={item.name} type="button" aria-pressed={index === next} onClick={() => setIndex(next)} className={`rounded-md border px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${index === next ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item.name}</button>)}
        </div>
      </div>

      <div className="grid gap-px border-t border-line bg-line lg:grid-cols-3">
        <RecordCard title="注单记录" icon={FileCheck2} values={scene.ticket} />
        <RecordCard title="赛果依据" icon={Landmark} values={scene.source} />
        <RecordCard title="钱包流水" icon={CreditCard} values={scene.wallet} />
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-[auto_1fr] md:p-8" aria-live="polite" aria-atomic="true">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${toneClasses[scene.tone]}`}><Icon className="h-6 w-6" aria-hidden="true" /></div>
        <div>
          <p className="text-xs font-semibold text-brand-700">对账结论 · {scene.result}</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">{scene.conclusion}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{scene.explanation}</p>
          <p className="mt-5 border-l-2 border-brand-600 pl-4 text-sm leading-7 text-muted">对账不是只看金额是否相等，还要核对注单状态、赛果版本和资金流水是否唯一、可追溯。</p>
        </div>
      </div>
    </section>
  )
}

function RecordCard({ title, icon: Icon, values }: { title: string; icon: typeof FileCheck2; values: { status: string; result: string; amount: string } | { status: string; result: string; version: string } | { status: string; flow: string; amount: string } }) {
  const detail = "flow" in values ? values.flow : values.result
  const footer = "version" in values ? values.version : values.amount
  return (
    <div className="bg-white p-5 md:p-6">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Icon className="h-4 w-4 text-brand-700" aria-hidden="true" />{title}</p>
      <div className="mt-5 space-y-4 text-sm">
        <div><p className="text-xs font-semibold text-muted">当前状态</p><p className="mt-1 font-semibold text-ink">{values.status}</p></div>
        <div><p className="text-xs font-semibold text-muted">核对内容</p><p className="mt-1 leading-6 text-ink">{detail}</p></div>
        <div><p className="text-xs font-semibold text-muted">金额或版本</p><p className="mt-1 leading-6 text-ink">{footer}</p></div>
      </div>
    </div>
  )
}
