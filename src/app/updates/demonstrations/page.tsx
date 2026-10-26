import type { Metadata } from "next"
import Link from "next/link"
import { demonstrationEntries } from "@/data/demonstrationEntries"
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
      <ul className="mt-6 grid gap-3 md:grid-cols-2" aria-label="已有功能演示">
        {demonstrationEntries.map((item) => (
          <li key={item.title} className="min-w-0 rounded-xl border border-line bg-white p-5">
            <h2 className="font-semibold text-ink">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            <Link href={item.href} className="mt-3 inline-block text-sm font-semibold text-brand-700">打开{item.title} →</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
