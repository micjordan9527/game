import { ShowcaseGrid } from "@/components/common/ShowcaseGrid"
import { showcaseItems } from "@/data/showcase"
import { absoluteUrl } from "@/lib/seo"
export const metadata = {
  title: "作品案例",
  description: "直接查看后台原型、官网预览与手机界面改版。",
  alternates: { canonical: absoluteUrl("/cases") },
}
export default function CasesPage() {
  return (
    <div className="container-shell py-8">
      <h1 className="text-3xl font-semibold text-ink">作品案例</h1>
      <p className="mt-3 text-sm leading-7 text-muted">打开原型、放大对照图，直接看页面和变化。</p>
      <div className="mt-6">
        <ShowcaseGrid items={showcaseItems.filter((item) => item.href.startsWith("/cases/"))} />
      </div>
    </div>
  )
}
