import Link from "next/link"
import { FileText, Image as ImageIcon, Library, Search } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"

const topics = [
  { title: "文章体系", description: "围绕行业、包网、体育、产品、运营、技术和风控建立专题内容。", href: "/industry", icon: FileText },
  { title: "术语速查", description: "把包网、钱包、盘口、流水、注单等概念拆成易查易懂的卡片。", href: "/glossary", icon: Search },
  { title: "工作模板", description: "沉淀需求表、PRD、上线检查和事故复盘等可复用资料。", href: "/templates", icon: Library },
  { title: "图解内容", description: "用结构图和流程图解释平台生态、钱包模式、体育注单和上线链路。", href: "/articles/what-is-white-label", icon: ImageIcon },
]

export function TopicExplorer() {
  return (
    <section className="container-shell py-12">
      <SectionHeader title="知识库怎么用" description="文章负责系统解释，术语负责快速查概念，模板负责把理解变成可执行资料。" />
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {topics.map((topic) => {
          const Icon = topic.icon

          return (
            <Link key={topic.title} href={topic.href} className="rounded-lg border border-line bg-white p-5 shadow-sm hover:border-brand-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">{topic.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{topic.description}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
