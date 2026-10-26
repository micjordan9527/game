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

export const withdrawalStages = [
  { label: "待审核", order: "申请已受理，待授权审核", channel: "未发起付款", ledger: "已冻结100.00 DEMO，未扣款", available: 116_000, frozen: 10_000, paid: 0, review: "核对本人申请、金额、权限与冻结记录；未审核不发起付款。" },
  { label: "处理中", order: "付款请求处理中", channel: "原请求处理中，尚无终态", ledger: "冻结保持100.00 DEMO，不再次扣减可用金额", available: 116_000, frozen: 10_000, paid: 0, review: "查询原付款请求；保留同一请求编号，不重复发起、不释放冻结。" },
  { label: "结果未知", order: "付款结果确认中", channel: "请求超时，终态未知", ledger: "冻结保持100.00 DEMO，不自动退回", available: 116_000, frozen: 10_000, paid: 0, review: "先查询原通道请求并保留处理中证据；超时不等于失败，不能另建付款请求。" },
  { label: "已退回", order: "已确认失败，冻结已释放", channel: "通道已确认失败，未付款", ledger: "REL-DEMO-001 · 释放原冻结100.00 DEMO，仅一次", available: 126_000, frozen: 0, paid: 0, review: "取得明确失败证据并经授权后释放原冻结；解冻不是新增充值，重复通知不重复退回。" },
  { label: "已完成", order: "付款成功，冻结已核销", channel: "通道成功终态，付款100.00 DEMO", ledger: "PAY-DEMO-001 · 核销冻结100.00 DEMO，仅一次", available: 116_000, frozen: 0, paid: 10_000, review: "关联付款与账本流水；核销冻结时不再扣可用金额，重复通知不生成第二笔有效扣款。" },
] as const
export const withdrawalCase: LinkedCase = {
  id: "withdrawal-case",
  title: "提现异常处理：审核、通道与资金记录",
  description: "申请 WD-DEMO-20261026-001 关联同一付款请求 CH-WD-DEMO-001 与冻结 FRZ-DEMO-001。本例起始可用1260.00、冻结0.00，申请100.00，演示手续费0.00；各案例为独立虚构快照，不连接真实钱包、审核或付款。",
  recordId: "WD-DEMO-20261026-001",
  screens: ["申请与审核", "付款通道", "冻结记录", "资金流水", "异常复核"],
  stages: withdrawalStages.map((stage) => ({
    label: stage.label,
    fields: [
      [["平台申请", "WD-DEMO-20261026-001"], ["会员", "MEM-DEMO-018"], ["申请金额 / 手续费", "100.00 / 0.00 DEMO"], ["申请状态", stage.order], ["审核职责", "客服查询与转交；授权审核人员决定；财务按批准请求处理，均为演示角色"]],
      [["平台申请", "WD-DEMO-20261026-001"], ["原付款请求", "CH-WD-DEMO-001"], ["通道结果", stage.channel], ["幂等依据", "同一申请与原请求号；重试先查原结果，不另建付款"]],
      [["平台申请", "WD-DEMO-20261026-001"], ["原冻结", "FRZ-DEMO-001 · 100.00 DEMO"], ["当前冻结", amount(stage.frozen)], ["当前可用", amount(stage.available)], ["处理记录", stage.ledger]],
      [["平台申请", "WD-DEMO-20261026-001"], ["当前可用", amount(stage.available)], ["当前冻结", amount(stage.frozen)], ["账面合计", amount(stage.available + stage.frozen)], ["已付出", amount(stage.paid)], ["资金核对", `${amount(stage.available + stage.frozen)} + 已付出${amount(stage.paid)} = 起始1260.00 DEMO`], ["处理记录", stage.ledger]],
      [["平台申请", "WD-DEMO-20261026-001"], ["结果依据", stage.channel], ["复核动作", stage.review], ["留存记录", "原申请、审核依据、通道查询/通知、冻结与有效流水分别保留"]],
    ] as [string, string][][],
    next: stage.review,
  })),
  notes: ["申请冻结后，可用1160.00 + 冻结100.00 = 起始1260.00；处理中与结果未知均保持原冻结。", "确认失败并授权退回后，可用恢复1260.00；成功后账面1160.00 + 已付出100.00 = 起始1260.00。", "冻结、解冻与付款核销各有唯一关联记录；不能在申请冻结后又从可用金额重复扣款，也不能因超时自动退回。"],
  related: [{ title: "充值与对账案例", href: "/articles/wallet-payment-reconciliation#reconciliation-case" }, { title: "钱包支付与对账检查表", href: "/templates/wallet-reconciliation-checklist" }],
}
