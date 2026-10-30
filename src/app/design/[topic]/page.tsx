import Link from "next/link"
import { Suspense } from "react"
import { DesignDirectoryReturnLink } from "@/components/article/DesignArticleNavigation"
import { notFound } from "next/navigation"
import { absoluteUrl } from "@/lib/seo"
import { ArrowRight } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { designTopics } from "@/components/design/DesignExperienceHub"
import { PrototypeTabs } from "@/components/design/PrototypeTabs"
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
import { DesignDecisionGallery } from "@/components/design/DesignDecisionGallery"

const topicContent = {
  information: {
    title: "信息层级与组件",
    description: "切换查看信息层级、组件、表格密度与响应式变化。",
    content: (
      <PrototypeTabs
        panels={[
          { id: "hierarchy", title: "信息层级", content: <DesignReviewTool /> },
          { id: "case", title: "页面对照", content: <KeyPageCaseLibrary /> },
          { id: "component", title: "业务组件", content: <BusinessComponentLibrary /> },
          { id: "density", title: "表格密度", content: <AdminTableDensityDemo /> },
          { id: "responsive", title: "响应布局", content: <ResponsivePriorityDemo /> },
        ]}
      />
    ),
  },
  prototypes: {
    title: "关键页面原型",
    description: "选择一个页面，直接体验操作与反馈。",
    content: (
      <PrototypeTabs
        panels={[
          { id: "wallet", title: "钱包流水", content: <WalletLedgerPrototype /> },
          { id: "risk", title: "风险审核", content: <RiskReviewPrototype /> },
          { id: "ticket", title: "注单详情", content: <BetTicketDetailPrototype /> },
          { id: "workbench", title: "后台工作台", content: <AdminWorkbenchPrototype /> },
        ]}
      />
    ),
  },
  mobile: {
    title: "移动端与状态反馈",
    description: "手机操作流程与页面状态反馈。",
    content: (
      <PrototypeTabs
        panels={[
          { id: "mobile", title: "手机原型", content: <MobileBettingPrototype /> },
          { id: "flow", title: "操作流程", content: <MobileBettingExperienceTool /> },
          { id: "feedback", title: "状态反馈", content: <StatusFeedbackTool /> },
          { id: "edge", title: "边界状态", content: <EdgeStatePreview /> },
        ]}
      />
    ),
  },
  review: {
    title: "界面优化图解",
    description: "六组界面对照，说明信息层级、操作与状态反馈。",
    content: <DesignDecisionGallery />,
  },
} as const

type TopicSlug = keyof typeof topicContent

export function generateStaticParams() {
  return Object.keys(topicContent).map((topic) => ({ topic }))
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params
  const item = topicContent[topic as TopicSlug]
  return item
    ? {
        title: `${item.title} | 设计体验`,
        description: item.description,
        alternates: { canonical: absoluteUrl(`/design/${topic}`) },
      }
    : {}
}

export default async function DesignTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params
  const item = topicContent[topic as TopicSlug]

  if (!item) notFound()

  return (
    <div className="container-shell py-12">
      <Suspense fallback={<Link href="/design" className="text-sm font-semibold text-brand-700">← 返回设计目录</Link>}><DesignDirectoryReturnLink /></Suspense>
      <div className="mt-6 rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <SectionHeader as="h1" eyebrow="设计体验专题" title={item.title} description={item.description} />
      </div>

      {topic === "mobile" ? <Link href="/articles/mobile-page-layout#visual-guide" className="mt-5 block rounded-lg border border-line bg-white p-4 text-sm font-semibold leading-7 text-brand-700">手机页面布局图解：列表卡片、长表单、底部操作、键盘与详情返回 →</Link> : null}
      {item.content}

      <section className="border-t border-line py-10">
        <div className="text-sm font-semibold text-ink">继续浏览其他专题</div>
        <div className="mt-4 flex flex-wrap gap-3">
          {designTopics
            .filter(({ slug }) => slug !== topic)
            .map((sibling) => (
              <Link
                key={sibling.slug}
                href={`/design/${sibling.slug}`}
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand-200 hover:text-brand-700"
              >
                {sibling.title} <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
