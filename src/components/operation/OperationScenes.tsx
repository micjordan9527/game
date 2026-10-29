import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { operationScenes } from "@/data/operationScenes"
import { assetPath } from "@/lib/assets"

export function OperationScenes() {
  return (
    <section aria-label="运营场景" className="my-6" data-operation-scenes>
      <h2 className="text-xl font-semibold text-ink">查看运营产出</h2>
      <p className="mt-2 text-sm leading-7 text-muted">从消息、公告、活动和报表进入具体界面与操作。</p>
      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {operationScenes.map((scene) => (
          <Link
            key={scene.slug}
            href={scene.href}
            className="group flex min-w-0 items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-brand-200 hover:shadow-soft"
          >
            {scene.image ? (
              <img
                src={assetPath(scene.image.src)}
                alt={scene.image.alt}
                width={scene.image.width}
                height={scene.image.height}
                loading="lazy"
                className="h-auto w-24 shrink-0 rounded-lg sm:w-28"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-brand-700">{scene.output}</span>
              <h3 className="mt-1 text-base font-semibold leading-6 text-ink">{scene.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{scene.description}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-brand-700 transition group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  )
}
