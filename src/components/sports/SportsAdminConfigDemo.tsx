"use client"

import { useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, CircleDollarSign, ClipboardList, LockKeyhole, Power, RotateCcw, SlidersHorizontal } from "lucide-react"

const oddsModes = [
  { label: "保持", odds: "2.10", log: "未调整赔率", note: "前台继续展示当前报价。" },
  { label: "上调", odds: "2.20", log: "主胜赔率由 2.10 调整为 2.20", note: "前台显示新报价，投注单需要重新确认。" },
  { label: "下调", odds: "2.00", log: "主胜赔率由 2.10 调整为 2.00", note: "前台显示新报价，历史注单仍保留受理时赔率。" },
]

const limitOptions = [50, 100, 300]

const steps = [
  { title: "赛事开关", icon: Power, focus: "控制整场比赛是否展示和接单。" },
  { title: "玩法开关", icon: LockKeyhole, focus: "控制某个玩法或选项是否可提交。" },
  { title: "限额", icon: CircleDollarSign, focus: "控制单笔或用户维度的提交范围。" },
  { title: "赔率调整", icon: SlidersHorizontal, focus: "调整当前展示报价，并留下操作记录。" },
]

export function SportsAdminConfigDemo() {
  const [step, setStep] = useState(0)
  const [matchOpen, setMatchOpen] = useState(true)
  const [marketOpen, setMarketOpen] = useState(true)
  const [limit, setLimit] = useState(100)
  const [oddsMode, setOddsMode] = useState(0)
  const current = steps[step]
  const Icon = current.icon

  const frontState = useMemo(() => {
    if (!matchOpen) return { label: "赛事隐藏或暂停", detail: "前台不开放这场比赛的新提交入口。", canSubmit: false }
    if (!marketOpen) return { label: "玩法封盘", detail: "比赛仍可查看，但全场独赢主胜不可提交。", canSubmit: false }
    return { label: "可提交", detail: `主胜当前赔率 ${oddsModes[oddsMode].odds}，本例单笔上限 ${limit} 演示单位。`, canSubmit: true }
  }, [limit, matchOpen, marketOpen, oddsMode])

  const logs = [
    matchOpen ? "赛事 MATCH-001：展示并允许进入详情" : "赛事 MATCH-001：关闭新提交入口",
    matchOpen ? marketOpen ? "全场独赢：主胜选项可用" : "全场独赢：主胜选项封盘" : "全场独赢：随赛事关闭停止新提交",
    `单笔限额：${limit} 演示单位`,
    oddsModes[oddsMode].log,
  ]

  function reset() {
    setMatchOpen(true)
    setMarketOpen(true)
    setLimit(100)
    setOddsMode(0)
    setStep(0)
  }

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-line bg-white shadow-sm" aria-labelledby="admin-config-title">
      <div className="p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="admin-config-title" className="text-xl font-semibold text-ink">后台改一个配置，前台会看到什么？</h2>
          <span className="rounded-md bg-paper px-2 py-1 text-xs text-muted">虚构后台 · 操作示意</span>
        </div>
        <p className="mt-3 text-sm leading-7 text-muted">用同一场海港队 vs 山城队，观察赛事开关、玩法封盘、限额和赔率调整如何影响前台、投注单与操作日志。</p>
        <ol aria-label="后台配置项" className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
          {steps.map((item, index) => {
            const StepIcon = item.icon
            return (
              <li key={item.title}>
                <button type="button" onClick={() => setStep(index)} aria-current={step === index ? "step" : undefined} aria-controls="admin-config-panel" className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${step === index ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line bg-white text-muted hover:bg-paper"}`}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${step === index ? "bg-brand-700 text-white" : "bg-paper text-muted"}`}><StepIcon className="h-4 w-4" aria-hidden="true" /></span>
                  <span><span className="block text-sm font-semibold">{item.title}</span><span className="mt-0.5 block text-xs">{item.focus}</span></span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div id="admin-config-panel" className="grid border-t border-line lg:grid-cols-[1fr_1.05fr]">
        <div className="bg-paper p-5 md:p-8">
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Icon className="h-4 w-4 text-brand-700" aria-hidden="true" />{current.title}</span>
              <span className="text-xs text-muted">管理员 admin_demo</span>
            </div>
            <div className="space-y-5 p-4 sm:p-5">
              <ConfigSwitch title="赛事开关" description="关闭后，本例停止这场比赛的新提交入口。" checked={matchOpen} onChange={setMatchOpen} />
              <ConfigSwitch title="全场独赢 · 主胜" description="只控制这个玩法选项，不代表关闭整场比赛。" checked={marketOpen} onChange={setMarketOpen} disabled={!matchOpen} />
              <div>
                <p className="text-sm font-semibold text-ink">单笔限额</p>
                <p className="mt-1 text-xs leading-5 text-muted">本例用于说明限额如何影响提交确认。</p>
                <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="选择单笔限额">
                  {limitOptions.map((value) => <button key={value} type="button" onClick={() => setLimit(value)} aria-pressed={limit === value} className={`rounded-md border px-3 py-2.5 text-sm font-semibold tabular-nums transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${limit === value ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{value}</button>)}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">主胜赔率</p>
                <p className="mt-1 text-xs leading-5 text-muted">调整当前展示报价，已受理注单保留成交快照。</p>
                <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="选择赔率调整">
                  {oddsModes.map((item, index) => <button key={item.label} type="button" onClick={() => setOddsMode(index)} aria-pressed={oddsMode === index} className={`rounded-md border px-3 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${oddsMode === index ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}><span className="block">{item.label}</span><span className="mt-1 block text-xs tabular-nums">{item.odds}</span></button>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 p-5 md:p-8" aria-live="polite" aria-atomic="true">
          <p className="text-xs font-semibold text-brand-700">第 {step + 1} / 4 项 · {current.title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">{frontState.label}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{frontState.detail}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-line p-4">
              <p className="text-xs font-semibold text-muted">前台赛事详情</p>
              <div className="mt-4 rounded-lg bg-paper p-4">
                <p className="text-xs text-muted">示例联赛 · MATCH-001</p>
                <p className="mt-2 text-base font-semibold text-ink">海港队 <span className="px-1 text-xs font-normal text-muted">vs</span> 山城队</p>
                <div className={`mt-4 rounded-md border p-4 ${frontState.canSubmit ? "border-brand-600 bg-white text-brand-700" : "border-line bg-white text-muted"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">主胜</span>
                    <span className="text-xl font-semibold tabular-nums">{frontState.canSubmit ? oddsModes[oddsMode].odds : "暂停"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-line p-4">
              <p className="text-xs font-semibold text-muted">投注单校验</p>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="赛事状态" value={matchOpen ? "允许查看" : "停止新提交"} />
                <Row label="选项状态" value={marketOpen && matchOpen ? "可用" : "不可用"} />
                <Row label="金额 80" value={frontState.canSubmit && limit >= 80 ? "可继续确认" : limit < 80 ? "超过单笔限额" : "等待恢复"} />
              </dl>
              <p className="mt-4 text-xs leading-6 text-muted">{oddsModes[oddsMode].note}</p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-line bg-white p-4">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><ClipboardList className="h-4 w-4 text-brand-700" aria-hidden="true" />操作日志</p>
            <ol className="mt-3 space-y-2">
              {logs.map((log, index) => <li key={log} className="flex gap-3 text-sm leading-6 text-muted"><span className="font-semibold tabular-nums text-brand-700">0{index + 1}</span><span>{log}</span></li>)}
            </ol>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 rounded-md px-3 py-3 text-sm text-muted hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" aria-hidden="true" />上一步</button>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-3 text-sm font-semibold text-muted hover:bg-paper"><RotateCcw className="h-4 w-4" aria-hidden="true" />重置</button>
              <button type="button" onClick={() => setStep((step + 1) % steps.length)} className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600">{step === steps.length - 1 ? "重新看配置" : "下一项"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line p-5 md:p-8">
        <p className="text-sm leading-7 text-muted">后台配置的关键不是“能不能改”，而是每次调整都要说明影响范围、即时前台反馈、注单校验方式和操作留痕。本例只展示常见产品关系，实际权限、限额层级和赔率来源应按具体系统核对。</p>
      </div>
    </section>
  )
}

function ConfigSwitch({ title, description, checked, disabled, onChange }: { title: string; description: string; checked: boolean; disabled?: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className={`flex items-start justify-between gap-4 rounded-lg border border-line p-4 ${disabled ? "cursor-not-allowed bg-paper opacity-70" : "cursor-pointer bg-white"}`}>
      <span>
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted">{description}</span>
      </span>
      <input type="checkbox" checked={checked && !disabled} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-brand-700" />
    </label>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-wrap justify-between gap-x-3 gap-y-1"><dt className="text-muted">{label}</dt><dd className="font-medium text-ink">{value}</dd></div>
}
