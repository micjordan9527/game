import Link from "next/link"
import { ArrowRight, BookOpen, ClipboardCheck, Layers3 } from "lucide-react"

const actions = [
  {
    title: "系统学习",
    description: "从信息层级、页面设计、移动反馈到评审交付逐步学习。",
    label: "开始学习",
    href: "#design-learning-path",
    icon: BookOpen,
  },
  {
    title: "页面评审",
    description: "从信息、操作、状态、异常和权限等角度检查页面。",
    label: "开始评审",
    href: "/design/information",
    icon: ClipboardCheck,
  },
  {
    title: "案例与资源",
    description: "查看后台、钱包、风控、注单和移动端原型与案例。",
    label: "查看案例",
    href: "/design/prototypes",
    icon: Layers3,
  },
] as const

export function DesignEntryActions() {
  return (
    <section className="py-10" aria-labelledby="design-entry-actions-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-700">任务入口</p>
          <h2 id="design-entry-actions-title" className="mt-2 text-2xl font-semibold text-ink md:text-3xl">你今天要解决什么？</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-muted">从当前任务进入对应内容，再回到完整的设计知识地图。</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.title} href={action.href} className="group rounded-lg border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{action.title}</h3>
              <p className="mt-2 min-h-14 text-sm leading-7 text-muted">{action.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">{action.label}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
