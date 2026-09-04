import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Images,
  LayoutGrid,
  Library,
  Search,
  ShieldCheck,
  Sparkle,
  Sparkles,
} from "lucide-react"
import { articles } from "@/data/articles"
import { caseItems } from "@/data/cases"
import { glossary } from "@/data/glossary"
import { imagePrompts } from "@/data/imagePrompts"
import { templates } from "@/data/templates"
import { learningPaths } from "@/data/topicGuides"
import { Badge } from "@/components/common/Badge"

const resourceEntries = [
  {
    title: "文章资料",
    description: "按栏目、标签和难度查资料。",
    href: "/articles",
    icon: FileText,
  },
  {
    title: "术语库",
    description: "快速查概念、状态和业务口径。",
    href: "/glossary",
    icon: BookOpen,
  },
  {
    title: "模板库",
    description: "需求表、PRD、检查清单与复盘资料。",
    href: "/templates",
    icon: Library,
  },
  {
    title: "案例模块",
    description: "官网、后台优化和竞品资料。",
    href: "/cases",
    icon: BriefcaseBusiness,
  },
  {
    title: "信息图",
    description: "用长图理解复杂模块。",
    href: "/articles/admin-modules",
    icon: Images,
  },
]

const focusItems = [
  {
    label: "结构理解",
    value: "平台、钱包、后台、代理和接口",
    icon: Sparkles,
  },
  {
    label: "项目资料",
    value: "需求表、PRD、上线检查和复盘",
    icon: BookOpen,
  },
  {
    label: "运营模型",
    value: "运营是流量，产品是载体，数据负责复盘",
    icon: ShieldCheck,
  },
]

const quickPaths = [
  {
    title: "新手起步",
    href: "/industry",
    subtitle: "先读行业与基础框架",
    icon: BookOpen,
  },
  {
    title: "结构展开",
    href: "/product",
    subtitle: "再看功能模块与产品关系",
    icon: LayoutGrid,
  },
  {
    title: "交付复盘",
    href: "/devops-risk",
    subtitle: "最后做上线与风险复盘",
    icon: Sparkle,
  },
]

export function HeroSection() {
  const heroVisual = imagePrompts.find((image) => image.slug === "white-label-structure") ?? imagePrompts[0]
  const visualThumbnails = imagePrompts.filter((image) => image.kind === "long-infographic").slice(0, 3)
  const learningCards = learningPaths.map((path) => ({
    ...path,
    difficulty: path.difficulty ?? "入门",
    audience: path.audience ?? [],
    articleTitles: path.articleSlugs
      .map((slug) => articles.find((article) => article.slug === slug))
      .filter((article): article is (typeof articles)[number] => Boolean(article))
      .map((article) => article.title),
    articleCount: path.articleSlugs.length,
  }))
  const stats = [
    { label: "文章", value: articles.length },
    { label: "术语", value: glossary.length },
    { label: "模板", value: templates.length },
    { label: "案例", value: caseItems.length },
  ]

  return (
    <section className="container-shell py-8 md:py-12">
      <div className="mb-5 rounded-lg border border-line bg-white p-4 shadow-sm md:hidden">
        <p className="text-sm font-semibold text-ink">知识库总览</p>
        <p className="mt-1 text-xs leading-6 text-muted">按阶段学习：从基础认知到结构搭建，再到交付复盘。</p>
        <div className="mt-3 grid gap-2">
          {quickPaths.map((path) => {
            const Icon = path.icon
            return (
              <Link
                key={path.title}
                href={path.href}
                className="grid grid-cols-[1.75rem_1fr] items-start gap-2 rounded-md border border-line bg-paper p-3 transition hover:border-brand-100 hover:bg-white"
              >
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-white text-brand-700 ring-1 ring-line">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{path.title}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted">{path.subtitle}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
        <div className="rounded-lg border border-line bg-white p-5 shadow-sm md:p-8">
          <p className="inline-flex rounded-md border border-brand-100 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
            知识库学习平台
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-ink md:text-5xl">
            包网知识库
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted md:text-lg">
            把平台结构、后台模块、运营治理、接口协作和上线检查整理成可查阅、可复用的文章、术语、案例和模板，帮助产品理解运营目标如何落到真实系统里。
          </p>
          <div className="mt-6 hidden gap-3 sm:grid">
            {focusItems.map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="rounded-lg border border-line bg-paper p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-brand-700 ring-1 ring-line">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {item.label}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.value}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-line bg-white px-4 py-3">
                <div className="text-2xl font-semibold text-ink">{stat.value}</div>
                <div className="mt-1 text-xs text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/articles" className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              浏览资料库
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/search" className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:border-brand-100 hover:text-brand-700">
              <Search className="h-4 w-4" aria-hidden="true" />
              全站搜索
            </Link>
          </div>
        </div>

        <div className="grid gap-5">
          <section className="rounded-lg border border-line bg-white p-4 shadow-sm md:p-5" aria-labelledby="home-resource-title">
            <div className="flex items-center justify-between gap-4">
              <h2 id="home-resource-title" className="text-base font-semibold text-ink">
                资料入口（知识库目录）
              </h2>
              <Link href="/articles" className="text-sm font-medium text-brand-700 hover:text-ink">
                全部资料
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {resourceEntries.map((entry) => {
                const Icon = entry.icon

                return (
                  <Link
                    key={entry.title}
                    href={entry.href}
                    className="group rounded-md border border-line bg-paper p-4 transition hover:border-brand-100 hover:bg-white"
                  >
                    <Icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
                    <div className="mt-3 text-sm font-semibold text-ink">{entry.title}</div>
                    <p className="mt-1 text-xs leading-5 text-muted">{entry.description}</p>
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-line bg-white shadow-sm" aria-labelledby="home-visual-title">
            <div className="grid md:grid-cols-[1fr_0.72fr]">
              {heroVisual ? (
                <Link href={`/articles/${heroVisual.articleSlug}`} className="group block bg-paper">
                  <div className="flex h-64 items-center justify-center md:h-full md:min-h-72">
                    <picture className="block h-full w-full">
                      {heroVisual.imageSrcAvif ? <source srcSet={heroVisual.imageSrcAvif} type="image/avif" /> : null}
                      {heroVisual.imageSrcWebp ? <source srcSet={heroVisual.imageSrcWebp} type="image/webp" /> : null}
                    <Image
                        src={heroVisual.imageSrc}
                        alt={heroVisual.title}
                        width={heroVisual.width ?? 1672}
                        height={heroVisual.height ?? 941}
                        priority
                        loading="eager"
                        sizes="(min-width: 1024px) 430px, calc(100vw - 2rem)"
                        className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.01]"
                      />
                    </picture>
                  </div>
                </Link>
              ) : null}
              <div className="border-t border-line p-4 md:border-l md:border-t-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
                  <Images className="h-4 w-4" aria-hidden="true" />
                  <span id="home-visual-title">信息图精选</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold leading-7 text-ink">用图先看懂复杂系统</h2>
                <p className="mt-2 text-sm leading-6 text-muted">把模块、流程、权限和检查点压缩成更容易复盘的图解资料。</p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {visualThumbnails.map((image) => (
                    <Link key={image.slug} href={`/articles/${image.articleSlug}`} className="relative aspect-[3/4] overflow-hidden rounded-md bg-paper ring-1 ring-line">
                      <picture className="block h-full w-full">
                        {image.imageSrcAvif ? <source srcSet={image.imageSrcAvif} type="image/avif" /> : null}
                        {image.imageSrcWebp ? <source srcSet={image.imageSrcWebp} type="image/webp" /> : null}
                        <Image
                          src={image.imageSrc}
                          alt={image.title}
                          width={image.width ?? 864}
                          height={image.height ?? 1821}
                          sizes="96px"
                          className="h-full w-full object-cover object-top"
                          loading="lazy"
                        />
                      </picture>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section id="home-path-title" className="mt-5 rounded-lg border border-line bg-white p-4 shadow-sm md:p-5" aria-label="推荐阅读路径">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">
              课程化阅读路径
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              以阶段为入口构建栏目结构：先建立认知，再梳理结构，最后形成交付与复盘闭环。
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {learningCards.map((step, index) => (
              <Link
                key={step.title}
                href={step.href}
                aria-label={`${step.title} 课程入口`}
                className="group min-h-[158px] grid min-w-0 grid-cols-[2.25rem_1fr] gap-3 rounded-md border border-line bg-paper p-3 transition hover:border-brand-100 hover:bg-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-xs font-semibold text-brand-700 ring-1 ring-line">0{index + 1}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{step.title}</span>
                  <span className="mt-1 block line-clamp-2 text-xs leading-5 text-muted">{step.description}</span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone="brand">难度：{step.difficulty}</Badge>
                    <Badge tone="blue">{step.audience.length > 0 ? step.audience.slice(0, 2).join("、") : "通用人群"}</Badge>
                  </div>
                  <span className="mt-2 block text-xs text-muted">
                    覆盖文章：{step.articleCount > 0 ? `${step.articleTitles.length} 篇` : "持续补充中"}
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    核心文章：{step.articleTitles.length > 0 ? step.articleTitles.slice(0, 2).join(" · ") : "持续补充中"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </section>
  )
}
