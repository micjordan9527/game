import type { Metadata } from "next"
import { ArticleLibrary } from "@/components/articles/ArticleLibrary"
import { articles } from "@/data/articles"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "文章资料库",
  description: "按标签和难度筛选包网知识库的文章资料。",
  alternates: {
    canonical: absoluteUrl("/articles"),
  },
  openGraph: {
    title: "文章资料库 | 包网知识库",
    description: "按标签和难度筛选包网知识库的文章资料。",
    url: absoluteUrl("/articles"),
    type: "website",
  },
}

export default function ArticlesPage() {
  return (
    <main className="container-shell py-10 md:py-12">
      <section className="mb-8 rounded-lg border border-line bg-white p-5 shadow-sm md:p-8">
        <p className="mb-2 text-sm font-semibold text-brand-700">资料库</p>
        <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">文章资料库</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
          把行业、产品、运营、技术和风控内容集中到一个可筛选入口，适合按主题查阅，也适合补齐阅读路径。
        </p>
      </section>
      <ArticleLibrary articles={articles} />
    </main>
  )
}
