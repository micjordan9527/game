import { CheckCircle2 } from "lucide-react"
import type { AiWorkflowVisualKind } from "@/data/aiWorkflowLibrary"

export function WorkflowCardVisual({ kind }: { kind: AiWorkflowVisualKind }) {
  return (
    <div className="aspect-[16/10] overflow-hidden rounded-md border border-line bg-white p-3">
      <div className="flex h-full flex-col rounded-md bg-paper p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="h-2 w-16 rounded bg-brand-100" />
            <div className="mt-2 h-2 w-24 rounded bg-line" />
          </div>
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-brand-100" />
            <span className="h-2 w-2 rounded-full bg-signal-50" />
          </div>
        </div>
        <div className="min-h-0 flex-1">{renderVisual(kind, "compact")}</div>
      </div>
    </div>
  )
}

export function WorkflowStepVisual({ kind, title }: { kind: AiWorkflowVisualKind; title: string }) {
  return (
    <figure className="overflow-hidden rounded-md border border-line bg-paper">
      <div className="aspect-[16/10] bg-white p-4">
        <div className="flex h-full flex-col rounded-md border border-line bg-paper p-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase text-brand-700">Step visual</div>
              <div className="mt-1 text-sm font-semibold text-ink">{title}</div>
            </div>
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-brand-100" />
              <span className="h-2 w-2 rounded-full bg-signal-50" />
              <span className="h-2 w-2 rounded-full bg-line" />
            </div>
          </div>
          <div className="min-h-0 flex-1">{renderVisual(kind, "detail")}</div>
        </div>
      </div>
    </figure>
  )
}

function renderVisual(kind: AiWorkflowVisualKind, size: "compact" | "detail") {
  if (kind === "brief") return <BriefVisual />
  if (kind === "directions") return <DirectionVisual />
  if (kind === "assets") return <AssetsVisual />
  if (kind === "figma") return <FigmaVisual size={size} />
  return <HandoffVisual />
}

function BriefVisual() {
  return (
    <div className="grid h-full grid-cols-[1.08fr_0.92fr] gap-3">
      <div className="rounded-md border border-line bg-white p-3">
        <div className="mb-3 h-4 w-20 rounded bg-line" />
        <div className="grid gap-2">
          <div className="h-9 rounded bg-brand-50" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 rounded bg-paper" />
            <div className="h-10 rounded bg-paper" />
            <div className="h-10 rounded bg-paper" />
          </div>
          <div className="h-7 rounded bg-signal-50" />
        </div>
      </div>
      <div className="rounded-md border border-brand-100 bg-brand-50 p-3">
        {["结构", "字段", "参考", "约束"].map((item) => (
          <div key={item} className="mb-1.5 rounded bg-white px-2 py-1.5 text-xs font-medium text-muted">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function DirectionVisual() {
  const directions = [
    ["A", "bg-brand-50", "bg-brand-700"],
    ["B", "bg-signal-50", "bg-signal-600"],
    ["C", "bg-[#FFF7ED]", "bg-[#C2410C]"],
    ["D", "bg-ink", "bg-brand-100"],
  ]

  return (
    <div className="grid h-full grid-cols-2 gap-3">
      {directions.map(([label, bg, accent]) => (
        <div key={label} className={`rounded-md border border-line ${bg} p-2`}>
          <div className={`mb-2 h-3 w-10 rounded ${accent}`} />
          <div className="grid grid-cols-3 gap-1.5">
            <div className="h-7 rounded bg-white/80" />
            <div className="h-7 rounded bg-white/80" />
            <div className="h-7 rounded bg-white/80" />
          </div>
          <div className="mt-2 h-8 rounded bg-white/75" />
          <div className="mt-2 text-xs font-semibold text-muted">方向 {label}</div>
        </div>
      ))}
    </div>
  )
}

function AssetsVisual() {
  return (
    <div className="grid h-full grid-cols-[1.12fr_0.88fr] gap-3">
      <div className="rounded-md border border-line bg-white p-3">
        <div className="h-14 rounded bg-brand-50" />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {["01", "02", "03", "04"].map((item) => (
            <div key={item} className="flex h-9 items-center justify-center rounded border border-line bg-paper text-xs font-semibold text-muted">
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <div className="rounded-md border border-line bg-white p-3">
          <div className="h-6 w-6 rounded bg-brand-700" />
          <div className="mt-2 h-2 w-14 rounded bg-line" />
        </div>
        <div className="rounded-md border border-line bg-white p-3">
          <div className="h-2 w-16 rounded bg-line" />
          <div className="mt-2 h-6 rounded bg-signal-50" />
        </div>
      </div>
    </div>
  )
}

function FigmaVisual({ size }: { size: "compact" | "detail" }) {
  return (
    <div className="grid h-full grid-cols-[0.72fr_1.28fr] gap-3">
      <div className="rounded-md border border-line bg-white p-3">
        {(size === "detail" ? ["Frame", "Nav", "Banner", "Cards", "Table"] : ["Frame", "Nav", "Cards"]).map((item) => (
          <div key={item} className="mb-2 h-5 rounded bg-paper px-2 text-xs leading-5 text-muted">
            {item}
          </div>
        ))}
      </div>
      <div className="rounded-md border border-line bg-white p-3">
        <div className="mb-3 h-8 rounded bg-brand-50" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 rounded bg-paper" />
          <div className="h-10 rounded bg-paper" />
          <div className="h-10 rounded bg-paper" />
        </div>
        <div className="mt-3 grid grid-cols-[1fr_0.72fr] gap-2">
          <div className="h-12 rounded bg-signal-50" />
          <div className="h-12 rounded bg-paper" />
        </div>
      </div>
    </div>
  )
}

function HandoffVisual() {
  return (
    <div className="grid h-full grid-cols-[1.05fr_0.95fr] gap-3">
      <div className="rounded-md border border-line bg-white p-3">
        <div className="mb-3 h-4 w-20 rounded bg-line" />
        <div className="grid gap-2">
          <div className="h-11 rounded bg-brand-50" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-9 rounded bg-paper" />
            <div className="h-9 rounded bg-paper" />
          </div>
          <div className="h-7 rounded bg-signal-50" />
        </div>
      </div>
      <div className="rounded-md border border-line bg-white p-3">
        {["字段", "组件", "响应式", "归档"].map((item) => (
          <div key={item} className="mb-2 flex items-center gap-2 text-xs font-medium text-muted">
            <CheckCircle2 className="h-3.5 w-3.5 text-brand-700" aria-hidden="true" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
