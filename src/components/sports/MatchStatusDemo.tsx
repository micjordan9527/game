"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ArrowRight, LockKeyhole, Radio, ShieldCheck } from "lucide-react"

const moments = [
  { name: "赛前", time: "19:30 · 20:00 开赛", score: "VS", available: true, market: "赛前选项开放", ticket: "可以提交，等待受理确认", settlement: "等待比赛结果", explanation: "比赛尚未开始。本例的赛前选项可用，但提交后仍需等待服务端确认。", event: "收到赛程和赛前状态" },
  { name: "进行中", time: "上半场 23′", score: "1 : 0", available: true, market: "滚球选项开放", ticket: "按当前报价确认提交", settlement: "全场玩法继续等待", explanation: "比分变为 1:0。本例仍开放滚球选项；当前比分不代表全场玩法已经产生结算结果。", event: "收到比分 1:0 和比赛进度" },
  { name: "中断", time: "上半场 24′ · 暂停", score: "1 : 0", available: false, market: "本例暂停相关选项", ticket: "停止新提交，保留原注单", settlement: "等待恢复或规则处理", explanation: "本例比赛临时中断并暂停相关选项。已有注单不会只因为这个状态就自动退款，需要继续核对赛况与适用规则。", event: "收到比赛中断事件" },
  { name: "恢复", time: "上半场 25′ · 已恢复", score: "1 : 0", available: true, market: "核对后恢复选项", ticket: "使用重新确认的报价", settlement: "全场玩法继续等待", explanation: "本例确认比赛恢复，并核对了新的选项状态和报价，才恢复提交入口。不能只把暂停按钮直接解锁。", event: "收到恢复事件与更新报价" },
  { name: "完场", time: "常规时间结束", score: "2 : 1", available: false, market: "本例全场选项关闭", ticket: "查询已受理记录", settlement: "等待结算依据确认", explanation: "页面已显示完场 2:1，但本例结算侧还在确认结果。此时不能把“比赛结束”直接显示成“返还已到账”。", event: "收到完场状态和比分 2:1" },
  { name: "赛果确认", time: "结算依据已确认", score: "2 : 1", available: false, market: "全场选项保持关闭", ticket: "注单进入结算处理", settlement: "按玩法规则处理，再核对入账", explanation: "本例已拿到结算所需依据，可以按对应玩法处理注单。完成业务结算后，还需要分别核对资金流水。", event: "结算侧确认结果版本" },
]

export function MatchStatusDemo() {
  const [index, setIndex] = useState(0)
  const [stale, setStale] = useState(false)
  const moment = moments[index]
  const available = moment.available && !stale
  function selectMoment(next: number) {
    setIndex(next)
    setStale(false)
  }

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-line bg-white shadow-sm" aria-labelledby="match-demo-title">
      <div className="p-5 md:p-8">
        <h2 id="match-demo-title" className="text-xl font-semibold text-ink">比赛往前走，三个地方跟着变</h2>
        <p className="mt-3 text-sm leading-7 text-muted">海港队 vs 山城队 · 虚构流程。观察赛事画面、选项可用性和注单处理如何分别变化。</p>
        <ol aria-label="赛事过程" className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {moments.map((item, step) => <li key={item.name}><button type="button" onClick={() => selectMoment(step)} aria-current={index === step ? "step" : undefined} aria-controls="match-status-panel" className={`w-full rounded-md border px-3 py-3 text-left text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${index === step ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}><span className="mr-2 text-xs">{step + 1}</span>{item.name}</button></li>)}
        </ol>
      </div>
      <div id="match-status-panel" className="grid border-t border-line lg:grid-cols-2">
        <div className="bg-paper p-5 md:p-8">
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3"><span className="text-xs text-muted">示例联赛 · MATCH-001</span><span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">{moment.name}</span></div>
            <div className="p-5 text-center" aria-live="polite" aria-atomic="true">
              <p className="text-xs text-muted">{moment.time}</p>
              <div className="mt-5 flex items-center justify-between gap-2 text-sm font-semibold text-ink"><span>海港队</span><span className="text-3xl tabular-nums">{moment.score}</span><span>山城队</span></div>
              <p className="mt-4 text-xs leading-6 text-muted">{stale ? "数据待更新：这是最近一次收到的画面" : moment.event}</p>
            </div>
            <div className="border-t border-line p-4">
              <p className="text-xs font-semibold text-muted">本例全场独赢选项 · 状态示意</p>
              <div className={`mt-3 flex items-center justify-between gap-3 rounded-md border p-4 ${available ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line bg-paper text-muted"}`}><span className="text-sm font-semibold">主胜</span><span className="inline-flex items-center gap-2 text-sm">{available ? <><Radio className="h-4 w-4" aria-hidden="true" />可用</> : <><LockKeyhole className="h-4 w-4" aria-hidden="true" />{stale ? "等待核对" : "不可用"}</>}</span></div>
            </div>
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white p-4"><input type="checkbox" checked={stale} onChange={(event) => setStale(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-brand-700" /><span><span className="block text-sm font-semibold text-ink">模拟数据延迟</span><span className="mt-1 block text-xs leading-6 text-muted">保留最近画面，本例暂停新提交与自动推进，等待重新核对数据。切换赛事步骤会重置此模拟。</span></span></label>
        </div>
        <div className="p-5 md:p-8" aria-live="polite" aria-atomic="true">
          <p className="text-xs font-semibold text-brand-700">第 {index + 1} / 6 步 · {stale ? "数据待核对" : moment.name}</p>
          <h3 className="mt-2 text-xl font-semibold text-ink">{stale ? "看到旧比分，不代表数据仍然实时" : "当前会影响什么？"}</h3>
          <dl className="mt-5 space-y-5">
            {[["盘口展示", stale ? "保留最近信息，标记待更新" : moment.market], ["投注入口", stale ? "本例暂停新提交" : moment.ticket], ["结算处理", stale ? "本例等待数据核对，不重复处理旧结果" : moment.settlement]].map(([label, value], step) => <div key={label} className="border-l-2 border-brand-100 pl-4"><dt className="text-xs font-semibold text-brand-700">0{step + 1} · {label}</dt><dd className="mt-2 text-sm leading-7 text-ink">{value}</dd></div>)}
          </dl>
          <p className="mt-6 text-sm leading-7 text-muted">{stale ? "这里模拟一种暂停处理的产品策略。不要把数据延迟改写成比赛中断，也不要把旧比分当作新赛果。恢复连接后，应核对数据时间、版本和业务状态。" : moment.explanation}</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-t border-line p-5 md:px-8"><button type="button" disabled={index === 0} onClick={() => selectMoment(index - 1)} className="inline-flex items-center gap-2 rounded-md px-3 py-3 text-sm text-muted hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" aria-hidden="true" />上一步</button><button type="button" onClick={() => selectMoment((index + 1) % moments.length)} className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600">{index === moments.length - 1 ? "重新演示" : "下一步"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button></div>
      <div className="border-t border-line p-5 md:p-8"><div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" /><p className="text-sm leading-7 text-muted">这是全场玩法的一条示例流程。赛事状态、选项状态与结算依据需要分别核对，不能用单一状态推断所有玩法的处理结果。</p></div><div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-brand-700"><Link className="hover:underline" href="/sports/sports-odds-basics">看盘口怎样判定 →</Link><Link className="hover:underline" href="/sports/bet-ticket-lifecycle">继续看注单如何结算 →</Link></div></div>
    </section>
  )
}
