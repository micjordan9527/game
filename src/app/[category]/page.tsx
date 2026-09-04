import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/data/articles"
import { ArticleCard } from "@/components/common/ArticleCard"
import { Badge } from "@/components/common/Badge"
import { LearningCheck } from "@/components/common/LearningCheck"
import { MiniTermCard } from "@/components/common/MiniTermCard"
import { SectionHeader } from "@/components/common/SectionHeader"
import { categories } from "@/data/categories"
import { glossary } from "@/data/glossary"
import { templates } from "@/data/templates"
import { TemplateCard } from "@/components/templates/TemplateCard"
import { SportsbookKnowledgeHub } from "@/components/sports/SportsbookKnowledgeHub"
import { getCategoryVisual, type CategoryVisual } from "@/data/categoryVisuals"
import { CoursePathSection } from "@/components/category/CoursePathSection"
import { categoryLearningChecks } from "@/data/learningChecks"
import { getTopicGuide } from "@/data/topicGuides"
import { getArticle, getArticlesByCategory, getCategory } from "@/lib/site"
import { absoluteUrl } from "@/lib/seo"

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params
  const category = getCategory(categorySlug)

  if (!category) return {}

  return {
    title: category.title,
    description: category.description,
    alternates: {
      canonical: absoluteUrl(`/${category.slug}`),
    },
    openGraph: {
      title: `${category.title} | 包网知识库`,
      description: category.description,
      url: absoluteUrl(`/${category.slug}`),
      type: "website",
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params
  const category = getCategory(categorySlug)

  if (!category) notFound()

  const categoryArticles = getArticlesByCategory(categorySlug)
  const guide = getTopicGuide(categorySlug)
  const orderedArticles = guide?.readingOrder.map((slug) => getArticle(slug)).filter(Boolean) ?? []
  const terms = guide?.termIds.map((id) => glossary.find((term) => term.id === id)).filter(Boolean) ?? []
  const relatedTemplates = guide?.templateSlugs.map((slug) => templates.find((template) => template.slug === slug)).filter(Boolean) ?? []
  const categoryVisual = getCategoryVisual(categorySlug)
  const courseModules = (guide?.modules ?? [])
    .map((module, index) => ({
      ...module,
      id: module.id ?? `${categorySlug}-module-${index + 1}`,
      learningObjectives: module.learningObjectives ?? ["先看完本模块文章，梳理核心概念"],
      estimatedMinutes: module.estimatedMinutes ?? 15,
      durationReason: module.durationReason ?? "根据模块内文章阅读密度与实践要点估算。",
      difficulty: module.difficulty ?? "入门",
      audienceHints: module.audienceHints ?? (guide?.audience ?? ["通用人群"]),
      articles: module.articles
        .map((slug) => getArticle(slug))
        .filter((article): article is Article => Boolean(article)),
    }))
    .filter((module) => module.articles.length > 0)

  return (
    <div className="container-shell py-12">
      <section className="grid gap-6 rounded-xl border border-line bg-white p-6 shadow-sm md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div>
          <SectionHeader eyebrow="知识栏目" title={category.title} description={category.description} />
          {guide ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {guide.audience.map((item) => (
                <Badge key={item} tone="brand">
                  {item}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        {guide ? (
          <div className="rounded-lg bg-paper p-5">
            <div className="text-sm font-semibold text-ink">读完你会理解</div>
            <ul className="mt-3 space-y-3 text-sm leading-7 text-muted">
              {guide.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <div className="mt-8">
        <LearningCheck check={categoryLearningChecks[categorySlug]} />
      </div>

      {categorySlug === "operation" ? <OperationModelSection /> : null}
      {categorySlug === "sportsbook" ? <SportsbookKnowledgeHub /> : null}

      {categoryVisual ? <CategoryVisualSection visual={categoryVisual} /> : null}

      {courseModules.length > 0 ? (
        <CoursePathSection
          categorySlug={categorySlug}
          modules={courseModules}
          guideAudience={guide?.audience ?? []}
          guideDifficulty={guide?.modules?.length ? guide.modules[0]?.difficulty : "入门"}
        />
      ) : orderedArticles.length > 0 ? (
        <section className="py-12">
          <SectionHeader title="推荐阅读顺序" description="按这个顺序阅读，可以先建立全局概念，再进入具体模块和执行细节。" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {orderedArticles.map((article, index) =>
              article ? (
                <Link key={article.slug} href={`/articles/${article.slug}`} className="rounded-lg border border-line bg-white p-5 shadow-sm hover:border-brand-100 hover:shadow-soft">
                  <div className="text-sm font-semibold text-brand-700">0{index + 1}</div>
                  <h3 className="mt-3 text-lg font-semibold leading-7 text-ink">{article.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted">{article.description}</p>
                </Link>
              ) : null
            )}
          </div>
        </section>
      ) : null}

      <section className="py-12">
        <SectionHeader title="栏目文章" description="围绕这个主题整理的文章列表，适合按需查询和补充阅读。" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        {categoryArticles.length === 0 ? (
          <div className="mt-8 rounded-lg border border-line bg-white p-8 text-sm leading-7 text-muted">
            这个栏目正在整理文章。第一阶段先保留栏目入口，后续可以继续补充专题内容。
          </div>
        ) : null}
      </section>

      {(terms.length > 0 || relatedTemplates.length > 0) && (
        <section className="grid gap-8 py-12 lg:grid-cols-[1fr_0.9fr]">
          {terms.length > 0 ? (
            <div>
              <SectionHeader title="关键术语" description="先看懂这些概念，再读栏目文章会更顺。" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {terms.map((term) => (term ? <MiniTermCard key={term.id} term={term} /> : null))}
              </div>
            </div>
          ) : null}
          {relatedTemplates.length > 0 ? (
            <div>
              <SectionHeader title="相关模板" description="把栏目知识沉淀成可复用的项目资料。" />
              <div className="mt-6 grid gap-4">
                {relatedTemplates.map((template) => (template ? <TemplateCard key={template.slug} template={template} /> : null))}
              </div>
            </div>
          ) : null}
        </section>
      )}
    </div>
  )
}

function OperationModelSection() {
  const modelItems = [
    {
      title: "运营是流量",
      description: "渠道、内容、社群、合作和服务反馈，决定用户从哪里来、带着什么需求进入。",
    },
    {
      title: "产品是载体",
      description: "官网、H5、App、活动页、客服入口、后台工具和内容资料，负责承接用户需求。",
    },
    {
      title: "转化是路径",
      description: "转化不是一句口号，而是用户是否看懂、走通、提交、反馈并留下可复盘记录。",
    },
    {
      title: "复盘是改进",
      description: "数据、日志、客服问题和异常记录要回到产品结构里，持续修正页面、规则和流程。",
    },
  ]

  return (
    <section className="py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-brand-700">运营方法论</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal text-ink md:text-3xl">运营（流量）+ 产品（载体）= 业务转化</h2>
            <p className="mt-4 text-base leading-8 text-muted">
              产品开发如果只看功能，很容易停留在“把东西做出来”。先理解运营为什么这样做，再设计承接载体、用户路径、数据口径和复盘方式，产品才更贴近真实目标。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {modelItems.map((item, index) => (
              <div key={item.title} className="rounded-lg border border-line bg-paper p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-xs font-semibold text-brand-700 ring-1 ring-line">{String(index + 1).padStart(2, "0")}</span>
                  <div className="text-sm font-semibold text-ink">{item.title}</div>
                </div>
                <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryVisualSection({ visual }: { visual: CategoryVisual }) {
  return (
    <section className="py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
        <div>
          <SectionHeader eyebrow="专题图解" title={visual.title} description={visual.description} />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {visual.pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-lg border border-line bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-ink">{pillar.title}</div>
                <p className="mt-2 text-sm leading-7 text-muted">{pillar.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-ink">治理流转</div>
            <div className="mt-4 grid gap-4">
              {visual.workflow.map((item, index) => (
                <div key={item.title} className="grid gap-3 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-sm font-semibold text-brand-700">{String(index + 1).padStart(2, "0")}</div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{item.title}</div>
                    <p className="mt-1 text-sm leading-7 text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold text-ink">可沉淀资料</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {visual.deliverables.map((item) => (
                <Badge key={item} tone="blue">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <figure className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
          <div className="max-h-[820px] overflow-y-auto bg-paper">
            <picture className="block">
              {visual.imageSrcAvif ? <source srcSet={visual.imageSrcAvif} type="image/avif" /> : null}
              {visual.imageSrcWebp ? <source srcSet={visual.imageSrcWebp} type="image/webp" /> : null}
                <Image
                  src={visual.imageSrc}
                  alt={visual.title}
                  width={visual.width}
                  height={visual.height}
                  sizes="(min-width: 1024px) 560px, calc(100vw - 2rem)"
                  loading="lazy"
                  className="h-auto w-full object-contain"
                />
            </picture>
          </div>
          <figcaption className="border-t border-line bg-white px-4 py-3 text-sm font-medium text-ink">{visual.title}</figcaption>
        </figure>
      </div>
    </section>
  )
}
