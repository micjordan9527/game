import type { Metadata } from "next"
import Link from "next/link"
import { demonstrationEntries, demonstrationGroups } from "@/data/demonstrationEntries"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "功能演示目录",
  description: "查看钱包、账号、代理、BM、U8、官网、图片浏览与搜索的已有演示入口。",
  alternates: { canonical: absoluteUrl("/updates/demonstrations") },
}

export default function DemonstrationsPage() {
  return (
    <div className="container-shell max-w-5xl py-8 md:py-10">
      <Link href="/updates#demonstrations" className="text-sm font-semibold text-brand-700">← 更新记录</Link>
      <h1 className="mt-5 text-3xl font-semibold text-ink">功能演示目录</h1>
      <p className="mt-3 text-sm leading-7 text-muted">10 个已有功能的说明与入口。各次发布新增或调整的内容见更新记录。</p>
      <nav aria-label="演示场景定位" className="mt-5 flex flex-wrap gap-2">
        {demonstrationGroups.map((group) => <a key={group.id} href={`#${group.id}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-brand-700">{group.title} · {demonstrationEntries.filter((item) => item.group === group.id).length}</a>)}
      </nav>
      <div className="mt-7 space-y-8" role="region" aria-label="已有功能演示">
        {demonstrationGroups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-24" aria-labelledby={`${group.id}-title`}>
            <h2 id={`${group.id}-title`} className="text-xl font-semibold text-ink">{group.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{group.description}</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {demonstrationEntries.filter((item) => item.group === group.id).map((item) => (
                <li key={item.title} data-demo-entry className="min-w-0 rounded-xl border border-line bg-white p-5">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
                  <p className="mt-2 text-xs leading-6 text-muted">位置：{item.location}</p>
                  <Link href={item.href} className="mt-3 inline-block text-sm font-semibold text-brand-700">打开{item.title} →</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
