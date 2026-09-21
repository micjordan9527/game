import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { DesignEntryActions } from "@/components/design/DesignEntryActions"

export const designTopics = [
  {
    slug: "information",
    eyebrow: "01 · 看得懂",
    title: "信息层级与组件",
    description: "用层级、密度和业务组件，让复杂后台先有清晰的阅读顺序。",
    includes: "信息层级演示、后台组件库、表格密度与响应优先级。",
  },
  {
    slug: "prototypes",
    eyebrow: "02 · 会操作",
    title: "关键页面原型",
    description: "从资金、风控、注单到工作台，理解核心页面如何支持日常判断。",
    includes: "钱包流水、风险审核、注单详情与后台工作台。",
  },
  {
    slug: "mobile",
    eyebrow: "03 · 用得顺",
    title: "移动端与状态反馈",
    description: "梳理下注流程、反馈节奏和边界状态，减少用户等待和误操作。",
    includes: "移动下注、状态反馈、边界状态预览。",
  },
  {
    slug: "review",
    eyebrow: "04 · 能交付",
    title: "评审与交付",
    description: "将页面判断沉淀为评审练习、体验清单和可协作的交付信息。",
    includes: "设计评审练习、体验清单与交付看板。",
  },
] as const

export function DesignExperienceHub() {
  return (
    <>
      <DesignEntryActions />
      <section className="py-10">
        <SectionHeader eyebrow="知识地图" title="核心设计能力" description="四个专题覆盖从看懂信息、完成操作到移动反馈和交付协作的完整设计判断。它们是能力地图，不是另一套课程。" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {designTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/design/${topic.slug}`}
              className="group rounded-xl border border-line bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
            >
              <div className="text-sm font-semibold text-brand-700">{topic.eyebrow}</div>
              <h3 className="mt-3 text-xl font-semibold text-ink">{topic.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{topic.description}</p>
              <p className="mt-5 border-t border-line pt-4 text-sm leading-6 text-muted">包含：{topic.includes}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                进入专题 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
