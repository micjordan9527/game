// Fixed fictional records shared by the list, batch and export illustrations.
export const adminDemoRecords = Array.from({ length: 8 }, (_, index) => ({
  id: `DEMO-T${String(index + 1).padStart(3, "0")}`,
  title: ["查询订单处理进度", "更新帮助内容", "核对通知状态", "查询导出申请", "核对账号资料", "查询原申请结果", "查看审核意见", "补充问题说明"][index],
  status: index % 3 === 0 ? "已关闭" : "待处理",
  time: `2026-10-27 09:${String(10 + index).padStart(2, "0")}`,
}))
