import { Suspense } from "react"
import { DesignDirectory } from "./DesignDirectory"
import { designTopicArticles } from "@/lib/design-navigation"

export const designTopics = [
  { slug: "information", title: "信息层级与组件", description: "信息层级、组件、表格密度与响应布局演示。" },
  { slug: "prototypes", title: "关键页面原型", description: "钱包、风险审核、详情与后台工作台原型。" },
  { slug: "mobile", title: "移动端与状态反馈", description: "手机操作、状态反馈与边界状态演示。" },
  { slug: "review", title: "界面优化图解", description: "六组界面对照中的层级、操作与反馈。" },
  { slug: "material-standards", title: "代理素材规范", description: "品牌标识、首页和运营活动素材的尺寸、格式与源稿。" },
] as const

export function DesignExperienceHub() {
  return <Suspense fallback={<p className="py-6 text-sm text-muted">正在读取设计目录…</p>}><DesignDirectory articles={designTopicArticles()} /></Suspense>
}
