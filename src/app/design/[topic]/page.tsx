import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { designTopics } from "@/components/design/DesignExperienceHub"
import { DesignReviewTool } from "@/components/design/DesignReviewTool"
import { KeyPageCaseLibrary } from "@/components/design/KeyPageCaseLibrary"
import { BusinessComponentLibrary } from "@/components/design/BusinessComponentLibrary"
import { AdminTableDensityDemo } from "@/components/design/AdminTableDensityDemo"
import { ResponsivePriorityDemo } from "@/components/design/ResponsivePriorityDemo"
import { WalletLedgerPrototype } from "@/components/design/WalletLedgerPrototype"
import { RiskReviewPrototype } from "@/components/design/RiskReviewPrototype"
import { BetTicketDetailPrototype } from "@/components/design/BetTicketDetailPrototype"
import { AdminWorkbenchPrototype } from "@/components/design/AdminWorkbenchPrototype"
import { MobileBettingPrototype } from "@/components/design/MobileBettingPrototype"
import { MobileBettingExperienceTool } from "@/components/design/MobileBettingExperienceTool"
import { StatusFeedbackTool } from "@/components/design/StatusFeedbackTool"
import { EdgeStatePreview } from "@/components/design/EdgeStatePreview"
import { DesignReviewExercise } from "@/components/design/DesignReviewExercise"
import { ExperienceChecklist } from "@/components/design/ExperienceChecklist"
import { DesignDeliveryBoard } from "@/components/design/DesignDeliveryBoard"

const topicContent = {
  information: {
    title: "信息层级与组件",
    description: "先建立阅读顺序，再选择合适的组件和信息密度，让复杂业务页面更容易判断。",
    content: <><DesignReviewTool /><KeyPageCaseLibrary /><BusinessComponentLibrary /><AdminTableDensityDemo /><ResponsivePriorityDemo /></>,
  },
  prototypes: {
    title: "关键页面原型",
    description: "用可操作的页面原型拆开资金、风控和注单处理中的关键判断。",
    content: <><WalletLedgerPrototype /><RiskReviewPrototype /><BetTicketDetailPrototype /><AdminWorkbenchPrototype /></>,
  },
  mobile: {
    title: "移动端与状态反馈",
    description: "从下注流程到异常状态，观察小屏幕里如何给出及时、明确的下一步。",
    content: <><MobileBettingPrototype /><MobileBettingExperienceTool /><StatusFeedbackTool /><EdgeStatePreview /></>,
  },
  review: {
    title: "评审与交付",
    description: "通过练习、检查和交付信息，把主观体验判断变成团队可以对齐的标准。",
    content: <><DesignReviewExercise /><ExperienceChecklist /><DesignDeliveryBoard /></>,
  },
} as const

type TopicSlug = keyof typeof topicContent

export function generateStaticParams() {
  return designTopics.map(({ slug }) => ({ topic: slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params
  const item = topicContent[topic as TopicSlug]
  return item ? { title: `${item.title} | 设计体验`, description: item.description } : {}
}

export default async function DesignTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params
  const item = topicContent[topic as TopicSlug]

  if (!item) notFound()

  return (
    <div className="container-shell py-12">
      <Link href="/design" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
        <ArrowLeft className="h-4 w-4" /> 返回设计体验总览
      </Link>
      <div className="mt-6 rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <SectionHeader eyebrow="设计体验专题" title={item.title} description={item.description} />
      </div>

      {item.content}

      <section className="border-t border-line py-10">
        <div className="text-sm font-semibold text-ink">继续浏览其他专题</div>
        <div className="mt-4 flex flex-wrap gap-3">
          {designTopics.filter(({ slug }) => slug !== topic).map((sibling) => (
            <Link key={sibling.slug} href={`/design/${sibling.slug}`} className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand-200 hover:text-brand-700">
              {sibling.title} <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
