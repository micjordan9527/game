import Link from "next/link"
import { sportsModules } from "@/data/sports"
import { assetPath } from "@/lib/assets"
import { absoluteUrl } from "@/lib/seo"
import { FeatureFlow } from "@/components/common/FeatureFlow"
export const metadata = {
  title: "体育功能演示",
  description: "直接查看赛事、盘口、注单、结算与后台功能。",
  alternates: { canonical: absoluteUrl("/sports") },
}
export default function SportsPage() {
  return (
    <div className="container-shell py-8">
      <h1 className="text-3xl font-semibold text-ink">体育功能演示</h1>
      <p className="mt-3 text-sm leading-7 text-muted">从前台页面到后台链路，选择一个场景直接查看。</p>
      <FeatureFlow
        title="体育产品的核心链路"
        caption="功能关系示意"
        steps={[
          { title: "赛事", text: "对阵、时间与比赛状态" },
          { title: "盘口", text: "玩法、选项与报价" },
          { title: "注单", text: "确认、受理与记录" },
          { title: "结算", text: "结果、状态与钱包" },
        ]}
      />
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {sportsModules.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="min-w-0 overflow-hidden rounded-xl border border-line bg-white hover:border-brand-200"
          >
            <div className="aspect-[16/10] overflow-hidden bg-paper">
              <img
                src={assetPath(`/images/showcase/sports/${item.slug}.jpg`)}
                alt={`${item.title}演示预览`}
                width={1200}
                height={750}
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold text-brand-700">{item.category} · 功能演示</span>
              <h2 className="mt-2 text-lg font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">{item.description}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-brand-700">直接查看 →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
