import type { Metadata } from "next"
import { ArticleLibrary } from "@/components/articles/ArticleLibrary"
import { articles } from "@/data/articles"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "功能图解",
  description: "查看产品、运营、设计与技术的功能图解。",
  alternates: {
    canonical: absoluteUrl("/articles"),
  },
  openGraph: {
    title: "功能图解 | 包网知识库",
    description: "查看产品、运营、设计与技术的功能图解。",
    url: absoluteUrl("/articles"),
    type: "website",
  },
}

export default function ArticlesPage() {
  return (
    <div className="container-shell py-10 md:py-12">
      <section className="mb-8 rounded-lg border border-line bg-white p-5 shadow-sm md:p-8">
        <p className="mb-2 text-sm font-semibold text-brand-700">资料库</p>
        <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">功能图解</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
          用关系图、流程图和界面对照，快速看懂业务与功能。
        </p>
      </section>
      <ArticleLibrary articles={articles} />
    </div>
  )
}
