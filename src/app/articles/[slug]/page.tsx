import { notFound } from "next/navigation"
import Image from "next/image"
import { Children, isValidElement, type ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArticleHero } from "@/components/article/ArticleHero"
import { ArticleJsonLd } from "@/components/article/ArticleJsonLd"
import { ArticlePager } from "@/components/article/ArticlePager"
import { ArticleRelatedTerms } from "@/components/article/ArticleRelatedTerms"
import { ArticleToc } from "@/components/article/ArticleToc"
import { MermaidDiagram } from "@/components/article/MermaidDiagram"
import { NextReadSuggestion } from "@/components/article/NextReadSuggestion"
import { ReadingProgress } from "@/components/article/ReadingProgress"
import { RelatedArticles } from "@/components/article/RelatedArticles"
import { TermLinker } from "@/components/article/TermLinker"
import { LearningCheck } from "@/components/common/LearningCheck"
import { articles } from "@/data/articles"
import { imagePrompts } from "@/data/imagePrompts"
import { articleLearningChecks } from "@/data/learningChecks"
import { getMarkdownArticle, slugifyHeading } from "@/lib/articles"
import { getTermsForArticle } from "@/lib/relations"
import { absoluteUrl } from "@/lib/seo"

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

function MarkdownImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null

  const imagePrompt = imagePrompts.find((item) => item.imageSrc === src || item.imageSrcWebp === src || item.imageSrcAvif === src)
  const caption = alt || imagePrompt?.title

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <picture className="block">
        {imagePrompt?.imageSrcAvif ? <source srcSet={imagePrompt.imageSrcAvif} type="image/avif" /> : null}
        {imagePrompt?.imageSrcWebp ? <source srcSet={imagePrompt.imageSrcWebp} type="image/webp" /> : null}
        <Image
          src={src}
          alt={caption ?? ""}
          width={imagePrompt?.width ?? 1600}
          height={imagePrompt?.height ?? 900}
          sizes="(min-width: 1024px) 768px, calc(100vw - 2rem)"
          loading="lazy"
          className="h-auto w-full object-contain"
        />
      </picture>
      {caption ? <figcaption className="border-t border-line bg-paper px-4 py-3 text-sm font-medium text-ink">{caption}</figcaption> : null}
    </figure>
  )
}

function isImageOnlyParagraph(children: ReactNode) {
  const childArray = Children.toArray(children)
  return childArray.length === 1 && isValidElement(childArray[0]) && childArray[0].type === MarkdownImage
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

  const articleIndex = articles.findIndex((item) => item.slug === article.slug)
  const articleData = articles.find((item) => item.slug === article.slug)
  const previousArticle = articleIndex > 0 ? articles[articleIndex - 1] : undefined
  const nextArticle = articleIndex >= 0 && articleIndex < articles.length - 1 ? articles[articleIndex + 1] : undefined
  const relatedTerms = articleData ? getTermsForArticle(articleData) : []

  return (
    <>
      {articleData ? <ArticleJsonLd article={articleData} /> : null}
      <ReadingProgress />
      <ArticleHero {...article.meta} />
      <div className="container-shell grid max-w-6xl gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <article className="article-body prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-normal prose-p:leading-8 prose-li:leading-8 prose-a:text-brand-700 prose-code:rounded prose-code:bg-paper prose-code:px-1 prose-code:py-0.5 prose-code:text-ink">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => <MarkdownImage src={typeof src === "string" ? src : undefined} alt={alt} />,
              h2: ({ children }) => {
                const text = String(children)
                return <h2 id={slugifyHeading(text)}>{children}</h2>
              },
              h3: ({ children }) => {
                const text = String(children)
                return <h3 id={slugifyHeading(text)}>{children}</h3>
              },
              p: ({ children }) => (
                isImageOnlyParagraph(children) ? (
                  <>{children}</>
                ) : (
                  <p>
                    <TermLinker>{children}</TermLinker>
                  </p>
                )
              ),
              li: ({ children }) => (
                <li>
                  <TermLinker>{children}</TermLinker>
                </li>
              ),
              td: ({ children }) => (
                <td>
                  <TermLinker>{children}</TermLinker>
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
      <div className="container-shell max-w-6xl pb-10">
        <LearningCheck check={articleLearningChecks[article.slug]} />
      </div>
      <ArticleRelatedTerms terms={relatedTerms} />
      <NextReadSuggestion article={nextArticle} />
      <ArticlePager previous={previousArticle} next={nextArticle} />
      <RelatedArticles category={article.meta.category} currentSlug={article.slug} tags={article.meta.tags} />
    </>
  )
}
