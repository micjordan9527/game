import { ArrowRight } from "lucide-react"
import { FeatureFlow } from "@/components/common/FeatureFlow"

const examples = [
  {
    title: "列表先呈现当前任务",
    before: ["昵称与全部标签", "完整备注", "登录 IP"],
    after: ["待跟进 12", "风险提示 3", "最近更新 10:35"],
    note: "状态、风险与时间放在一起，查询明细按需展开。",
  },
  {
    title: "危险操作说清影响",
    before: ["删除", "确定 / 取消"],
    after: ["停用账号", "影响：无法登录", "确认停用 / 返回"],
    note: "按钮和确认信息共同解释操作对象与结果。",
  },
  {
    title: "金额与记录保持相邻",
    before: ["金额 ¥500", "另一页查看订单", "翻页查看余额"],
    after: ["充值 +¥500", "订单 DP-3201 · 已到账", "余额 ¥1,260 → ¥1,760"],
    note: "同一张卡片展示金额、状态、订单与余额变化。",
  },
  {
    title: "空状态提供下一步",
    before: ["暂无数据"],
    after: ["当前筛选没有结果", "日期：近7天", "清除筛选 / 修改日期"],
    note: "保留当前条件，让人知道发生了什么以及如何继续。",
  },
  {
    title: "小屏保留关键字段",
    before: ["所有桌面字段缩小", "状态夹在长表格里", "操作需要左右寻找"],
    after: ["当前状态置顶", "金额与结果相邻", "详情按需展开"],
    note: "响应式用信息优先级组织空间。",
  },
  {
    title: "等待与失败都有反馈",
    before: ["提交后没有提示", "失败只显示错误"],
    after: ["处理中 · 请稍候", "失败：网络未连接", "重试 / 查看记录"],
    note: "状态文字与可用操作一起变化，减少重复提交。",
  },
]

export function DesignDecisionGallery() {
  return (
    <>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {examples.map((example) => (
          <section key={example.title} className="min-w-0 rounded-xl border border-line bg-white p-5">
            <h2 className="text-lg font-semibold text-ink">{example.title}</h2>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
              <div className="min-w-0 rounded-lg bg-paper p-3">
                <p className="mb-3 text-xs font-semibold text-muted">调整前</p>
                {example.before.map((text) => (
                  <div
                    key={text}
                    className="mt-2 rounded border border-line bg-white px-2 py-2 text-xs leading-5 text-muted"
                  >
                    {text}
                  </div>
                ))}
              </div>
              <ArrowRight className="my-auto h-4 w-4 text-brand-700" aria-hidden="true" />
              <div className="min-w-0 rounded-lg bg-brand-50 p-3">
                <p className="mb-3 text-xs font-semibold text-brand-700">调整后</p>
                {example.after.map((text, index) => (
                  <div
                    key={text}
                    className={`mt-2 rounded border px-2 py-2 text-xs leading-5 ${index === 0 ? "border-brand-200 bg-white font-semibold text-brand-700" : "border-brand-100 bg-white/80 text-ink"}`}
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted">{example.note}</p>
          </section>
        ))}
      </div>
      <FeatureFlow
        title="从业务到界面的协作"
        caption="界面与流程示意"
        steps={[
          { title: "产品", text: "明确角色、规则和状态。" },
          { title: "交互", text: "连接流程与用户反馈。" },
          { title: "设计", text: "组织层级、组件和样式。" },
          { title: "开发", text: "实现状态与页面响应。" },
        ]}
      />
    </>
  )
}
