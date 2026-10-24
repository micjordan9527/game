import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { workRoles } from "@/data/workRoles"

const tasks = [
  { title: "理解业务", href: "/articles/how-gambling-platform-works", description: "从平台运转全貌开始" },
  { title: "设计页面", href: "/design/prototypes", description: "查看钱包、风控与工作台原型" },
  { title: "写需求", href: "/templates/white-label-requirement-form", description: "使用项目需求收集表" },
  { title: "做评审", href: "/design/review", description: "使用体验评审与交付清单" },
  { title: "做验收", href: "/templates/launch-checklist", description: "逐项核对上线条件" },
]

export function WorkEntryPoints() {
  return (
    <section className="mt-8 border-t border-line pt-6" aria-labelledby="work-entry-title">
      <h2 id="work-entry-title" className="text-xl font-semibold text-ink">从你的角色与任务开始</h2>
      <p className="mt-2 text-sm leading-7 text-muted">按角色建立知识框架，或直接找到手头工作需要的资料。</p>
      <h3 className="mt-5 text-sm font-semibold text-ink">我是…</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {workRoles.map((item) => (
          <Link key={item.title} href={`/roles/${item.slug}`} className="group min-w-0 rounded-lg border border-line bg-white p-4 transition hover:border-brand-200 hover:shadow-soft">
            <span className="flex items-center justify-between gap-2 font-semibold text-ink group-hover:text-brand-700">{item.title}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
            <span className="mt-2 block text-sm leading-6 text-muted">{item.summary}</span>
          </Link>
        ))}
      </div>
      <h3 className="mt-6 text-sm font-semibold text-ink">我想…</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {tasks.map((item) => (
          <Link key={item.title} href={item.href} className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-brand-700 transition hover:border-brand-300">
            <span className="block text-sm font-semibold">{item.title} →</span>
            <span className="mt-1 block text-xs leading-5">{item.description}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
