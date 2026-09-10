"use client"

import { useState } from "react"
import { Activity, AlertTriangle, ArrowLeft, ArrowRight, PauseCircle, TrendingDown, TrendingUp } from "lucide-react"

type TradingScene = {
  name: string
  icon: typeof Activity
  clock: string
  score: string
  state: string
  action: string
  tone: "normal" | "move" | "pause"
  summary: string
  odds: { label: string; value: string; direction?: "up" | "down" }[]
  frontend: string
  ticket: string
  note: string
}

const scenes: TradingScene[] = [
  {
    name: "赛前稳定",
    icon: Activity,
    clock: "赛前 15 分钟",
    score: "-",
    state: "可投注",
    action: "观察报价",
    tone: "normal",
    summary: "赛事和数据源稳定，当前赔率可以正常展示并接受新的提交。",
    odds: [{ label: "主胜", value: "2.10" }, { label: "平局", value: "3.20" }, { label: "客胜", value: "3.50" }],
    frontend: "前台正常显示三个选项，用户选择后进入投注单确认。",
    ticket: "新提交按当前报价校验；已经受理的注单保留自己的成交快照。",
    note: "操盘首先要确认赛事状态、数据时效和当前市场是否适合继续开放。",
  },
  {
    name: "主队进球",
    icon: TrendingDown,
    clock: "下半场 62′",
    score: "1 : 0",
    state: "可投注",
    action: "更新赔率",
    tone: "move",
    summary: "比分变化后，主胜机会增大；本例把主胜赔率调低，同时上调平局和客胜。",
    odds: [{ label: "主胜", value: "1.45", direction: "down" }, { label: "平局", value: "4.20", direction: "up" }, { label: "客胜", value: "6.50", direction: "up" }],
    frontend: "前台刷新为新报价；正在填写的投注单需要提醒用户重新确认。",
    ticket: "新的受理请求使用新版本报价，先前已受理的注单不被这次调整覆盖。",
    note: "赔率变化是当前行情的更新，不是改写历史成交信息。",
  },
  {
    name: "主队红牌",
    icon: TrendingUp,
    clock: "下半场 70′",
    score: "1 : 0",
    state: "短暂调整后开放",
    action: "重新评估",
    tone: "move",
    summary: "关键事件会改变比赛预期。本例先短暂核对信息，再给出新的可接受报价。",
    odds: [{ label: "主胜", value: "1.85", direction: "up" }, { label: "平局", value: "3.40", direction: "up" }, { label: "客胜", value: "4.20", direction: "down" }],
    frontend: "调整期间选项暂不可点；恢复后展示已更新的赔率与状态。",
    ticket: "调整窗口内的新提交不受理，恢复后再以新的报价进行校验。",
    note: "先确保事件准确，再恢复市场，能减少错误报价被提交的机会。",
  },
  {
    name: "集中下注",
    icon: AlertTriangle,
    clock: "下半场 71′",
    score: "1 : 0",
    state: "主胜暂不可用",
    action: "限制与复核",
    tone: "move",
    summary: "同一方向在短时间内出现集中提交时，本例只限制受影响选项，并交给风控核对。",
    odds: [{ label: "主胜", value: "暂不可用" }, { label: "平局", value: "3.40" }, { label: "客胜", value: "4.20" }],
    frontend: "主胜按钮显示暂不可用；其他选项按各自状态继续展示。",
    ticket: "未受理的主胜请求不继续成交；已受理注单仍按确认时记录处理。",
    note: "操盘动作和风控判断需要关联，但不应把所有选项一并关闭。",
  },
  {
    name: "数据暂停",
    icon: PauseCircle,
    clock: "下半场 74′",
    score: "1 : 0",
    state: "全场封盘",
    action: "暂停等待数据",
    tone: "pause",
    summary: "数据源在关键时点没有继续确认事件，本例暂停当前市场，等待可靠信息后再决定报价。",
    odds: [{ label: "主胜", value: "封盘" }, { label: "平局", value: "封盘" }, { label: "客胜", value: "封盘" }],
    frontend: "前台说明当前市场暂不可投注，避免用户把最后一次报价误认为仍然有效。",
    ticket: "不再接受新的提交；已受理注单的结算依据保持独立，等待赛果确认。",
    note: "封盘是控制新风险，不等同于取消或改变已经受理的注单。",
  },
]

const toneClasses = {
  normal: "border-emerald-200 bg-emerald-50 text-emerald-700",
  move: "border-amber-200 bg-amber-50 text-amber-700",
  pause: "border-rose-200 bg-rose-50 text-rose-700",
}

export function SportsTradingDemo() {
  const [index, setIndex] = useState(0)
  const scene = scenes[index]
  const Icon = scene.icon

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-line bg-white shadow-sm" aria-labelledby="trading-demo-title">
      <div className="p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="trading-demo-title" className="text-xl font-semibold text-ink">一场比赛发生变化，操盘台如何响应？</h2>
          <span className="rounded-md bg-paper px-2 py-1 text-xs text-muted">虚构赛事 · 操盘示意</span>
        </div>
        <p className="mt-3 text-sm leading-7 text-muted">按时间选择事件，观察操盘动作如何改变当前报价、前台状态与新提交的处理方式。</p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="选择赛事事件">
          {scenes.map((item, next) => <button key={item.name} type="button" aria-pressed={index === next} onClick={() => setIndex(next)} className={`rounded-md border px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${index === next ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item.name}</button>)}
        </div>
      </div>

      <div className="grid border-t border-line lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-paper p-5 md:p-8">
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Icon className="h-4 w-4 text-brand-700" aria-hidden="true" />海港队 vs 山城队</span>
              <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${toneClasses[scene.tone]}`}>{scene.state}</span>
            </div>
            <div className="grid grid-cols-2 border-b border-line px-4 py-4 text-sm">
              <div><p className="text-xs font-semibold text-muted">比赛时间</p><p className="mt-1 font-semibold text-ink">{scene.clock}</p></div>
              <div><p className="text-xs font-semibold text-muted">当前比分</p><p className="mt-1 font-semibold text-ink">{scene.score}</p></div>
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-ink">全场独赢 · 当前报价</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {scene.odds.map((odd) => <div key={odd.label} className="rounded-lg border border-line p-3 text-center">
                  <p className="text-xs text-muted">{odd.label}</p>
                  <p className={`mt-1 text-lg font-semibold ${odd.value === "封盘" || odd.value === "暂不可用" ? "text-muted" : "text-ink"}`}>{odd.value}</p>
                  {odd.direction && <p className={`mt-1 inline-flex items-center text-xs ${odd.direction === "up" ? "text-rose-600" : "text-emerald-700"}`}>{odd.direction === "up" ? <TrendingUp className="mr-1 h-3 w-3" aria-hidden="true" /> : <TrendingDown className="mr-1 h-3 w-3" aria-hidden="true" />}{odd.direction === "up" ? "上调" : "下调"}</p>}
                </div>)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8" aria-live="polite" aria-atomic="true">
          <p className="text-xs font-semibold text-brand-700">第 {index + 1} / {scenes.length} 个事件 · {scene.action}</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">操盘动作：{scene.action}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{scene.summary}</p>
          <div className="mt-5 grid gap-4">
            <ImpactBlock title="前台变化" body={scene.frontend} />
            <ImpactBlock title="注单影响" body={scene.ticket} />
          </div>
          <p className="mt-5 border-l-2 border-brand-600 pl-4 text-sm leading-7 text-muted">{scene.note}</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)} className="inline-flex items-center gap-2 rounded-md px-3 py-3 text-sm text-muted hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" aria-hidden="true" />上一个</button>
            <button type="button" onClick={() => setIndex((index + 1) % scenes.length)} className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600">{index === scenes.length - 1 ? "重新看事件" : "下一个事件"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
      <p className="border-t border-line p-5 text-sm leading-7 text-muted md:px-8">本页用于理解操盘产品逻辑。不同赛事、玩法、供应商与业务规则的具体报价和封盘策略会有所不同。</p>
    </section>
  )
}

function ImpactBlock({ title, body }: { title: string; body: string }) {
  return <div className="rounded-lg border border-line p-4"><h4 className="text-sm font-semibold text-ink">{title}</h4><p className="mt-2 text-sm leading-7 text-muted">{body}</p></div>
}
