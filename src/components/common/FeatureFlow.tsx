import { ArrowDown, ArrowRight } from "lucide-react"

export type FlowStep = { title: string; text: string }

export function FeatureFlow({ title, steps, caption }: { title: string; steps: FlowStep[]; caption?: string }) {
  return (
    <section className="my-6 overflow-hidden rounded-xl border border-brand-100 bg-white" aria-label={title}>
      <div className="border-b border-line bg-brand-50/60 px-5 py-4">
        <h2 className="font-semibold text-ink">{title}</h2>
        {caption ? <p className="mt-1 text-xs leading-6 text-muted">{caption}</p> : null}
      </div>
      <ol className="grid gap-3 p-5 md:auto-cols-fr md:grid-flow-col">
        {steps.map((step, index) => (
          <li key={step.title} className="relative min-w-0">
            <div className="h-full rounded-lg bg-paper p-4 md:mr-4">
              <span className="text-xs font-semibold text-brand-700">0{index + 1}</span>
              <h3 className="mt-2 font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.text}</p>
            </div>
            {index < steps.length - 1 ? (
              <>
                <ArrowRight
                  className="absolute -right-1 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-brand-700 md:block"
                  aria-hidden="true"
                />
                <ArrowDown className="mx-auto mt-2 h-4 w-4 text-brand-700 md:hidden" aria-hidden="true" />
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
