import type { Metadata } from "next"
import { ArticleLibrary } from "@/components/articles/ArticleLibrary"
import { articles } from "@/data/articles"
import { absoluteUrl } from "@/lib/seo"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "知识图解",
  description: "按主题、角色与标签查看行业、业务、设计与技术知识。",
  alternates: {
    canonical: absoluteUrl("/articles"),
  },
  openGraph: {
    title: "知识图解 | 包网知识库",
    description: "按主题、角色与标签查看行业、业务、设计与技术知识。",
    url: absoluteUrl("/articles"),
    type: "website",
  },
}

export default function ArticlesPage() {
  return (
    <div className="container-shell py-10 md:py-12">
      <section className="mb-8 rounded-lg border border-line bg-white p-5 shadow-sm md:p-8">
        <p className="mb-2 text-sm font-semibold text-brand-700">资料库</p>
        <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">知识图解</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
          按主题、角色与标签查看业务关系、界面状态和处理流程。
        </p>
      </section>
      <Suspense fallback={<p role="status" className="py-8 text-sm text-muted">正在读取图解…</p>}>
        <ArticleLibrary articles={articles} />
      </Suspense>
    </div>
  )
}
