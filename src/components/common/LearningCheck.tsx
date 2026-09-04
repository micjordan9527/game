import { ClipboardCheck } from "lucide-react"
import type { LearningCheck as LearningCheckData } from "@/data/learningChecks"

type LearningCheckProps = {
  check?: LearningCheckData
  title?: string
}

export function LearningCheck({ check, title = "理解检查" }: LearningCheckProps) {
  if (!check) return null

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
          <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-brand-700">{title}</p>
          {check.scenario ? <p className="mt-2 text-sm leading-7 text-muted">{check.scenario}</p> : null}
        </div>
      </div>
      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {check.questions.map((question, index) => (
          <li key={question} className="grid gap-3 rounded-md border border-line bg-paper p-4 sm:grid-cols-[2rem_1fr]">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-xs font-semibold text-brand-700 ring-1 ring-line">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-sm leading-7 text-ink">{question}</span>
          </li>
        ))}
      </ol>
      {check.referenceIdeas?.length ? (
        <details className="mt-5 rounded-md border border-brand-100 bg-brand-50 px-4 py-3">
          <summary className="cursor-pointer text-sm font-semibold text-brand-700">参考思路</summary>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
            {check.referenceIdeas.map((idea) => (
              <li key={idea} className="flex gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                <span>{idea}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  )
}
