export type LinkedCase = {
  id: string
  title: string
  description: string
  recordId: string
  screens: string[]
  stages: { label: string; fields: [string, string][][]; next: string }[]
  notes: string[]
  related: { title: string; href: string }[]
}

export const commissionCents = (baseCents: number, rateBasisPoints: number) => Math.round(baseCents * rateBasisPoints / 10_000)
export const settlementAmounts = {
  priorBase: 1_000_000,
  currentBase: 1_200_000,
  correctionBase: -200_000,
  priorRate: 300,
  currentRate: 400,
}
const previous = commissionCents(settlementAmounts.priorBase, settlementAmounts.priorRate)
const current = commissionCents(settlementAmounts.currentBase, settlementAmounts.currentRate)
const adjustment = commissionCents(settlementAmounts.correctionBase, settlementAmounts.priorRate)
const amount = (cents: number) => (cents / 100).toFixed(2) + " DEMO"
const settlementId = "SET-DEMO-20261026-001"

export const settlementCase: LinkedCase = {
  id: "agent-settlement-case",
  title: "代理跨期结算：归属、批次、调整与规则版本",
  description: "同一会员在10月16日从代理 A 转至代理 B；前期已结算记录保留，当期使用新归属，前期差异仍回到原代理与原规则。所有编号、日期、金额和比例均为演示数据，不代表实际收益或正式结算规则。",
  recordId: settlementId,
  screens: ["归属变更", "结算批次", "调整记录", "规则版本"],
  stages: ["当期核算", "前期差异", "复核确认"].map((label, index) => ({
    label,
    fields: [
      [["关联批次", settlementId], ["会员", "MEM-DEMO-018"], ["原归属", "AGENT-DEMO-A · 10月01日00:00至10月16日00:00前"], ["新归属", "AGENT-DEMO-B · 自10月16日00:00起"], ["生效边界", "UTC+8；按业务发生时点归属，不改写历史"]],
      [["关联批次", settlementId], ["结算期间", "2026-10-16 至 2026-10-31，UTC+8"], ["前期 A 已确认", `${amount(settlementAmounts.priorBase)} × 3% = ${amount(previous)}`], ["当期 B 应计", `${amount(settlementAmounts.currentBase)} × 4% = ${amount(current)}`], ["当期 A 调整", index ? `${amount(settlementAmounts.correctionBase)} × 3% = ${amount(adjustment)}` : "0.00 DEMO · 尚无已识别调整"], ["本期应计合计", amount(current + (index ? adjustment : 0))], ["批次状态", index === 2 ? "已复核 · 应计记录，不代表已付款" : "待复核 · 不发起付款"]],
      [["关联批次", settlementId], ["调整编号", index ? "ADJ-DEMO-001" : "无已识别调整"], ["追溯对象", "原代理 A / 前期批次 SET-DEMO-PREV-001"], ["调整计算", index ? `${amount(settlementAmounts.correctionBase)} × 原规则3% = ${amount(adjustment)}` : "等待差异证据，不预填金额"], ["处理方式", "A 记负向调整并按约定结转；B 的480.00 DEMO保持独立，不跨代理抵扣"], ["历史保留", "前期300.00 DEMO记录不覆盖；新增调整行与原记录关联"]],
      [["关联批次", settlementId], ["原规则", "RULE-DEMO-v1 · 3% · 10月01日00:00生效"], ["新规则", "RULE-DEMO-v2 · 4% · 10月16日00:00生效"], ["调整所用规则", "原业务时点的 RULE-DEMO-v1，不能套用当前4%"], ["计量与舍入", "示例基数以分存储，比例以万分比存储；逐行四舍五入到分后汇总"]],
    ] as [string, string][][],
    next: index === 0 ? "核对归属与规则快照，再查前期差异；未复核不付款。" : index === 1 ? "保留原批次，新增 A 的负向调整；复核证据、规则与独立应计金额。" : "锁定本次复核记录。实际付款仍需独立授权、付款状态及对账证据。",
  })),
  notes: ["演示归属区间使用左闭右开边界：10月16日00:00的业务计入 B。", "当期 B 应计480.00，A 调整-60.00，合计420.00只是批次应计统计；不能将不同代理的资金互相抵扣。", "规则变更只影响其生效后的业务；前期修正按原归属、原规则关联追加，不覆盖原批次。"],
  related: [{ title: "代理系统 PRD 模板", href: "/templates/agent-system-prd" }, { title: "充值与对账完整案例", href: "/articles/wallet-payment-reconciliation#reconciliation-case" }],
}
