import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BriefcaseBusiness } from "lucide-react"
import { caseItems } from "@/data/cases"
import { Badge } from "@/components/common/Badge"
import { absoluteUrl } from "@/lib/seo"
import { appendAssetVersion } from "@/lib/assetVersion"
import { assetPath } from "@/lib/assets"

const versionedCases = caseItems.map((item) => ({
  ...item,
  coverSrc: item.coverSrc ? appendAssetVersion(item.coverSrc) : item.coverSrc,
  coverSrcWebp: item.coverSrcWebp ? appendAssetVersion(item.coverSrcWebp) : item.coverSrcWebp,
  coverSrcAvif: item.coverSrcAvif ? appendAssetVersion(item.coverSrcAvif) : item.coverSrcAvif,
}))

export const metadata = {
  title: "案例模块",
  description: "沉淀包网官网、竞品分析和优化方案类案例资料。",
  alternates: {
    canonical: absoluteUrl("/cases"),
  },
}

export default function CasesPage() {
  return (
    <div className="container-shell py-12">
      <section className="rounded-lg border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="mb-2 text-sm font-semibold text-brand-700">Cases</p>
        <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">案例模块</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-muted">这里集中放官网案例、页面拆解、竞品分析和后续信息图资料，方便按案例查阅和复用。</p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {versionedCases.map((item) => (
          <Link key={item.slug} href={item.href} className="group overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:border-brand-100 hover:shadow-soft">
            {item.coverSrc ? (
              <div className="aspect-[16/9] overflow-hidden bg-paper">
                <picture className="block h-full w-full">
                  {item.coverSrcAvif ? <source srcSet={assetPath(item.coverSrcAvif)} type="image/avif" /> : null}
                  {item.coverSrcWebp ? <source srcSet={assetPath(item.coverSrcWebp)} type="image/webp" /> : null}
                  <Image
                    src={assetPath(item.coverSrc)}
                    alt={item.coverAlt ?? item.title}
                    width={item.coverWidth ?? 1600}
                    height={item.coverHeight ?? 900}
                    sizes="(min-width: 768px) 520px, calc(100vw - 2rem)"
                    className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                </picture>
              </div>
            ) : null}
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className={["rounded-md px-2.5 py-1 text-xs font-medium", item.status === "已接入" ? "bg-brand-50 text-brand-700" : "bg-paper text-muted"].join(" ")}>{item.status}</span>
              </div>
              <h2 className="mt-5 text-lg font-semibold text-ink">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            <p className="mt-2 text-xs text-muted">
              学习目标：{item.learningGoal ?? "通过案例复盘理解对应页面结构与执行要点。"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{item.difficulty ?? "入门"}</Badge>
              <Badge tone="brand">建议：{item.estimatedMinutes ?? 15} 分钟</Badge>
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-paper px-2.5 py-1 text-xs font-medium text-muted">
                  {tag}
                </span>
              ))}
            </div>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 group-hover:underline">
                查看案例
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
