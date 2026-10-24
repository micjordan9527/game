import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { materialStandards } from "@/data/materialStandards"

const commonMaterialSlugs = ["brand-logo", "banner", "all-agent", "home-popup", "activity-list", "venue-logo"]
const commonMaterials = commonMaterialSlugs
  .map((slug) => materialStandards.find((item) => item.slug === slug))
  .filter((item) => item !== undefined)

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
    title: "界面优化图解",
    description: "用六组改前改后对照，看清页面层级、操作和反馈。",
    includes: "界面对照、设计标注与协作流程。",
  },
  {
    slug: "material-standards",
    eyebrow: "05 · 素材规范",
    title: "代理素材规范",
    description: "查询品牌标识、首页、运营活动等场景的素材尺寸、格式与制作要求。",
    includes: "PC / H5 规格、全民代理素材、页面预览与 Figma 源稿。",
  },
] as const

export function DesignExperienceHub() {
  return (
    <>
      <section id="common-materials" className="scroll-mt-24 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="常用素材"
            title="直接查看你要制作的素材"
            description="按使用场景查看尺寸、格式、命名与导出要求。"
          />
          <Link
            href="/design/material-standards"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            查看全部素材 <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {commonMaterials.map((item) => (
            <Link
              key={item.slug}
              href={`/design/material-standards?module=${item.slug}`}
              className="group flex flex-col rounded-xl border border-line bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-soft"
            >
              <div className="text-xs font-semibold text-brand-700">{item.category}</div>
              <h3 className="mt-3 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-muted">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                查看规格 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="py-12">
        <SectionHeader
          eyebrow="设计体验导航"
          title="选择你要解决的页面问题"
          description="直接查看组件、关键页面、移动端反馈与设计对照。"
        />
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
