"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, Clock3 } from "lucide-react"

type Stage = { title: string; status: string; money: string; result: string; user: string; system: string; takeaway: string }
const submitted: Stage = { title: "提交", status: "处理中", money: "等待核对", result: "未产生结果", user: "页面正在确认，请稍候。", system: "服务端核对选项、赔率和可用余额，并记录本次请求标识。", takeaway: "点了提交，不代表已经受理成功。" }
const accepted: Stage = { title: "受理", status: "已受理", money: "本金处理已记录", result: "未结算", user: "注单 DEMO-001 已受理，可以查询。", system: "保存主胜、赔率 2.10 和金额 100 的确认记录，并关联资金流水。", takeaway: "正式记录已经生成，后续报价变化不会覆盖它。" }
const waiting: Stage = { title: "等待结果", status: "待结算", money: "暂无结算入账", result: "等待有效赛果", user: "比赛进行中，结果尚未确认。", system: "等待符合该玩法规则的赛果，再进行结算处理。", takeaway: "比分更新和结算确认是两件事。" }
const settled: Stage = { title: "结算", status: "已结算", money: "返还待入账", result: "主胜成立 · 返还 210", user: "主胜选项成立，总返还为 210 演示单位。", system: "本例赛果 2:1，按 100 × 2.10 计算返还，并生成资金处理记录。", takeaway: "算出返还金额，还需要核对钱包是否入账。" }
const credited: Stage = { title: "资金到账", status: "已结算", money: "210 已入账", result: "主胜成立 · 返还 210", user: "在钱包流水中可查到本次返还。", system: "核对注单与入账流水的关联；同一笔资金处理不能重复入账。", takeaway: "到账要看资金流水，不能只看注单的输赢状态。" }

const scenarios: { name: string; intro: string; stages: Stage[] }[] = [
  { name: "正常流程", intro: "主胜，示例赔率 2.10，金额 100；比赛最终为 2:1。沿着同一张注单看五步。", stages: [submitted, accepted, waiting, settled, credited] },
  { name: "提交超时", intro: "本例服务端已受理，但响应未及时到达。超时后先查询，再恢复到已受理状态。", stages: [submitted,
    { title: "响应超时", status: "结果待确认", money: "资金状态待核对", result: "未知", user: "暂未收到确认，请查询本次提交结果。", system: "响应超时无法证明请求失败；保留原请求标识。", takeaway: "此时不能直接显示“投注失败”，也不能盲目重复提交。" },
    { title: "查询原请求", status: "确认中", money: "核对原流水", result: "查询受理结果", user: "正在查询，请勿重复提交。", system: "使用原请求标识查找是否已生成注单，同时核对资金记录。", takeaway: "查询的是同一次请求，不是创建第二张注单。" },
    { ...accepted, title: "找回记录", user: "已找到注单 DEMO-001，受理成功。", takeaway: "本例查到已受理；查到明确拒绝时则展示拒绝原因，未知时继续核对。" }, waiting] },
  { name: "取消退款", intro: "本例已受理后，收到规则允许的作废结果。取消与退款分别记录，并非用户随时可以撤回。", stages: [accepted,
    { title: "确认作废", status: "已作废", money: "退款待处理", result: "本金应退 100", user: "注单已作废，退款处理中。", system: "核对作废依据，保存原因并创建关联退款记录。", takeaway: "注单已作废，并不等于退款已经到账。" },
    { title: "处理退款", status: "已作废", money: "退款处理中", result: "本金应退 100", user: "可查看退款处理进度。", system: "以同一退款记录处理重试，并避免重复返还本金。", takeaway: "异常重试应继续原退款，而非再新建一笔。" },
    { title: "退款到账", status: "已作废", money: "100 已退回", result: "作废处理完成", user: "本金 100 已退回，可查看流水。", system: "退款记录与注单号、作废原因相互关联。", takeaway: "用退款流水确认到账，用注单记录解释为什么退款。" }] },
  { name: "结果更正", intro: "本例结算后收到相互冲突的结果。展示复核与调整过程，不把新结果直接覆盖到旧记录上。", stages: [credited,
    { title: "收到更正", status: "待复核", money: "原入账记录保留", result: "新旧结果待核对", user: "结果正在复核，原结算记录仍可查询。", system: "保存新结果的来源和版本，与原始结果对照。", takeaway: "有新的结果，不代表可以马上覆盖原结果。" },
    { title: "核对依据", status: "复核中", money: "待确认调整", result: "等待复核结论", user: "等待复核结论和处理说明。", system: "根据适用规则核对更正依据，记录处理人、时间和结论。", takeaway: "确认是否需要调整，以及调整哪一笔记录。" },
    { title: "完成调整", status: "更正完成", money: "调整流水已记录", result: "新旧版本均保留", user: "可查询更正原因、最终结果和资金调整。", system: "按确认后的差额完成关联调整，并核对资金处理结果。", takeaway: "更正应留下完整历史，避免重放原结算造成重复入账。" }] },
]

export function BetTicketTimeline() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [stageIndex, setStageIndex] = useState(0)
  const scenario = scenarios[scenarioIndex]
  const stage = scenario.stages[stageIndex]
  const last = stageIndex === scenario.stages.length - 1

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-line bg-white shadow-sm" aria-labelledby="ticket-timeline-title">
      <div className="p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-3"><h2 id="ticket-timeline-title" className="text-xl font-semibold text-ink">一张注单，从提交到资金到账</h2><span className="rounded-md bg-paper px-2 py-1 text-xs text-muted">虚构示例 · 无真实交易</span></div>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="选择注单场景">
          {scenarios.map((item, index) => <button key={item.name} type="button" aria-pressed={scenarioIndex === index} onClick={() => { setScenarioIndex(index); setStageIndex(0) }} className={`rounded-md border px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${scenarioIndex === index ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item.name}</button>)}
        </div>
        <p className="mt-4 text-sm leading-7 text-muted">{scenario.intro}</p>
      </div>
      <div className="grid border-t border-line lg:grid-cols-[0.8fr_1.2fr]">
        <div className="bg-paper p-5 md:p-8">
          <ol aria-label={`${scenario.name}时间线`} className="space-y-0">
            {scenario.stages.map((item, index) => <li key={index} className="relative pb-5 last:pb-0">
              {index < scenario.stages.length - 1 && <span aria-hidden="true" className={`absolute bottom-0 left-4 top-8 w-px ${index < stageIndex ? "bg-brand-600" : "bg-line"}`} />}
              <button type="button" onClick={() => setStageIndex(index)} aria-current={stageIndex === index ? "step" : undefined} aria-controls="ticket-stage" className={`relative flex w-full items-center gap-3 rounded-lg p-1 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${stageIndex === index ? "text-brand-700" : "text-muted hover:text-ink"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${index <= stageIndex ? "bg-brand-700 text-white" : "border border-line bg-white"}`}>{index < stageIndex ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}</span>
                <span className="text-sm font-semibold">{item.title}</span>{stageIndex === index && <span className="ml-auto rounded-md bg-brand-50 px-2 py-1 text-xs">当前步骤</span>}
              </button>
            </li>)}
          </ol>
        </div>
        <div id="ticket-stage" className="min-w-0 p-5 md:p-8">
          <div aria-live="polite" aria-atomic="true">
            <p className="text-xs font-semibold text-brand-700">{scenario.name} · 第 {stageIndex + 1} / {scenario.stages.length} 步</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">{stage.title}</h3>
            <div className="mt-5 overflow-hidden rounded-lg border border-line">
              <div className="border-b border-line bg-paper p-4"><p className="text-xs text-muted">{stage === submitted || stage.status === "结果待确认" || stage.status === "确认中" ? "请求标识 REQ-001" : "注单号 DEMO-001"}</p><p className="mt-2 text-sm font-semibold text-ink">海港队 vs 山城队 · 全场独赢 · 主胜</p><p className="mt-1 text-xs text-muted">示例赔率 2.10 · 100 演示单位</p></div>
              <dl className="space-y-3 p-4 text-sm">{[["注单状态", stage.status], ["结算结果", stage.result], ["资金状态", stage.money]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-x-3 gap-y-1"><dt className="text-muted">{label}</dt><dd className="font-medium text-ink">{value}</dd></div>)}</dl>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><h4 className="text-sm font-semibold text-ink">用户看到</h4><p className="mt-2 text-sm leading-7 text-muted">{stage.user}</p></div><div><h4 className="text-sm font-semibold text-ink">系统在做</h4><p className="mt-2 text-sm leading-7 text-muted">{stage.system}</p></div></div>
            <p className="mt-5 border-l-2 border-brand-600 pl-4 text-sm leading-7 text-brand-700">{stage.takeaway}</p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button type="button" disabled={stageIndex === 0} onClick={() => setStageIndex(stageIndex - 1)} className="inline-flex items-center gap-2 rounded-md px-3 py-3 text-sm text-muted hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" aria-hidden="true" />上一步</button>
            <button type="button" onClick={() => setStageIndex(last ? 0 : stageIndex + 1)} className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600">{last ? "重新演示" : "下一步"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
      <div className="flex gap-3 border-t border-line p-5 md:p-8"><Clock3 className="mt-1 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" /><p className="text-sm leading-7 text-muted">这里把受理、结算和到账分开，方便理解。实际系统的状态名称、处理顺序和到账时间应与供应商接口及钱包模式核对。</p></div>
    </section>
  )
}
