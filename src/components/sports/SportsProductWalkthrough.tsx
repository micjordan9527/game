"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, ClipboardList, List, Search, Wallet } from "lucide-react"

const steps = [
  { title: "找比赛", page: "赛事列表", icon: Search, action: "打开比赛详情", explanation: "先找到你要看的比赛。列表告诉你谁和谁比、什么时候开始。", carried: "带到下一页：海港队 vs 山城队", system: "赛事数据提供对阵、时间和状态，列表把它们整理出来。" },
  { title: "看选项", page: "赛事详情", icon: List, action: "把主胜加入示例投注单", explanation: "进入同一场比赛后，查看玩法和可选结果。这里用“全场独赢”演示：主胜、平局、客胜。", carried: "再带上：全场独赢 · 主胜 · 赔率 2.10", system: "页面将每个选项与对应的玩法、时段和赔率放在一起。" },
  { title: "确认信息", page: "投注单", icon: ClipboardList, action: "演示受理成功", explanation: "投注单像一张确认草稿：把刚选的比赛、选项与金额放在一起。此时还没有受理成功。", carried: "确认后保存：比赛 + 选项 + 赔率 + 金额", system: "提交时需要核对选项、报价及可用余额；本例展示受理成功这一条路径。" },
  { title: "查记录", page: "注单记录", icon: Check, action: "重新看一遍", explanation: "受理成功后，才有可查询的正式记录。当前是等待结果，还没有结算。", carried: "保存的记录不会随详情页上的实时赔率一起变化。", system: "后台可通过注单号关联受理记录和资金流水，帮助客服查询。" },
]

const buttonClass = "inline-flex items-center justify-center gap-2 rounded-md bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"

export function SportsProductWalkthrough() {
  const [step, setStep] = useState(0)
  const current = steps[step]

  return (
    <section aria-labelledby="product-walkthrough-title" className="mt-6 overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <div className="p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="product-walkthrough-title" className="text-xl font-semibold text-ink">跟着一场比赛，走过四个页面</h2>
          <span className="rounded-md bg-paper px-2 py-1 text-xs text-muted">虚构比赛 · 交互示意</span>
        </div>
        <p className="mt-3 text-sm leading-7 text-muted">海港队 vs 山城队。先找比赛，再选结果、确认信息，最后查记录。</p>
        <ol aria-label="四步阅读路径" className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-4">
          {steps.map((item, index) => (
            <li key={item.page}>
              <button type="button" onClick={() => setStep(index)} aria-current={step === index ? "step" : undefined} aria-controls="product-example" className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${step === index ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line bg-white text-muted hover:bg-paper"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${step === index ? "bg-brand-700 text-white" : "bg-paper text-muted"}`}>{index + 1}</span>
                <span><span className="block text-sm font-semibold">{item.title}</span><span className="mt-0.5 block text-xs">{item.page}</span></span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div id="product-example" className="grid border-t border-line lg:grid-cols-[1.15fr_1fr]">
        <div className="min-w-0 bg-paper p-5 md:p-8">
          <div className="mx-auto max-w-md overflow-hidden rounded-lg border border-line bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><current.icon className="h-4 w-4 text-brand-700" aria-hidden="true" />{current.page}</span>
              <span className="text-xs text-muted">界面示意</span>
            </div>
            <div className="min-h-[320px] p-4 sm:p-5">
              {step === 0 && <>
                <div className="flex gap-2 text-xs"><span className="rounded-md bg-brand-50 px-3 py-1.5 text-brand-700">足球</span><span className="rounded-md bg-paper px-3 py-1.5 text-muted">赛前</span></div>
                <p className="mt-5 text-xs text-muted">示例联赛 · 今日 20:00</p>
                <div className="mt-3 rounded-lg border border-brand-100 bg-brand-50 p-4">
                  <div className="flex items-center justify-between gap-2 text-sm font-semibold text-ink"><span>海港队</span><span className="text-xs font-normal text-muted">VS</span><span>山城队</span></div>
                  <div className="mt-4 flex justify-between text-xs text-muted"><span>未开始</span><span>查看玩法 →</span></div>
                </div>
                <p className="mt-5 text-xs leading-6 text-muted">这里回答：是哪场比赛？什么时候开始？</p>
              </>}
              {step === 1 && <>
                <MatchHeading />
                <p className="mt-5 text-sm font-semibold text-ink">全场独赢 <span className="ml-1 text-xs font-normal text-muted">选择比赛结果</span></p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[{ label: "主胜", odds: "2.10" }, { label: "平局", odds: "3.20" }, { label: "客胜", odds: "3.50" }].map((option, index) => (
                    <div key={option.label} className={`rounded-md border px-2 py-3 text-center ${index === 0 ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted"}`}>
                      <span className="block text-xs">{option.label}</span><span className="mt-1 block text-lg font-semibold tabular-nums">{option.odds}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-6 text-muted">本例选择主胜，也就是海港队获胜。下方数字为示例十进制赔率。</p>
              </>}
              {step === 2 && <>
                <MatchHeading />
                <dl className="mt-5 space-y-3 text-sm"><Row label="选项" value="全场独赢 · 主胜" /><Row label="确认赔率" value="2.10" /><Row label="示例金额" value="100 演示单位" /></dl>
                <div className="mt-5 rounded-md bg-signal-50 p-3 text-xs leading-6 text-signal-600">待确认：信息已选好，尚未生成已受理注单。</div>
              </>}
              {step === 3 && <>
                <div className="mb-4 flex items-center justify-between gap-2"><span className="text-xs text-muted">示例单号 DEMO-001</span><span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">已受理 · 待结算</span></div>
                <MatchHeading />
                <dl className="mt-5 space-y-3 text-sm"><Row label="已确认选项" value="全场独赢 · 主胜" /><Row label="受理时赔率" value="2.10" /><Row label="记录金额" value="100 演示单位" /></dl>
                <p className="mt-4 text-xs leading-6 text-muted">此处显示已保存的信息，结算结果仍需等待。</p>
              </>}
            </div>
            <div className="border-t border-line p-4"><button type="button" onClick={() => setStep((step + 1) % steps.length)} className={`${buttonClass} w-full`}>{current.action}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button></div>
          </div>
          <p className="mt-3 text-center text-xs leading-5 text-muted">仅切换示例画面，不创建真实注单或发生资金交易。</p>
        </div>

        <div className="p-5 md:p-8" aria-live="polite" aria-atomic="true">
          <p className="text-sm font-semibold text-brand-700">第 {step + 1} 步 / 共 4 步</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">{current.title}</h3>
          <p className="mt-4 text-base leading-8 text-muted">{current.explanation}</p>
          <div className="mt-6 border-l-2 border-brand-600 pl-4"><p className="text-xs font-semibold text-brand-700">记住这一点</p><p className="mt-2 text-sm leading-7 text-ink">{current.carried}</p></div>
          <div className="mt-6 border-t border-line pt-5"><p className="text-sm font-semibold text-ink">页面背后发生什么？</p><p className="mt-2 text-sm leading-7 text-muted">{current.system}</p></div>
          <button type="button" onClick={() => setStep(step - 1)} disabled={step === 0} className="mt-6 inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" aria-hidden="true" />上一步</button>
        </div>
      </div>

      <div className="border-t border-line p-5 md:p-8">
        <h3 className="text-base font-semibold text-ink">钱包和后台在哪里？</h3>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="flex gap-3"><Wallet className="mt-1 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" /><div><h4 className="text-sm font-semibold text-ink">钱包：管钱</h4><p className="mt-2 text-sm leading-7 text-muted">确认时核对可用余额；受理和结算涉及的资金变化，记录在钱包流水里。</p></div></div>
          <div className="flex gap-3"><ClipboardList className="mt-1 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" /><div><h4 className="text-sm font-semibold text-ink">后台：查原因、处理问题</h4><p className="mt-2 text-sm leading-7 text-muted">客服用 DEMO-001 这样的注单号查记录，再核对资金流水和操作日志。</p></div></div>
        </div>
      </div>
    </section>
  )
}

function MatchHeading() {
  return <div><p className="text-xs text-muted">示例联赛 · 今日 20:00</p><p className="mt-2 text-base font-semibold text-ink">海港队 <span className="px-1 text-xs font-normal text-muted">vs</span> 山城队</p></div>
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><dt className="text-muted">{label}</dt><dd className="font-medium text-ink">{value}</dd></div>
}
