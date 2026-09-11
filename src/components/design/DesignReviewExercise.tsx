"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, ChevronRight, CircleAlert, RotateCcw } from "lucide-react"

const storageKey = "design-review-exercise-record"
const courseProgressEvent = "wg-course-module-progress"

const questions = [
  {
    scenario: "客服需要在会员列表中找出今天要跟进的人。",
    prompt: "首屏最该优先展示哪一组信息？",
    options: ["昵称、注册时间、全部标签", "当前状态、风险信号、最近更新时间", "设备指纹、完整备注、历史登录 IP"],
    answer: 1,
    explanation: "客服当前的任务是判断谁需要处理，因此状态、风险信号和时间应先出现；技术追溯字段放进详情。",
  },
  {
    scenario: "用户的投注提交后，系统正在确认盘口与余额。",
    prompt: "处理中状态最合适的反馈是什么？",
    options: ["只显示一个转圈图标", "提示“投注失败”，让用户重试", "说明正在受理、提醒不要重复提交，并提供查看状态入口"],
    answer: 2,
    explanation: "处理中不是失败。用户需要知道为什么等待、现在不要做什么，以及在哪里继续确认结果。",
  },
  {
    scenario: "风控审核员准备拦截一个关联账户。",
    prompt: "确认操作前最需要补充什么？",
    options: ["只显示“确定拦截？”", "影响对象、拦截原因与对订单或资金的影响", "把按钮换成更醒目的红色"],
    answer: 1,
    explanation: "颜色不能代替信息。危险操作要在提交前把影响范围和理由讲清楚，并允许用户取消。",
  },
  {
    scenario: "钱包流水显示一笔充值到账。",
    prompt: "金额附近最值得同时展示什么？",
    options: ["请求报文和技术状态码", "资金方向、订单状态和余额变化", "所有历史流水的备注"],
    answer: 1,
    explanation: "财务需要快速核对资金是否正确，因此金额、方向、状态、关联订单和前后余额应保持相邻。",
  },
  {
    scenario: "用户筛选订单后没有任何结果。",
    prompt: "空状态应该怎么做？",
    options: ["只放空白插图", "说明当前筛选条件、可能原因和清除筛选入口", "直接跳回首页"],
    answer: 1,
    explanation: "空状态不是没有内容，而是用户的查询没有结果。应保留理解原因和继续操作的路径。",
  },
  {
    scenario: "手机端展示注单详情。",
    prompt: "屏幕变小时最合理的处理是什么？",
    options: ["把所有桌面字段缩小到一屏", "保留状态、玩法、金额和结果，低频信息按需展开", "删除所有金额和时间信息"],
    answer: 1,
    explanation: "响应式不是缩小桌面页面。应优先保留当前判断必需的信息，把日志和关联记录等内容收进详情。",
  },
]

type RecordState = { answered: number; correct: number }

export function DesignReviewExercise() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [record, setRecord] = useState<RecordState>({ answered: 0, correct: 0 })
  const question = questions[index]
  const answered = selected !== null
  const correct = selected === question.answer

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as RecordState
      if (typeof parsed.answered === "number" && typeof parsed.correct === "number") setRecord(parsed)
    } catch {}
  }, [])

  function answer(optionIndex: number) {
    if (answered) return
    const nextRecord = { answered: record.answered + 1, correct: record.correct + (optionIndex === question.answer ? 1 : 0) }
    setSelected(optionIndex)
    setRecord(nextRecord)
    window.localStorage.setItem(storageKey, JSON.stringify(nextRecord))
    if (nextRecord.answered >= questions.length) {
      window.dispatchEvent(new CustomEvent(courseProgressEvent, { detail: { categorySlug: "design", moduleId: "design-module-3", completed: true } }))
    }
  }

  function next() {
    setIndex((current) => (current + 1) % questions.length)
    setSelected(null)
  }

  function reset() {
    setIndex(0)
    setSelected(null)
    setRecord({ answered: 0, correct: 0 })
    window.localStorage.removeItem(storageKey)
    window.dispatchEvent(new CustomEvent(courseProgressEvent, { detail: { categorySlug: "design", moduleId: "design-module-3", completed: false } }))
  }

  return (
    <section className="py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-700">设计走查任务</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">看到一个业务场景，你会怎样调整页面？</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">六道场景题覆盖列表、状态、钱包、空状态和移动端；作答后立即查看原因。</p>
          </div>
          <div className="rounded-lg bg-brand-50 px-4 py-3 text-right">
            <p className="text-xs font-medium text-brand-700">本次完成记录</p>
            <p className="mt-1 text-lg font-semibold text-brand-800">{record.correct} / {record.answered || 0} 正确</p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-lg bg-paper p-5">
            <p className="text-xs font-semibold text-brand-700">题库 {index + 1} / {questions.length}</p>
            <p className="mt-3 text-lg font-semibold leading-8 text-ink">{question.scenario}</p>
            <div className="mt-6 grid grid-cols-6 gap-2">
              {questions.map((_, current) => <span key={current} className={`h-2.5 rounded-full ${current === index ? "bg-brand-600" : current < index ? "bg-brand-200" : "bg-line"}`} />)}
            </div>
            <button type="button" onClick={reset} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"><RotateCcw className="h-4 w-4" />清除本次记录</button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ink">{question.prompt}</h3>
            <div className="mt-4 space-y-3">
              {question.options.map((option, optionIndex) => {
                const isSelected = selected === optionIndex
                const isAnswer = optionIndex === question.answer
                const tone = answered && isAnswer ? "border-emerald-300 bg-emerald-50" : answered && isSelected ? "border-rose-300 bg-rose-50" : isSelected ? "border-brand-600 bg-brand-50" : "border-line bg-white hover:bg-paper"
                return <button key={option} type="button" disabled={answered} onClick={() => answer(optionIndex)} className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left text-sm leading-7 transition ${tone}`}><span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${isSelected ? "border-brand-600 bg-brand-600 text-white" : "border-line text-muted"}`}>{String.fromCharCode(65 + optionIndex)}</span><span className="text-ink">{option}</span></button>
              })}
            </div>
            {answered ? <div className={`mt-4 rounded-lg border p-4 text-sm leading-7 ${correct ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}><p className="inline-flex items-center gap-2 font-semibold">{correct ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}{correct ? "判断正确" : "再看一次重点"}</p><p className="mt-2">{question.explanation}</p><button type="button" onClick={next} className="mt-3 inline-flex items-center gap-2 rounded-md border border-current/20 bg-white/70 px-3 py-2 text-sm font-medium">下一题<ChevronRight className="h-4 w-4" /></button></div> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
