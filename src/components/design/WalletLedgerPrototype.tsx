"use client"

import { useState } from "react"
import { CircleAlert, ClipboardList, RefreshCcw, WalletCards } from "lucide-react"

const tabs = ["流水摘要", "处理记录", "技术追溯"]

export function WalletLedgerPrototype() {
  const [tab, setTab] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [adjusted, setAdjusted] = useState(false)
  const amount = adjusted ? "¥520.00" : "¥500.00"

  return (
    <section id="wallet-ledger-prototype" className="scroll-mt-8 py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-brand-700">完整页面原型 · 钱包流水</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">一笔资金记录，怎样让财务快速核对并安全处理？</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">从摘要、处理记录到技术追溯逐层查看。示例中的“人工调整”只演示确认信息，不会产生真实资金动作。</p>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-xl border border-line bg-paper p-4 md:p-6">
            <div className="rounded-lg border border-line bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-line px-4 py-3"><span className="text-sm font-semibold text-ink">钱包流水详情</span><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">入账成功</span></div>
              <div className="p-4">
                <div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-ink">充值到账</p><p className="mt-1 text-xs text-muted">流水 WF-240918-01 · 充值订单 DP-3201</p></div><p className="text-xl font-semibold text-emerald-700">+ {amount}</p></div>
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-paper p-3 text-sm"><span className="text-muted">用户</span><span className="text-right font-medium text-ink">U-10428</span><span className="text-muted">余额变化</span><span className="text-right font-medium text-ink">¥1,260 → {adjusted ? "¥1,780" : "¥1,760"}</span><span className="text-muted">完成时间</span><span className="text-right font-medium text-ink">10:42:18</span></div>
                <div className="mt-5 flex gap-2"><button type="button" onClick={() => setShowConfirm(true)} className="flex-1 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">人工调整</button><button type="button" className="flex-1 rounded-md border border-line px-3 py-2 text-sm font-medium text-brand-700">关联订单</button></div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="查看流水详情">{tabs.map((item, index) => <button key={item} type="button" role="tab" aria-selected={tab === index} onClick={() => setTab(index)} className={`rounded-md border px-3 py-2 text-sm font-medium ${tab === index ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item}</button>)}</div>
            <div className="mt-5"><LedgerContent tab={tab} /></div>
          </div>
        </div>
        {showConfirm ? <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900"><CircleAlert className="h-4 w-4" />确认人工调整 + ¥20.00？</p><p className="mt-3 text-sm leading-7 text-amber-900">将影响用户 U-10428 的余额，并新增一条人工调整流水。确认前需核对关联订单和处理原因。</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => { setAdjusted(true); setShowConfirm(false) }} className="rounded-md bg-amber-700 px-3 py-2 text-sm font-medium text-white">确认并记录原因</button><button type="button" onClick={() => setShowConfirm(false)} className="rounded-md border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-900">取消</button></div></div> : null}
      </div>
    </section>
  )
}

function LedgerContent({ tab }: { tab: number }) {
  if (tab === 0) return <div className="rounded-lg bg-paper p-5"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><WalletCards className="h-4 w-4 text-brand-700" />核对顺序</p><div className="mt-4 space-y-3">{["先核对状态和资金方向：本笔为成功入账。", "再核对金额、币种、关联订单和前后余额。", "最后确认流水号与完成时间可以追溯。"].map((item, index) => <div key={item} className="flex gap-3 rounded-md border border-line bg-white p-3 text-sm leading-6 text-muted"><span className="font-semibold text-brand-700">0{index + 1}</span>{item}</div>)}</div></div>
  if (tab === 1) return <div className="rounded-lg bg-paper p-5"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><ClipboardList className="h-4 w-4 text-brand-700" />处理时间线</p><div className="mt-4 space-y-4 border-l-2 border-brand-100 pl-4 text-sm"><div><p className="font-medium text-ink">10:41:55 · 创建充值订单</p><p className="mt-1 text-muted">用户提交 ¥500 充值请求。</p></div><div><p className="font-medium text-ink">10:42:12 · 收到成功回调</p><p className="mt-1 text-muted">回调金额与订单金额一致。</p></div><div><p className="font-medium text-ink">10:42:18 · 余额已更新</p><p className="mt-1 text-muted">写入钱包流水与关联订单。</p></div></div></div>
  return <div className="rounded-lg bg-paper p-5"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><RefreshCcw className="h-4 w-4 text-brand-700" />技术追溯</p><div className="mt-4 grid gap-3 text-sm"><Detail label="回调编号" value="CB-20260911-104212" /><Detail label="幂等标识" value="wallet:DP-3201:credit" /><Detail label="重试次数" value="0 次" /><Detail label="请求状态" value="已确认，不需要补偿" /></div></div>
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-md border border-line bg-white px-3 py-2.5"><span className="text-muted">{label}</span><span className="text-right font-medium text-ink">{value}</span></div>
}
