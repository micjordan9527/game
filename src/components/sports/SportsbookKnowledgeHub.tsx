"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, Filter } from "lucide-react"
import { sportsKnowledgeDomains, sportsModules, sportsRolePaths } from "@/data/sports"

const allOption = "全部"

export function SportsbookKnowledgeHub() {
  const [activeDomain, setActiveDomain] = useState(allOption)
  const [activeRole, setActiveRole] = useState(allOption)

  const domainCounts = useMemo(() => {
    const map: Record<string, number> = {}
    sportsModules.forEach((module) => {
      map[module.domainId] = (map[module.domainId] || 0) + 1
    })
    return map
  }, [])

  const roleCounts = useMemo(() => {
    const map: Record<string, number> = {}
    sportsModules.forEach((module) => {
      module.roleIds.forEach((roleId) => {
        map[roleId] = (map[roleId] || 0) + 1
      })
    })
    return map
  }, [])

  const visibleModules = useMemo(
    () =>
      sportsModules.filter((module) => {
        const domainMatched = activeDomain === allOption || module.domainId === activeDomain
        const roleMatched = activeRole === allOption || module.roleIds.includes(activeRole)
        return domainMatched && roleMatched
      }),
    [activeDomain, activeRole]
  )

  return (
    <section className="space-y-10 py-12">
      <div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">知识库地图</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-ink md:text-3xl">体育博彩可以按业务域理解</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-muted">先按业务域建立全局地图，再按角色路径进入具体资料，阅读时更容易判断自己应该先看哪一块。</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-line bg-white p-2 shadow-sm">
            <Filter className="h-4 w-4 text-muted" aria-hidden="true" />
            <span className="text-xs font-medium text-muted">筛选</span>
            <span className="rounded-md bg-paper px-2 py-1 text-xs font-semibold text-ink">{visibleModules.length} 个模块</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 rounded-lg border border-line bg-white p-3 shadow-sm lg:grid-cols-2">
          <DomainFilterGroup
            active={activeDomain}
            onChange={setActiveDomain}
            counts={domainCounts}
          />
          <RoleFilterGroup
            active={activeRole}
            onChange={setActiveRole}
            counts={roleCounts}
          />
        </div>
      </div>

      <div>
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-700">结构化模块</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">体育博彩模块</h2>
            </div>
            <Link href="/sports" className="shrink-0 text-sm font-semibold text-brand-700 hover:text-ink">
              查看全部
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleModules.map((module) => (
              <Link
                key={module.slug}
                href={module.href}
                className={[
                  "group rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-brand-100 hover:shadow-soft",
                  module.status === "待开放" ? "pointer-events-none opacity-75" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-md bg-paper px-2.5 py-1 text-xs font-medium text-muted">{module.category}</span>
                  <span className={["rounded-md px-2.5 py-1 text-xs font-medium", module.status === "已开放" ? "bg-brand-50 text-brand-700" : "bg-paper text-muted"].join(" ")}>
                    {module.status}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">{module.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted">{module.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {module.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-md bg-paper px-2.5 py-1 text-xs font-medium text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 group-hover:underline">
                  {module.status === "已开放" ? "查看模块" : "待开放"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
          {visibleModules.length === 0 ? <div className="mt-5 rounded-lg border border-line bg-white p-8 text-center text-sm text-muted">当前筛选下暂无模块。</div> : null}
        </div>
      </div>

    </section>
  )
}

function DomainFilterGroup({
  active,
  onChange,
  counts,
}: {
  active: string
  onChange: (value: string) => void
  counts: Record<string, number>
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="w-12 shrink-0 text-xs font-semibold text-ink">业务域</div>
      <div className="flex min-w-0 flex-1 flex-wrap gap-1.5 px-0.5 py-1">
        <button
          type="button"
          onClick={() => onChange(allOption)}
          aria-pressed={active === allOption}
          className={[
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition",
            active === allOption ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:bg-paper hover:text-ink",
          ].join(" ")}
        >
          {allOption} ({sportsModules.length})
        </button>
        {sportsKnowledgeDomains.map((domain) => (
          <div key={domain.id} className="group/domain relative shrink-0">
            <button
              type="button"
              onClick={() => onChange(domain.id)}
              aria-pressed={active === domain.id}
              className={[
                "rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition",
                active === domain.id ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:bg-paper hover:text-ink",
              ].join(" ")}
            >
              {domain.title} ({counts[domain.id] || 0})
            </button>
            <div className="invisible absolute left-1/2 top-full z-30 mt-2 w-72 -translate-x-1/2 rounded-lg border border-line bg-white p-3 text-left opacity-0 shadow-md transition group-hover/domain:visible group-hover/domain:opacity-100 group-focus-within/domain:visible group-focus-within/domain:opacity-100">
              <div className="text-sm font-semibold text-ink">{domain.title}</div>
              <p className="mt-1 text-xs leading-5 text-muted">{domain.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {domain.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-paper px-2 py-1 text-[11px] font-medium text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RoleFilterGroup({
  active,
  onChange,
  counts,
}: {
  active: string
  onChange: (value: string) => void
  counts: Record<string, number>
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="w-12 shrink-0 text-xs font-semibold text-ink">角色</div>
      <div className="flex min-w-0 flex-1 flex-wrap gap-1.5 px-0.5 py-1">
        <button
          type="button"
          onClick={() => onChange(allOption)}
          aria-pressed={active === allOption}
          className={[
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition",
            active === allOption ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:bg-paper hover:text-ink",
          ].join(" ")}
        >
          {allOption} ({sportsModules.length})
        </button>
        {sportsRolePaths.map((role) => (
          <div key={role.id} className="group/role relative shrink-0">
            <button
              type="button"
              onClick={() => onChange(role.id)}
              aria-pressed={active === role.id}
              className={[
                "rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition",
                active === role.id ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:bg-paper hover:text-ink",
              ].join(" ")}
            >
              {role.title.replace("路径", "")} ({counts[role.id] || 0})
            </button>
            <div className="invisible absolute left-1/2 top-full z-30 mt-2 w-72 -translate-x-1/2 rounded-lg border border-line bg-white p-3 text-left opacity-0 shadow-md transition group-hover/role:visible group-hover/role:opacity-100 group-focus-within/role:visible group-focus-within/role:opacity-100">
              <div className="text-sm font-semibold text-ink">{role.title}</div>
              <p className="mt-1 text-xs leading-5 text-muted">{role.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {role.steps.map((step) => (
                  <span key={step} className="rounded-md bg-paper px-2 py-1 text-[11px] font-medium text-muted">
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
