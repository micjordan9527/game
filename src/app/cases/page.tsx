import { ShowcaseGrid } from "@/components/common/ShowcaseGrid"
import { showcaseItems } from "@/data/showcase"
import { absoluteUrl } from "@/lib/seo"
export const metadata = {
  title: "案例",
  description: "直接查看后台原型、官网预览与手机界面改版。",
  alternates: { canonical: absoluteUrl("/cases") },
}
export default function CasesPage() {
  return (
    <div className="container-shell py-8">
      <h1 className="text-3xl font-semibold text-ink">案例</h1>
      <p className="mt-3 text-sm leading-7 text-muted">后台原型、网站预览与界面优化对照。</p>
      <div className="mt-6">
        <ShowcaseGrid items={showcaseItems.filter((item) => item.href.startsWith("/cases/"))} />
      </div>
    </div>
  )
}
