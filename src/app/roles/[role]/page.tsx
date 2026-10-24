import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { getWorkRole, workRoles } from "@/data/workRoles"
import { absoluteUrl } from "@/lib/seo"

export function generateStaticParams() {
  return workRoles.map((role) => ({ role: role.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const entry = getWorkRole(role)
  if (!entry) return {}
  return { title: `${entry.title}工作路径`, description: entry.goal, alternates: { canonical: absoluteUrl(`/roles/${entry.slug}`) } }
}

export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const entry = getWorkRole(role)
  if (!entry) notFound()
  const next = getWorkRole(entry.nextRole)!

  return (
    <div className="container-shell max-w-5xl py-12">
      <Link href="/" className="text-sm font-semibold text-muted hover:text-brand-700">← 返回首页</Link>
      <h1 className="mt-6 text-3xl font-semibold text-ink md:text-4xl">{entry.title}工作路径</h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{entry.goal}</p>
      <nav aria-label="角色工作路径" className="mt-6 flex flex-wrap gap-2">
        {workRoles.map((item) => (
          <Link key={item.slug} href={`/roles/${item.slug}`} aria-current={item.slug === role ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${item.slug === role ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:text-brand-700"}`}>
            {item.title}
          </Link>
        ))}
      </nav>
      <section className="mt-10" aria-labelledby="role-steps-title">
        <h2 id="role-steps-title" className="text-xl font-semibold text-ink">按任务使用资料</h2>
        <ol className="mt-5 space-y-3">
          {entry.steps.map((step, index) => (
            <li key={step.href}>
              <Link href={step.href} className="group flex items-start gap-4 rounded-xl border border-line bg-white p-5 transition hover:border-brand-200 hover:shadow-soft">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700" aria-hidden="true">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink group-hover:text-brand-700">{step.title}</h3>
                    <span className="rounded bg-paper px-2 py-1 text-xs text-muted">{step.kind}</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted">{step.description}</p>
                </div>
                <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-8 rounded-xl border border-line bg-white p-6" aria-labelledby="role-outputs-title">
        <h2 id="role-outputs-title" className="text-xl font-semibold text-ink">完成后应具备</h2>
        <ul className="mt-4 space-y-3">
          {entry.outputs.map((output) => <li key={output} className="flex items-start gap-2 text-sm leading-7 text-muted"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />{output}</li>)}
        </ul>
        <div className="mt-6 border-t border-line pt-5">
          <h3 className="font-semibold text-ink">与{next.title}衔接</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{entry.handoff}</p>
          <Link href={`/roles/${next.slug}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">查看{next.title}工作路径 <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  )
}
