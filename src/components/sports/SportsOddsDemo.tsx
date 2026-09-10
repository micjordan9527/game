"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, LockKeyhole } from "lucide-react"

const markets = [
  { name: "独赢", direction: "主胜", line: "不设让球", question: "海港队是否获胜？", rule: "只比较双方进球，不给比分加减数字。", odds: "2.10" },
  { name: "亚洲让球", direction: "主队", line: "−1", question: "海港队减去 1 球后，是否仍领先？", rule: "先给主队进球数减 1，再比较双方；相等时退回本金。", odds: "1.90" },
  { name: "大小", direction: "大", line: "2.5", question: "两队总进球是否超过 2.5？", rule: "把双方进球相加，与 2.5 比较，不看哪一队获胜。", odds: "1.90" },
]
const scores = [[2, 0], [2, 1], [1, 1], [0, 1]]
const quoteStates = ["正常", "赔率上升", "赔率下降", "封盘"]
const choiceClass = "rounded-md border px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"

export function SportsOddsDemo() {
  const [marketIndex, setMarketIndex] = useState(0)
  const [scoreIndex, setScoreIndex] = useState(0)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const market = markets[marketIndex]
  const [home, away] = scores[scoreIndex]
  const difference = marketIndex === 2 ? home + away - 2.5 : home - away - (marketIndex === 1 ? 1 : 0)
  const result = difference > 0 ? "选项成立" : difference === 0 && marketIndex === 1 ? "退回本金" : "选项不成立"
  const calculation = marketIndex === 0 ? `${home} ${home > away ? ">" : home === away ? "=" : "<"} ${away}：${home > away ? "主队获胜" : home === away ? "双方打平，主胜不成立" : "客队获胜，主胜不成立"}` : marketIndex === 1 ? `${home} − 1 = ${home - 1}；与客队 ${away} 球比较，${difference > 0 ? "主队仍领先" : difference === 0 ? "调整后相等" : "主队落后"}。` : `${home} + ${away} = ${home + away}；${home + away} ${difference > 0 ? ">" : "<"} 2.5，${difference > 0 ? "大 2.5 成立" : "大 2.5 不成立"}。`

  return (
    <div className="mt-6 space-y-6">
      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm" aria-labelledby="odds-demo-title">
        <div className="p-5 md:p-8">
          <h2 id="odds-demo-title" className="text-xl font-semibold text-ink">同一场比赛，换个玩法会怎样？</h2>
          <p className="mt-3 text-sm leading-7 text-muted">海港队（主）vs 山城队（客） · 虚构示例。以下按常规时间含补时、不含加时和点球大战的比分演示。</p>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="选择演示玩法">
            {markets.map((item, index) => <button key={item.name} type="button" aria-pressed={marketIndex === index} onClick={() => setMarketIndex(index)} className={`${choiceClass} ${marketIndex === index ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item.name}</button>)}
          </div>
        </div>
        <div className="grid border-t border-line lg:grid-cols-2">
          <div className="bg-paper p-5 md:p-8">
            <p className="text-xs font-semibold text-muted">把一个选项拆开看</p>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[["① 玩法", market.name], ["② 方向", market.direction], ["③ 盘口条件", market.line], ["④ 十进制赔率", market.odds]].map(([label, value]) => <div key={label} className="rounded-lg border border-line bg-white p-4"><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 text-xl font-semibold tabular-nums text-ink">{value}</dd></div>)}
            </dl>
            <p className="mt-5 border-l-2 border-brand-600 pl-4 text-sm leading-7 text-ink">{market.question}</p>
            <p className="mt-3 text-sm leading-7 text-muted">{market.rule}</p>
          </div>
          <div className="p-5 md:p-8">
            <p className="text-sm font-semibold text-ink">换一个赛果试试</p>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="选择示例比分">
              {scores.map(([h, a], index) => <button key={index} type="button" aria-label={`比分 ${h} 比 ${a}`} aria-pressed={scoreIndex === index} onClick={() => setScoreIndex(index)} className={`${choiceClass} tabular-nums ${scoreIndex === index ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{h} : {a}</button>)}
            </div>
            <div className="mt-6" aria-live="polite" aria-atomic="true">
              <div className="flex items-center justify-between gap-2 text-sm text-muted"><span>海港队（主）</span><span>山城队（客）</span></div>
              <p className="mt-2 text-center text-4xl font-semibold tabular-nums text-ink">{home} : {away}</p>
              <div className="mt-5 rounded-lg bg-brand-50 p-4"><p className="text-lg font-semibold text-brand-700">{result}</p><p className="mt-2 text-sm leading-7 text-ink">{calculation}</p></div>
            </div>
          </div>
        </div>
        <div className="border-t border-line p-5 md:p-8">
          <h3 className="text-base font-semibold text-ink">盘口决定怎么判，赔率决定成立时怎么计算返还</h3>
          <p className="mt-3 text-sm leading-7 text-muted">以单注 100 演示单位、十进制赔率 2.10 为例：全赢时总返还 100 × 2.10 = 210，其中包含本金 100；净收益为 110。全输时返还 0，退回本金时返还 100。本例不涉及手续费、半赢半输或串关。</p>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5 shadow-sm md:p-8" aria-labelledby="quote-state-title">
        <h2 id="quote-state-title" className="text-xl font-semibold text-ink">赔率变了、封盘了，按钮有什么不同？</h2>
        <p className="mt-3 text-sm leading-7 text-muted">独立展示“主胜”按钮的四种状态。上面的赛果判定不随这里的报价变化。</p>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="选择报价状态">
          {quoteStates.map((state, index) => <button key={state} type="button" aria-pressed={quoteIndex === index} onClick={() => setQuoteIndex(index)} className={`${choiceClass} ${quoteIndex === index ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{state}</button>)}
        </div>
        <div className="mt-5 flex flex-col gap-5 rounded-lg bg-paper p-5 sm:flex-row sm:items-center" aria-live="polite">
          <div className={`w-full shrink-0 rounded-md border p-4 text-center sm:w-36 ${quoteIndex === 3 ? "border-line bg-paper text-muted" : "border-brand-600 bg-white text-brand-700"}`}>
            <p className="text-xs">主胜 · {quoteStates[quoteIndex]}</p>
            <p className="mt-2 flex items-center justify-center gap-2 text-xl font-semibold tabular-nums">{quoteIndex === 3 ? <><LockKeyhole className="h-5 w-5" aria-hidden="true" />暂停</> : <>{quoteIndex === 1 ? <ArrowUp className="h-4 w-4" aria-hidden="true" /> : quoteIndex === 2 ? <ArrowDown className="h-4 w-4" aria-hidden="true" /> : null}{["2.10", "2.20", "2.00"][quoteIndex]}</>}</p>
          </div>
          <p className="text-sm leading-7 text-muted">{["当前显示 2.10。正式提交时仍需核对可用性和报价。", "从 2.10 升到 2.20。用向上箭头和数字一起表达变化；待确认信息应同步更新。", "从 2.10 降到 2.00。用向下箭头表达变化；需要按用户的确认设置处理新报价。", "选项暂不可用。保留选项名称并显示暂停；恢复后重新核对盘口与赔率。"][quoteIndex]} 已受理注单保留确认时的赔率。</p>
        </div>
        <p className="mt-5 text-xs leading-6 text-muted">规则参考：<a className="text-brand-700 underline" href="https://support.betfair.com/app/answers/detail/6418-exchange-what-is-asian-handicap-betting/">亚洲让球说明</a> · <a className="text-brand-700 underline" href="https://support.betfair.com/app/answers/detail/6482-sportsbook-how-do-odds-work/">赔率格式说明</a>。实际玩法以对应时段和赛事规则为准。</p>
      </section>
    </div>
  )
}
