"use client"

import { useState } from "react"
import { AlertTriangle, BadgeCheck, ClipboardCheck, Eye, ShieldAlert, UserRoundCheck } from "lucide-react"

const tabs = ["风险摘要", "关联证据", "处理记录"]

export function RiskReviewPrototype() {
  const [tab, setTab] = useState(0)
  const [decision, setDecision] = useState<"pending" | "hold" | "release">("pending")
  const [confirming, setConfirming] = useState<"hold" | "release" | null>(null)

  const status = decision === "pending" ? "待审核" : decision === "hold" ? "已限制" : "已放行"
  const statusTone = decision === "pending" ? "bg-amber-50 text-amber-800" : decision === "hold" ? "bg-rose-50 text-rose-800" : "bg-emerald-50 text-emerald-800"

  function confirmDecision() {
    if (!confirming) return
    setDecision(confirming)
    setConfirming(null)
    setTab(2)
  }

  return (
    <section id="risk-review-prototype" className="scroll-mt-8 py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-brand-700">完整页面原型 · 风控审核</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">风险判断不能只看一个分数，也不能让一次操作没有记录。</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">这是一条完整审核路径：先确认对象和影响范围，再查看证据，最后做出可追溯的处理决定。所有按钮均为演示，不会影响真实账户。</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-xl border border-line bg-paper p-4 md:p-6">
            <div className="rounded-lg border border-line bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-line px-4 py-3"><span className="text-sm font-semibold text-ink">审核单 RA-20918</span><span className={`rounded-full px-2 py-1 text-xs font-medium ${statusTone}`}>{status}</span></div>
              <div className="p-4">
                <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-700"><ShieldAlert className="h-5 w-5" /></span><div><p className="text-sm font-semibold text-ink">疑似关联账户投注</p><p className="mt-1 text-xs leading-6 text-muted">规则命中：同设备、短时间同向下注、共用收款信息</p></div></div>
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-paper p-3 text-sm"><span className="text-muted">审核对象</span><span className="text-right font-medium text-ink">U-10428</span><span className="text-muted">风险等级</span><span className="text-right font-medium text-rose-700">高 · 82 分</span><span className="text-muted">影响范围</span><span className="text-right font-medium text-ink">2 笔待结算注单</span><span className="text-muted">触发时间</span><span className="text-right font-medium text-ink">10:39:44</span></div>
                <div className="mt-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => setConfirming("hold")} disabled={decision !== "pending"} className="rounded-md bg-rose-700 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">限制账户</button><button type="button" onClick={() => setConfirming("release")} disabled={decision !== "pending"} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-brand-700 disabled:cursor-not-allowed disabled:opacity-50">确认放行</button></div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="查看风控审核信息">{tabs.map((item, index) => <button key={item} type="button" role="tab" aria-selected={tab === index} onClick={() => setTab(index)} className={`rounded-md border px-3 py-2 text-sm font-medium ${tab === index ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item}</button>)}</div>
            <div className="mt-5"><RiskContent tab={tab} decision={decision} /></div>
          </div>
        </div>

        {confirming ? <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900"><AlertTriangle className="h-4 w-4" />确认{confirming === "hold" ? "限制账户" : "放行账户"}？</p><p className="mt-3 text-sm leading-7 text-amber-900">{confirming === "hold" ? "将限制 U-10428 的下注能力，并把 2 笔待结算注单转入人工复核队列。" : "将保留现有注单并结束本次风险审核。"} 该决定会写入本页的处理记录。</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={confirmDecision} className="rounded-md bg-amber-700 px-3 py-2 text-sm font-medium text-white">确认并写入记录</button><button type="button" onClick={() => setConfirming(null)} className="rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-900">取消</button></div></div> : null}
      </div>
    </section>
  )
}

function RiskContent({ tab, decision }: { tab: number; decision: "pending" | "hold" | "release" }) {
  if (tab === 0) return <div className="rounded-lg bg-paper p-5"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Eye className="h-4 w-4 text-brand-700" />审核时先确认</p><div className="mt-4 space-y-3">{["对象：确认当前账户、关联账户和命中的规则。", "影响：明确限制会影响哪些注单、余额或权限。", "证据：把设备、行为与资金信号分开核对，避免只凭风险分数判断。"].map((item, index) => <div key={item} className="flex gap-3 rounded-md border border-line bg-white p-3 text-sm leading-6 text-muted"><span className="font-semibold text-brand-700">0{index + 1}</span>{item}</div>)}</div></div>
  if (tab === 1) return <div className="rounded-lg bg-paper p-5"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><UserRoundCheck className="h-4 w-4 text-brand-700" />关联证据</p><div className="mt-4 grid gap-3 text-sm"><Evidence label="设备指纹" value="与 U-10087、U-10216 重复" tone="高关联" /><Evidence label="投注行为" value="3 分钟内同赛事、同方向、同金额" tone="需复核" /><Evidence label="资金信息" value="同一收款信息出现 2 次" tone="高关联" /></div></div>
  const record = decision === "pending" ? "尚未处理，等待审核员作出决定。" : decision === "hold" ? "10:48:26 · 已限制账户，2 笔待结算注单进入人工复核。" : "10:48:26 · 已确认放行，审核单已结束。"
  return <div className="rounded-lg bg-paper p-5"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><ClipboardCheck className="h-4 w-4 text-brand-700" />处理记录</p><div className="mt-4 rounded-md border border-line bg-white p-4 text-sm leading-7 text-muted"><p className="font-medium text-ink">10:39:44 · 系统创建审核单</p><p className="mt-1">规则 R-12 命中后，系统汇总关联账户与待处理对象。</p><p className="mt-4 border-t border-line pt-4">{record}</p></div></div>
}

function Evidence({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className="flex items-start justify-between gap-4 rounded-md border border-line bg-white p-3"><div><p className="font-medium text-ink">{label}</p><p className="mt-1 leading-6 text-muted">{value}</p></div><span className="shrink-0 rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">{tone}</span></div>
}
