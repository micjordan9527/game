import Link from "next/link"
import { knowledgeTopics } from "@/data/knowledgeTopics"
import { resourcesForTopic } from "@/lib/knowledge-relations"

export function TopicResourcePaths() {
  return (
    <section className="py-10" aria-labelledby="topic-resources-title">
      <h2 id="topic-resources-title" className="text-2xl font-semibold text-ink">按业务主题查资料</h2>
      <p className="mt-3 text-sm leading-7 text-muted">从概念解释开始，继续查看相关案例、需求模板和设计工作流。</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {knowledgeTopics.map((topic) => (
          <article key={topic.slug} id={`topic-${topic.slug}`} className="scroll-mt-24 rounded-xl border border-line bg-white p-5 md:p-6">
            <h3 className="text-lg font-semibold text-ink">{topic.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{topic.description}</p>
            <ul className="mt-4 space-y-2">
              {resourcesForTopic(topic).map((resource) => (
                <li key={resource.href}>
                  <Link href={resource.href} className="flex items-start gap-3 rounded-md p-2 text-sm leading-6 hover:bg-brand-50">
                    <span className="shrink-0 rounded bg-paper px-2 text-xs leading-6 text-brand-700">{resource.kind}</span>
                    <span className="min-w-0 text-ink">{resource.title} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
