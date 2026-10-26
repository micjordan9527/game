"use client"

import Link from "next/link"
import { useId, useState, type KeyboardEvent } from "react"

const caseId = "ACC-DEMO-20261026-001"
const memberId = "MEM-DEMO-018"
const screens = ["会员查询", "限制说明", "复核记录", "恢复反馈"] as const
const stages = [
  { label: "受限", account: "资料变更受限", session: "当前会话有效", profile: "未提交恢复申请，原资料仍生效", review: "尚未提交", feedback: "可查询现有资料和联系支持；资料变更暂不可用。", next: "由本人通过指定入口提交核实材料，客服只能查询和转交。", time: "09:10", event: "登记资料变更限制；账号仍可登录，未新增资金限制。" },
  { label: "复核中", account: "资料变更受限", session: "当前会话有效", profile: "审核中，原资料仍生效", review: "等待授权复核", feedback: "申请已受理，暂未解除限制；不重复提交。", next: "授权审核人员核对本人申请、限制依据和关联记录后作出结论。", time: "09:20", event: "恢复申请进入复核；资料尚未变更，原会话保持有效。" },
  { label: "需补充", account: "资料变更受限", session: "当前会话有效", profile: "需补充核实，原资料仍生效", review: "退回补充，限制保留", feedback: "核实材料不足，显示需补充项目和原申请入口。", next: "在同一申请下补充材料；退回不等于拒绝，也不生成第二个申请。", time: "09:30", event: "复核退回补充；保留限制和原资料，不触发资金处理。" },
  { label: "已恢复", account: "正常", session: "原会话已撤销，需重新登录", profile: "审核通过，新资料已生效", review: "授权复核通过 · AUDIT-DEMO-004", feedback: "资料变更限制已解除；重新登录后继续操作。", next: "核对复核记录与服务端状态；恢复账号不自动处理独立的资金事项。", time: "09:40", event: "补充后授权复核通过；新资料生效，撤销旧会话，资金状态保持不变。" },
] as const
const funds = "正常 · 本例无资金限制"

export function AccountRecoveryCase() {
  const [stageIndex, setStageIndex] = useState(0)
  const [screenIndex, setScreenIndex] = useState(0)
  const uid = useId()
  const stage = stages[stageIndex]
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number, group: "stage" | "screen") => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    const next = event.key === "Home" ? 0 : event.key === "End" ? 3 : (index + (event.key === "ArrowRight" ? 1 : -1) + 4) % 4
    if (group === "stage") setStageIndex(next)
    else setScreenIndex(next)
    document.getElementById(`${uid}-${group}-${next}`)?.focus()
  }
  const rows: [string, string][][] = [
    [["会员编号", memberId], ["关联申请", caseId], ["账号状态", stage.account], ["当前会话", stage.session]],
    [["关联申请", caseId], ["限制范围", stageIndex === 3 ? "资料变更限制已解除" : "仅限制资料变更，不限制登录"], ["登记依据", "DEMO-RULE-02 · 授权核实流程，演示规则"], ["资金状态", funds]],
    [["关联申请", caseId], ["复核结论", stage.review], ["资料申请", stage.profile], ["处理权限", "客服查询与转交；授权审核人员复核，演示角色"]],
    [["关联申请", caseId], ["账号状态", stage.account], ["当前会话", stage.session], ["资料申请", stage.profile], ["资金状态", funds], ["用户反馈", stage.feedback]],
  ]
  return (
    <section id="account-recovery-case" aria-label="账号受限与恢复完整案例" className="container-shell mb-8 max-w-6xl scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6">
      <p className="text-xs font-semibold text-brand-700">完整案例 · 交互示意与演示数据</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">账号受限与恢复：四个界面如何核对处理结果</h2>
      <p className="mt-3 text-sm leading-7 text-muted">会员 {memberId} 的申请 {caseId} 关联下方四个界面。编号、规则、角色和时间线均为虚构示例；这里展示状态记录，不执行真实账号操作。</p>
      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="选择恢复进度">
        {stages.map((item, index) => <button key={item.label} id={`${uid}-stage-${index}`} type="button" role="tab" aria-selected={stageIndex === index} aria-controls={`${uid}-panel`} tabIndex={stageIndex === index ? 0 : -1} onClick={() => setStageIndex(index)} onKeyDown={(event) => onTabKey(event, index, "stage")} className={`rounded-md border px-3 py-2 text-sm font-semibold ${stageIndex === index ? "border-ink bg-ink text-white" : "border-line text-muted hover:text-brand-700"}`}>{item.label}</button>)}
      </div>
      <dl aria-label="四项独立状态" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[["账号", stage.account], ["会话", stage.session], ["资料申请", stage.profile], ["资金", funds]].map(([label, value]) => <div key={label} className="min-w-0 rounded-lg border border-line bg-paper p-3"><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 break-words text-sm font-semibold leading-6 text-ink">{value}</dd></div>)}
      </dl>
      <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4" role="tablist" aria-label="选择恢复界面">
        {screens.map((screen, index) => <button key={screen} id={`${uid}-screen-${index}`} type="button" role="tab" aria-selected={screenIndex === index} aria-controls={`${uid}-panel`} tabIndex={screenIndex === index ? 0 : -1} onClick={() => setScreenIndex(index)} onKeyDown={(event) => onTabKey(event, index, "screen")} className={`rounded-md border p-3 text-left text-sm font-semibold ${screenIndex === index ? "border-brand-200 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}><span className="mr-2">{index + 1}.</span>{screen}</button>)}
      </div>
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-stage-${stageIndex} ${uid}-screen-${screenIndex}`} tabIndex={0} className="mt-3 rounded-xl border border-line bg-paper p-4 md:p-5">
        <p className="text-xs text-muted">当前界面 · {stage.label}</p><h3 className="mt-1 text-lg font-semibold text-ink">{screens[screenIndex]}</h3>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">{rows[screenIndex].map(([label, value]) => <div key={label} className="min-w-0 rounded-lg bg-white p-3 ring-1 ring-line"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 break-words text-sm font-semibold leading-6 text-ink">{value}</dd></div>)}</dl>
        <p className="mt-4 text-sm leading-7 text-muted"><strong className="text-ink">下一步：</strong>{stage.next}</p>
      </div>
      <details open className="mt-5 rounded-lg border border-line p-4"><summary className="cursor-pointer text-sm font-semibold text-ink">查看处理时间线与状态边界</summary>
        <p className="mt-2 text-xs leading-6 text-muted">演示日期 2026-10-26，UTC+8；选择的进度决定显示到哪一步。需补充后经再次复核，才可能进入已恢复。</p>
        <ol aria-label="恢复处理时间线" className="mt-4 space-y-3 border-l border-brand-200 pl-4">{stages.slice(0, stageIndex + 1).map((item) => <li key={item.label} className="text-sm leading-7"><p className="font-semibold text-ink"><time dateTime={`2026-10-26T${item.time}:00+08:00`}>{item.time}</time> · {item.label}</p><p className="text-muted">{item.event}</p></li>)}</ol>
        <p className="mt-4 text-sm leading-7 text-ink">账号解除限制、资料生效、会话撤销分别留记录；资金限制由钱包中的独立依据与流程决定，不能随账号恢复自动解除。</p>
      </details>
      <nav aria-label="恢复案例关联材料" className="mt-5 grid gap-3 sm:grid-cols-2"><Link href="/cases/admin-optimization#admin-role-tour" className="rounded-lg border border-line p-4 text-sm font-semibold text-brand-700">查看客服会员查询演示 →</Link><Link href="/templates/member-account-review" className="rounded-lg border border-line p-4 text-sm font-semibold text-brand-700">使用会员账号状态评审表 →</Link></nav>
    </section>
  )
}
