const profile = (state: string) => `/cases/competitor-analysis?profileGroup=${encodeURIComponent("订单")}&profileState=${encodeURIComponent(state)}#u8-profile-prototype`
export const stateExamples = [
  { title: "加载中", message: "正在获取订单信息", result: "结果尚未确认", next: "保留当前分组，等待结果；不显示为余额0或无订单。", href: profile("加载中"), link: "查看加载状态" },
  { title: "空结果", message: "查询完成，当前范围没有记录", result: "查询已成功，结果为空", next: "说明查询范围，并提供调整条件或查看示例记录的入口。", href: profile("空结果"), link: "查看空结果" },
  { title: "失败", message: "订单信息加载失败", result: "结果仍未知", next: "允许重试并保留当前分组；失败不等于查无记录。", href: profile("失败"), link: "查看失败与重试" },
  { title: "受限", message: "当前入口暂不可访问", result: "权限或业务条件不满足", next: "说明限制范围与可用帮助；账号限制不直接代表资金冻结。", href: profile("受限"), link: "查看入口受限" },
  { title: "处理中", message: "原付款请求仍在处理", result: "尚无最终结果", next: "沿原请求查询，保留冻结；不重复提交或自动退回。", href: `/articles/wallet-payment-reconciliation?caseStage=${encodeURIComponent("处理中")}#withdrawal-case`, link: "查看处理中记录" },
  { title: "结果未知", message: "付款请求超时，终态未知", result: "超时不等于失败", next: "核对原通道查询和通知，取得终态证据后再处理资金。", href: `/articles/wallet-payment-reconciliation?caseStage=${encodeURIComponent("结果未知")}#withdrawal-case`, link: "查看未知结果" },
]
