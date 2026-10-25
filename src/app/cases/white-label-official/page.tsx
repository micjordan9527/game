import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"
import { resourcesForResource } from "@/lib/knowledge-relations"
import { ImageFocusExplorer } from "@/components/enrichment/ImageFocusExplorer"
import { officialFocus } from "@/data/caseEnhancements"
import Link from "next/link"
import { OfficialCasePreview } from "@/components/cases/OfficialCasePreview"
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
        ← 案例
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-ink">包网官网</h1>
          <p className="mt-2 text-sm leading-7 text-muted">查看服务展示、页面结构与咨询入口，点击下方模块定位。</p>
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
      <div id="case-materials" className="scroll-mt-24"><OfficialCasePreview src={src} /></div>
      <ImageFocusExplorer items={officialFocus} title="官网界面标注" provenance="来自现有官网演示的实际截图；咨询表单不发送数据。" />
      <KnowledgeLinks open resources={resourcesForResource("案例", "white-label-official")} title="相关案例与图解" />

    </div>
  )
}
