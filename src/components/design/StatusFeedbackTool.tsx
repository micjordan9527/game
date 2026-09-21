"use client"

import { useState } from "react"
import { BadgeCheck, CircleDashed, CircleX, MessageSquareWarning } from "lucide-react"

const statuses = [
  {
    name: "已成功",
    tone: "emerald",
    icon: BadgeCheck,
    label: "投注已受理",
    description: "你的注单已成功提交，等待赛事结果。",
    detail: "注单号 BT240918 · 投注 ¥100 · 赔率 1.86",
    action: "查看注单",
    rule: "说明结果已经发生，并给出可追溯的编号或下一步入口。",
  },
  {
    name: "处理中",
    tone: "blue",
    icon: CircleDashed,
    label: "正在受理投注",
    description: "请勿重复提交，系统正在确认本次请求。",
    detail: "通常会在数秒内完成，可前往注单记录查看状态。",
    action: "查看处理状态",
    rule: "解释为什么要等待、用户此刻不需要做什么，以及可在哪里继续查看。",
  },
  {
    name: "需确认",
    tone: "amber",
    icon: MessageSquareWarning,
    label: "赔率已变化",
    description: "主队胜赔率由 1.86 变为 1.80，请确认是否继续。",
    detail: "投注金额 ¥100 · 新预计返还 ¥180",
    action: "接受新赔率",
    rule: "变化内容、影响范围与两个清晰选择必须同时出现。",
  },
  {
    name: "未完成",
    tone: "rose",
    icon: CircleX,
    label: "投注未能提交",
    description: "当前投注金额超过单笔限额 ¥5,000。",
    detail: "本次输入 ¥8,000 · 可修改金额后重新提交。",
    action: "修改金额",
    rule: "不要只说失败；说明具体原因、保留的内容与可立即采取的动作。",
  },
]

const tones = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  blue: "border-sky-200 bg-sky-50 text-sky-800",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
}

export function StatusFeedbackTool() {
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState("")
  const status = statuses[index]
  const Icon = status.icon

  return (
    <section className="py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-brand-700">状态反馈检查器</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">状态出现时，用户是否知道发生了什么？</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">切换常见业务状态，检查反馈是否同时交代结果、原因、影响和下一步动作。</p>

        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="选择状态">
          {statuses.map((item, itemIndex) => (
            <button key={item.name} type="button" role="tab" aria-selected={index === itemIndex} onClick={() => { setIndex(itemIndex); setFeedback("") }} className={`rounded-md border px-3 py-2 text-sm font-medium ${index === itemIndex ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item.name}</button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className={`rounded-xl border p-5 ${tones[status.tone as keyof typeof tones]}`}>
            <div className="flex items-start gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-base font-semibold">{status.label}</p><p className="mt-2 text-sm leading-7">{status.description}</p></div></div>
            <p className="mt-4 rounded-md bg-white/70 p-3 text-sm leading-6">{status.detail}</p>
            <button type="button" onClick={() => setFeedback(`${status.action}：演示已触发，实际产品应进入对应处理路径。`)} className="mt-5 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white">{status.action}</button>{feedback ? <p className="mt-3 text-sm" role="status">{feedback}</p> : null}
          </div>

          <div className="rounded-lg bg-paper p-5">
            <p className="text-sm font-semibold text-ink">评审要点</p>
            <p className="mt-3 text-sm leading-7 text-muted">{status.rule}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["用户看见了什么结果？", "为什么会出现这个状态？", "对金额、订单或权限有什么影响？", "现在可以做什么？"].map((question) => <div key={question} className="rounded-md border border-line bg-white p-3 text-sm font-medium leading-6 text-ink">{question}</div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
