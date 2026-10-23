import { Suspense } from "react"
import { MaterialStandardsViewer } from "@/components/design/MaterialStandardsViewer"
import { absoluteUrl } from "@/lib/seo"

export const metadata = {
  title: "代理素材规范",
  description: "查询 PC / H5 素材尺寸、格式和制作要求，查看品牌标识、首页与运营活动的页面预览和 Figma 源稿。",
  alternates: {
    canonical: absoluteUrl("/design/material-standards"),
  },
}

export default function MaterialStandardsPage() {
  return (
    <Suspense fallback={<div className="container-shell py-12 text-sm text-muted">正在加载素材规范…</div>}>
      <MaterialStandardsViewer />
    </Suspense>
  )
}
