import { BulkActionDemo } from "@/components/enrichment/BulkActionDemo"
import { ExportTaskDemo } from "@/components/enrichment/ExportTaskDemo"
import { AdminListDemo } from "@/components/enrichment/AdminListDemo"
import { FormFeedbackDemo } from "@/components/enrichment/FormFeedbackDemo"
import { ScenarioExplorer } from "@/components/enrichment/ScenarioExplorer"
import { ReconciliationCase } from "@/components/enrichment/ReconciliationCase"
import { AccountRecoveryCase } from "@/components/enrichment/AccountRecoveryCase"
import { LinkedCaseExplorer } from "@/components/enrichment/LinkedCaseExplorer"
import { settlementCase, withdrawalCase } from "@/data/businessCases"
import { topicScenarios } from "@/data/topicScenarios"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Children, isValidElement, type ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArticleHero } from "@/components/article/ArticleHero"
import { ArticleVisualBrief } from "@/components/article/ArticleVisualBrief"
import { FeatureFlow } from "@/components/common/FeatureFlow"
import { articleFlows } from "@/data/articleFlows"
import { getImagePromptsForArticle } from "@/data/imagePrompts"
import { resourceAudiences } from "@/lib/work-audiences"
import { ArticleJsonLd } from "@/components/article/ArticleJsonLd"
import { ArticlePager } from "@/components/article/ArticlePager"
import { ArticleRelatedTerms } from "@/components/article/ArticleRelatedTerms"
import { ArticleToc } from "@/components/article/ArticleToc"
import { MermaidDiagram } from "@/components/article/MermaidDiagram"
import { ReadingProgress } from "@/components/article/ReadingProgress"
import { RelatedArticles } from "@/components/article/RelatedArticles"
import { TermLinker } from "@/components/article/TermLinker"
import { articles } from "@/data/articles"
import { imagePrompts } from "@/data/imagePrompts"
import { getMarkdownArticle, slugifyHeading } from "@/lib/articles"
import { assetPath } from "@/lib/assets"
import { getTermsForArticle } from "@/lib/relations"
import { absoluteUrl } from "@/lib/seo"
import { getArticleReadingNavigation } from "@/lib/reading-order"
import { resourcesForArticle } from "@/lib/knowledge-relations"
import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null

  const imagePrompt = imagePrompts.find(
    (item) => item.imageSrc === src || item.imageSrcWebp === src || item.imageSrcAvif === src
  )
  const caption = alt || imagePrompt?.title
  const imageSrc = assetPath(src)

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <picture className="block">
        {imagePrompt?.imageSrcAvif ? <source srcSet={assetPath(imagePrompt.imageSrcAvif)} type="image/avif" /> : null}
        {imagePrompt?.imageSrcWebp ? <source srcSet={assetPath(imagePrompt.imageSrcWebp)} type="image/webp" /> : null}
        <Image
          src={imageSrc}
          alt={caption ?? ""}
          width={imagePrompt?.width ?? 1600}
          height={imagePrompt?.height ?? 900}
          sizes="(min-width: 1024px) 768px, calc(100vw - 2rem)"
          loading="lazy"
          className="h-auto w-full object-contain"
        />
      </picture>
      {caption ? (
        <figcaption className="border-t border-line bg-paper px-4 py-3 text-sm font-medium text-ink">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

function isImageOnlyParagraph(children: ReactNode) {
  const childArray = Children.toArray(children)
  if (childArray.length !== 1 || !isValidElement<{ node?: { tagName?: string } }>(childArray[0])) return false
  return (
    childArray[0].type === "img" || childArray[0].type === MarkdownImage || childArray[0].props.node?.tagName === "img"
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getMarkdownArticle(slug)
  const articleData = articles.find((item) => item.slug === slug)

  if (!article) return {}

  return {
    title: article.meta.title,
    description: article.meta.description,
    alternates: {
      canonical: absoluteUrl(`/articles/${article.slug}`),
    },
    openGraph: {
      title: `${article.meta.title} | 包网知识库`,
      description: article.meta.description,
      url: absoluteUrl(`/articles/${article.slug}`),
      type: "article",
      publishedTime: articleData?.date,
      modifiedTime: articleData?.updatedAt,
      images: [absoluteUrl("/opengraph-image")],
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getMarkdownArticle(slug)

  if (!article) notFound()

  const articleData = articles.find((item) => item.slug === article.slug)
  const visuals = getImagePromptsForArticle(article.slug)
  const flow = articleFlows[article.slug]
  const navigation = articleData ? getArticleReadingNavigation(articleData) : undefined
  const excludedTermIds = article.slug === "wallet-payment-reconciliation" ? ["turnover"] : []
  const relatedTerms = articleData
    ? getTermsForArticle(articleData).filter((term) => !excludedTermIds.includes(term.id))
    : []

  return (
    <>
      {articleData ? <ArticleJsonLd article={articleData} /> : null}
      <ReadingProgress slug={article.slug} title={article.meta.title} />
      <ArticleHero {...article.meta} audience={resourceAudiences(`/articles/${slug}`, article.meta.audience)} />
      <div className="container-shell max-w-6xl pb-8">
        {visuals.length ? (
          <ArticleVisualBrief imagePrompts={visuals} />
        ) : flow ? (
          <FeatureFlow {...flow} caption="功能关系示意" />
        ) : null}
      </div>
      {slug === "admin-bulk-actions" ? <BulkActionDemo /> : null}
      {slug === "export-masking-audit" ? <ExportTaskDemo /> : null}
      {slug === "admin-filter-list-states" ? <AdminListDemo /> : null}
      {slug === "form-validation-submit-feedback" ? <FormFeedbackDemo /> : null}
      {topicScenarios[slug] ? <ScenarioExplorer scenario={topicScenarios[slug]} /> : null}
      {slug === "wallet-payment-reconciliation" ? <ReconciliationCase /> : null}
      {slug === "member-account-states" ? <AccountRecoveryCase /> : null}
      {slug === "agent-system-design" ? <LinkedCaseExplorer data={settlementCase} /> : null}
      {slug === "wallet-payment-reconciliation" ? <LinkedCaseExplorer data={withdrawalCase} /> : null}
      <details open id="article-details" className="container-shell max-w-6xl rounded-lg border-y border-line py-5">
        <summary className="cursor-pointer font-semibold text-ink">查看详细说明</summary>
        <div className="container-shell grid max-w-6xl gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <article
            id="article-content"
            className="article-body prose prose-slate min-w-0 max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-normal prose-p:leading-8 prose-li:leading-8 prose-a:text-brand-700 prose-code:rounded prose-code:bg-paper prose-code:px-1 prose-code:py-0.5 prose-code:text-ink"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) =>
                  href?.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a>,
                table: ({ children }) => (
                  <div className="my-6">
                    <p className="mb-2 text-xs text-muted sm:hidden">左右滑动查看完整表格</p>
                    <div
                      className="overflow-x-auto rounded-lg border border-line"
                      role="region"
                      aria-label="文章表格，可横向滚动"
                      tabIndex={0}
                    >
                      <table>{children}</table>
                    </div>
                  </div>
                ),
                img: ({ src, alt }) =>
                  visuals.some(
                    (image) => image.imageSrc === src || image.imageSrcWebp === src || image.imageSrcAvif === src
                  ) ? null : (
                    <MarkdownImage src={typeof src === "string" ? src : undefined} alt={alt} />
                  ),
                h1: () => null,
                h2: ({ children }) => {
                  const text = String(children)
                  return <h2 id={slugifyHeading(text)}>{children}</h2>
                },
                h3: ({ children }) => {
                  const text = String(children)
                  return <h3 id={slugifyHeading(text)}>{children}</h3>
                },
                p: ({ children }) =>
                  isImageOnlyParagraph(children) ? (
                    <>{children}</>
                  ) : (
                    <p>
                      <TermLinker excludeTermIds={excludedTermIds}>{children}</TermLinker>
                    </p>
                  ),
                li: ({ children }) => (
                  <li>
                    <TermLinker excludeTermIds={excludedTermIds}>{children}</TermLinker>
                  </li>
                ),
                td: ({ children }) => (
                  <td>
                    <TermLinker excludeTermIds={excludedTermIds}>{children}</TermLinker>
                  </td>
                ),
                code: ({ children, className }) => {
                  const match = /language-(\w+)/.exec(className ?? "")
                  const code = String(children).replace(/\n$/, "")

                  if (match?.[1] === "mermaid") {
                    return <MermaidDiagram chart={code} />
                  }

                  return <code className={className}>{children}</code>
                },
              }}
            >
              {article.content}
            </ReactMarkdown>
          </article>
          <div className="order-first lg:order-none">
            <ArticleToc headings={article.headings} readingMinutes={article.readingMinutes} />
          </div>
        </div>
      </details>
      <details className="container-shell max-w-6xl py-5">
        <summary className="cursor-pointer text-sm font-semibold text-muted">相关术语与更多图解</summary>
        <ArticleRelatedTerms terms={relatedTerms} />
        <div className="container-shell max-w-4xl">
          <KnowledgeLinks resources={resourcesForArticle(article.slug)} />
        </div>
        <RelatedArticles
          category={article.meta.category}
          currentSlug={article.slug}
          tags={article.meta.tags}
          excludeSlugs={[navigation?.previous?.slug, navigation?.next?.slug].filter((slug): slug is string =>
            Boolean(slug)
          )}
        />
      </details>
      {navigation ? <ArticlePager navigation={navigation} /> : null}
    </>
  )
}
