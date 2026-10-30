import Link from "next/link"
import type { Article } from "@/data/articles"
import { getImagePromptsForArticle } from "@/data/imagePrompts"
import { articleFlows } from "@/data/articleFlows"
import { assetPath } from "@/lib/assets"
import { practiceArticleGuides } from "@/data/practiceArticleGuides"
export function ArticleCard({ article, href, stepLabel }: { article: Article; href?: string; stepLabel?: string }) {
  const image = getImagePromptsForArticle(article.slug)[0]
  const flow = articleFlows[article.slug]
  const cover = article.cover ?? image?.imageSrcAvif ?? image?.imageSrcWebp ?? image?.imageSrc
  const isMachineGuide = article.slug === "electronic-gaming-machine"
  const isTgGuide = article.slug === "tg-message-media"
  const practiceGuide = practiceArticleGuides[article.slug as keyof typeof practiceArticleGuides]
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-line bg-white transition hover:border-brand-200 hover:shadow-soft">
      <Link href={href ?? `/articles/${article.slug}`} className="block">
        {cover ? (
          <div className="aspect-[16/10] overflow-hidden bg-paper">
            <img
              src={assetPath(cover)}
              alt={article.cover ? article.title : image?.title ?? article.title}
              width={article.cover ? 1600 : image?.width ?? 1600}
              height={article.cover ? 1000 : image?.height ?? 900}
              loading="lazy"
              className="h-full w-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/10] items-center bg-brand-50/60 p-5">
            <div className="w-full">
              <p className="text-xs font-semibold text-brand-700">知识图解</p>
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
          {stepLabel ? <p className="mb-3 text-xs font-semibold text-brand-700">{stepLabel}</p> : null}
          {isMachineGuide ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">可交互</span>
              <span className="text-muted">7组部件 · 8步工作过程</span>
            </div>
          ) : null}
          {isTgGuide ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">视频示例</span>
              <span className="text-muted">约9秒 · 视频替换预览</span>
            </div>
          ) : null}
          {practiceGuide ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">{practiceGuide.label}</span>
              <span className="text-muted">{practiceGuide.hint}</span>
            </div>
          ) : null}
          <h3 className="text-lg font-semibold leading-7 text-ink">{article.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">{article.description}</p>
          <span className="mt-3 inline-block text-sm font-semibold text-brand-700">{isMachineGuide || practiceGuide ? "打开交互图解 →" : isTgGuide ? "查看推送示例 →" : "查看图解 →"}</span>
        </div>
      </Link>
    </article>
  )
}
