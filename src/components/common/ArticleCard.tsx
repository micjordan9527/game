import Link from "next/link"
import type { Article } from "@/data/articles"
import { getImagePromptsForArticle } from "@/data/imagePrompts"
import { articleFlows } from "@/data/articleFlows"
import { assetPath } from "@/lib/assets"
export function ArticleCard({ article }: { article: Article }) {
  const image = getImagePromptsForArticle(article.slug)[0]
  const flow = articleFlows[article.slug]
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-line bg-white transition hover:border-brand-200 hover:shadow-soft">
      <Link href={`/articles/${article.slug}`} className="block">
        {image ? (
          <div className="aspect-[16/10] overflow-hidden bg-paper">
            <img
              src={assetPath(image.imageSrcAvif ?? image.imageSrcWebp ?? image.imageSrc)}
              alt={image.title}
              width={image.width ?? 1600}
              height={image.height ?? 900}
              loading="lazy"
              className="h-full w-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/10] items-center bg-brand-50/60 p-5">
            <div className="w-full">
              <p className="text-xs font-semibold text-brand-700">功能图解</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {(flow?.steps ?? []).map((step) => (
                  <span
                    key={step.title}
                    className="rounded-lg border border-brand-100 bg-white px-3 py-2 text-sm font-semibold text-ink"
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="p-5">
          <h3 className="text-lg font-semibold leading-7 text-ink">{article.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">{article.description}</p>
          <span className="mt-3 inline-block text-sm font-semibold text-brand-700">查看图解 →</span>
        </div>
      </Link>
    </article>
  )
}
