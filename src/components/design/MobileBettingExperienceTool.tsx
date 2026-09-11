"use client"

import { useState } from "react"
import { CheckCircle2, CircleAlert, Smartphone, TimerReset } from "lucide-react"

const stages = [
  {
    name: "选玩法",
    title: "先让用户确认自己在选什么",
    good: ["赛事、开赛时间与玩法名称同时出现", "赔率按钮保留主客队或大小分的完整语义", "不可投注时直接说明原因"],
    risk: "只展示赔率数字，用户容易在不同盘口间误点。",
    preview: "主队胜  1.86",
  },
  {
    name: "填写金额",
    title: "输入时就把结果说清楚",
    good: ["余额、最低限额与最高限额靠近输入框", "快捷金额不覆盖用户手动输入", "预估返还随金额和赔率即时更新"],
    risk: "把限额、余额或返还结果放到提交后，用户需要反复修改。",
    preview: "投注 ¥100 · 预计返还 ¥186",
  },
  {
    name: "确认提交",
    title: "提交前再核对一次关键承诺",
    good: ["显示玩法、赔率、金额和预计返还", "赔率变化时要求用户明确接受新值", "主要按钮只表达一个动作"],
    risk: "提交动作和修改、删除混在一起，会放大误操作概率。",
    preview: "确认投注 · 赔率 1.86",
  },
  {
    name: "结果反馈",
    title: "让用户知道订单是否真的受理",
    good: ["成功后给出注单编号和当前状态", "失败时说明能否修改后重试", "受理中、取消、结算使用明确状态文案"],
    risk: "只弹出短暂提示，用户无法确认资金与注单是否一致。",
    preview: "已受理 · 注单 #BT240918",
  },
]

export function MobileBettingExperienceTool() {
  const [index, setIndex] = useState(0)
  const stage = stages[index]

  return (
    <section className="py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-brand-700">移动端体验检查器</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">一笔投注在手机上，应当怎样走得清楚？</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">按步骤查看用户需要确认的内容，并识别会导致犹豫、误点或重复提交的界面问题。</p>

        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="投注步骤">
          {stages.map((item, itemIndex) => (
            <button key={item.name} type="button" role="tab" aria-selected={index === itemIndex} onClick={() => setIndex(itemIndex)} className={`rounded-md border px-3 py-2 text-sm font-medium ${index === itemIndex ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>
              {String(itemIndex + 1).padStart(2, "0")} {item.name}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="mx-auto w-full max-w-[285px] rounded-[2rem] border-[7px] border-ink bg-paper p-3 shadow-soft">
            <div className="rounded-[1.3rem] bg-white p-4">
              <div className="flex items-center justify-between text-xs text-muted"><span>9:41</span><Smartphone className="h-3.5 w-3.5" /></div>
              <p className="mt-6 text-xs font-medium text-muted">冠军联赛 · 即将开始</p>
              <p className="mt-1 text-sm font-semibold text-ink">皇家马德里 vs 阿森纳</p>
              <div className="mt-5 rounded-lg border border-brand-100 bg-brand-50 p-3 text-sm font-semibold text-brand-800">{stage.preview}</div>
              <div className="mt-4 rounded-md bg-ink px-3 py-2.5 text-center text-sm font-semibold text-white">{index === 2 ? "确认投注" : "继续"}</div>
              <p className="mt-4 text-center text-[11px] text-muted">第 {index + 1} 步 / 共 {stages.length} 步</p>
            </div>
          </div>

          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700"><TimerReset className="h-4 w-4" />第 {index + 1} 步：{stage.name}</p>
            <h3 className="mt-3 text-xl font-semibold text-ink">{stage.title}</h3>
            <ul className="mt-5 space-y-3">
              {stage.good.map((item) => <li key={item} className="flex gap-3 rounded-lg border border-line bg-paper p-3 text-sm leading-6 text-muted"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}
            </ul>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900"><CircleAlert className="mr-2 inline h-4 w-4 text-amber-700" />{stage.risk}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
