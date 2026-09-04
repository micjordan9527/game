import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { articles } from "@/data/articles"
import { learningPaths } from "@/data/topicGuides"

export function LearningGuide() {
  const tracks = learningPaths.map((path) => {
    const articleSamples = path.articleSlugs
      .map((slug) => articles.find((article) => article.slug === slug)?.title)
      .filter(Boolean)
      .slice(0, 2)
      .join(" · ")

    return {
      title: path.title,
      description: path.description,
      difficulty: path.difficulty,
      audience: path.audience.join(" / "),
      articleSamples: articleSamples || "持续补充中",
      href: path.href,
      count: path.articleSlugs.length,
    }
  })

  return (
    <section className="container-shell py-12">
      <SectionHeader eyebrow="课程化入口" title="从 0 到可交付：按路线系统学习" description="每条路径都给出学习目标、时长建议和完成动作，适合先做理解再做复用。" />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tracks.map((track, index) => (
          <article key={track.href} className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-sm font-semibold text-brand-700">0{index + 1}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-muted">{track.difficulty}</span>
              <span className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-muted">约 {track.count} 篇</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">{track.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{track.description}</p>
            <p className="mt-3 text-xs text-muted">核心读者：{track.audience}</p>
            <p className="mt-2 text-xs text-muted">先学内容：{track.articleSamples}</p>
            <Link
              href={track.href}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              进入路线
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-between rounded-lg border border-line bg-paper p-5 sm:items-center sm:flex-row sm:gap-0 gap-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-brand-700" aria-hidden="true" />
          <p className="text-sm text-muted">学习建议：先做一条路径，完成后再切到下一条，效果会更稳定。</p>
        </div>
        <Link href="/articles" className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-ink hover:text-brand-700">
          查看全部文章
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
