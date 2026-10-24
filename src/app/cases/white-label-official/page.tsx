import Link from "next/link"
import { absoluteUrl } from "@/lib/seo"
import { assetPath } from "@/lib/assets"
import { appendAssetVersion } from "@/lib/assetVersion"
const src = appendAssetVersion("/case-assets/white-label-official/index.html")
export const metadata = {
  title: "包网官网",
  description: "直接查看官网页面的服务展示、布局与咨询入口。",
  alternates: { canonical: absoluteUrl("/cases/white-label-official") },
}
export default function WhiteLabelOfficialCasePage() {
  return (
    <div className="container-shell py-6 md:py-8">
      <Link href="/cases" className="text-sm font-semibold text-muted hover:text-brand-700">
        ← 作品案例
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-ink">包网官网</h1>
          <p className="mt-2 text-sm leading-7 text-muted">完整页面预览，查看服务展示与内容布局。</p>
        </div>
        <a
          href={assetPath(src)}
          target="_blank"
          rel="noopener"
          className="rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white"
        >
          全屏打开 ↗
        </a>
      </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-line bg-white">
        <iframe
          src={assetPath(src)}
          title="包网官网案例预览"
          className="h-[78vh] w-full bg-white"
          sandbox="allow-scripts allow-forms allow-popups"
        />
      </div>
    </div>
  )
}
