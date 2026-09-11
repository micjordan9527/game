"use client"

import { useState } from "react"
import { CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, Wallet } from "lucide-react"

const options = ["主队胜 1.86", "平局 3.40", "客队胜 4.20"]
const presets = [50, 100, 300]
const courseProgressEvent = "wg-course-module-progress"

export function MobileBettingPrototype() {
  const [step, setStep] = useState(0)
  const [selection, setSelection] = useState(options[0])
  const [amount, setAmount] = useState(100)
  const [oddsChanged, setOddsChanged] = useState(false)
  const odds = oddsChanged ? 1.8 : 1.86
  const payout = Math.round(amount * odds)

  function next() {
    setStep((current) => {
      const nextStep = Math.min(current + 1, 3)
      if (nextStep === 3) window.dispatchEvent(new CustomEvent(courseProgressEvent, { detail: { categorySlug: "design", moduleId: "design-module-2", completed: true } }))
      return nextStep
    })
  }
  function previous() { setStep((current) => Math.max(current - 1, 0)) }
  function restart() { setStep(0); setOddsChanged(false); setAmount(100); setSelection(options[0]) }

  return <section className="py-12"><div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8"><p className="text-sm font-semibold text-brand-700">移动端投注原型</p><h2 className="mt-2 text-2xl font-semibold text-ink">用一条完整路径演练关键反馈</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted">这是交互演练：从选择玩法到提交结果，观察每一步应保留哪些判断信息。</p><div className="mt-6 grid gap-6 lg:grid-cols-[310px_1fr] lg:items-center"><div className="mx-auto w-full rounded-[2rem] border-[7px] border-ink bg-paper p-3 shadow-soft"><div className="min-h-[490px] rounded-[1.3rem] bg-white p-4"><div className="flex items-center justify-between text-xs text-muted"><span>9:41</span><span>示例演练</span></div><div className="mt-5"><p className="text-xs text-muted">冠军联赛 · 即将开始</p><p className="mt-1 text-sm font-semibold text-ink">皇家马德里 vs 阿森纳</p></div>{step === 0 ? <div className="mt-6 space-y-2">{options.map((option) => <button key={option} type="button" onClick={() => setSelection(option)} className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-sm font-medium ${selection === option ? "border-brand-600 bg-brand-50 text-brand-800" : "border-line text-ink"}`}><span>{option.split(" ")[0]}</span><span>{option.split(" ")[1]}</span></button>)}</div> : null}{step === 1 ? <div className="mt-6"><div className="rounded-lg bg-paper p-3"><p className="text-xs text-muted">已选玩法</p><p className="mt-1 text-sm font-semibold text-ink">{selection.replace("1.86", String(odds))}</p></div><div className="mt-4 flex items-center justify-between"><span className="text-sm text-muted">投注金额</span><span className="text-lg font-semibold text-ink">¥{amount}</span></div><div className="mt-3 flex gap-2">{presets.map((value) => <button key={value} type="button" onClick={() => setAmount(value)} className={`flex-1 rounded-md border py-2 text-sm ${amount === value ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted"}`}>¥{value}</button>)}</div><p className="mt-4 text-sm text-muted">预计返还 <span className="font-semibold text-ink">¥{payout}</span></p></div> : null}{step === 2 ? <div className="mt-6"><div className="space-y-3 rounded-lg bg-paper p-3 text-sm"><p><span className="text-muted">玩法</span><br /><span className="font-medium text-ink">{selection.replace("1.86", String(odds))}</span></p><p><span className="text-muted">投注金额</span><br /><span className="font-medium text-ink">¥{amount}</span></p><p><span className="text-muted">预计返还</span><br /><span className="font-medium text-ink">¥{payout}</span></p></div>{oddsChanged ? <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><CircleAlert className="mr-1 inline h-3.5 w-3.5" />赔率已从 1.86 变为 1.80，请确认新赔率。</div> : <button type="button" onClick={() => setOddsChanged(true)} className="mt-3 text-xs text-brand-700">模拟赔率变化</button>}</div> : null}{step === 3 ? <div className="mt-12 text-center"><span className="inline-flex rounded-full bg-emerald-50 p-3"><CheckCircle2 className="h-7 w-7 text-emerald-600" /></span><p className="mt-4 text-base font-semibold text-ink">投注已受理</p><p className="mt-2 text-sm leading-6 text-muted">注单 #BT240918 已生成，等待赛事结果。</p><div className="mt-5 rounded-lg bg-paper p-3 text-left text-xs text-muted">投注 ¥{amount} · 赔率 {odds} · 预计返还 ¥{payout}</div></div> : null}<div className="mt-7">{step < 3 ? <button type="button" onClick={next} className="w-full rounded-md bg-ink px-3 py-2.5 text-sm font-semibold text-white">{step === 2 ? (oddsChanged ? "接受新赔率并提交" : "确认投注") : "继续"}</button> : <button type="button" onClick={restart} className="w-full rounded-md bg-ink px-3 py-2.5 text-sm font-semibold text-white">重新演练</button>}</div></div></div><div><p className="text-sm font-semibold text-brand-700">第 {step + 1} 步 / 4 步</p><h3 className="mt-2 text-xl font-semibold text-ink">{["确认玩法含义", "输入金额并预览结果", "确认本次承诺", "确认订单已经受理"][step]}</h3><p className="mt-3 text-sm leading-7 text-muted">{["赛事、开始时间、玩法和赔率需要一起出现，避免用户只看到数字而误点。", "余额、限额和预计返还紧邻输入区域，让用户不用提交后再反复修改。", "提交前集中展示玩法、金额、赔率与返还；赔率变化必须要求再次确认。", "成功反馈应给出注单编号、当前状态和后续查看入口，避免用户不确定是否提交成功。"][step]}</p><div className="mt-5 rounded-lg bg-paper p-4"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Wallet className="h-4 w-4 text-brand-700" />本次演练检查</p><p className="mt-2 text-sm leading-7 text-muted">页面是否让用户在每一步都看见“我正在做什么、会产生什么结果、下一步是什么”？</p></div>{step > 0 && step < 3 ? <button type="button" onClick={previous} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-700"><ChevronLeft className="h-4 w-4" />返回上一步</button> : null}</div></div></div></section>
}
