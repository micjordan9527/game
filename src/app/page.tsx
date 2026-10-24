import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ShowcaseGrid } from "@/components/common/ShowcaseGrid"
import { VisualGallery } from "@/components/home/VisualGallery"
import { showcaseItems } from "@/data/showcase"
import { workRoles } from "@/data/workRoles"

export default function HomePage() {
  return (
    <div>
      <section className="container-shell py-8 md:py-10">
        <p className="text-sm font-semibold text-brand-700">产品 · 设计 · AI 实践</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal text-ink md:text-4xl">包网知识库</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              后台原型、界面优化、AI 工作流与业务图解。
            </p>
          </div>
          <Link href="/cases" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
            全部案例 <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-6">
          <ShowcaseGrid items={showcaseItems} />
        </div>
      </section>
      <section className="container-shell border-t border-line py-8">
        <h2 className="text-xl font-semibold text-ink">按角色浏览</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {workRoles.map((role) => (
            <Link
              key={role.slug}
              href={`/roles/${role.slug}`}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-muted hover:text-brand-700"
            >
              {role.title}
            </Link>
          ))}
        </div>
      </section>
      <VisualGallery />
      <section className="container-shell border-t border-line py-8">
        <h2 className="text-xl font-semibold text-ink">常用资料</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["/design/material-standards", "素材规范", "查看尺寸、实际页面与源稿"],
            ["/templates", "工作模板", "预览示例、复制与下载"],
            ["/glossary", "术语查询", "一句话理解常见概念"],
          ].map(([href, title, description]) => (
            <Link key={href} href={href} className="rounded-lg border border-line bg-white p-5">
              <h3 className="font-semibold text-ink">{title} →</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
