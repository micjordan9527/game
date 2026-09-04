import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Archive } from "lucide-react"
import { Badge } from "@/components/common/Badge"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "AI 工作流库 V2 归档",
  description: "旧版 AI 工作流库 V2 归档页。新版已改为可搜索、可筛选、可查看详情的工作流库。",
  alternates: {
    canonical: absoluteUrl("/ai-workflows/v2"),
  },
  openGraph: {
    title: "AI 工作流库 V2 归档 | 包网知识库",
    description: "旧版 V2 已归档，请使用新的 AI 工作流库入口。",
    url: absoluteUrl("/ai-workflows/v2"),
    type: "website",
  },
}

export default function AiWorkflowsV2ArchivePage() {
  return (
    <div className="container-shell max-w-4xl py-12">
      <Link href="/ai-workflows" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        返回新版工作流库
      </Link>
      <section className="mt-8 rounded-lg border border-line bg-white p-6 shadow-sm">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge tone="brand">已归档</Badge>
          <Badge>旧 V2</Badge>
        </div>
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
            <Archive className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-ink">AI 工作流库 V2 已归档</h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              旧版 V2 是单条流程长页，不适合继续扩展成库。新版已改成卡片列表、场景筛选、标签筛选、搜索和详情页结构。
            </p>
            <Link href="/ai-workflows" className="mt-5 inline-flex items-center rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              打开新版工作流库
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
