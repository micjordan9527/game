"use client"

import { useMemo, useState } from "react"
import type { TemplateItem } from "@/data/templates"
import { TemplateDetail } from "@/components/templates/TemplateDetail"

export function TemplateLibrary({ templates }: { templates: TemplateItem[] }) {
  const categories = ["全部", ...Array.from(new Set(templates.map((template) => template.category)))]
  const roles = ["全部", ...Array.from(new Set(templates.flatMap((template) => template.roles)))]
  const [category, setCategory] = useState("全部")
  const [role, setRole] = useState("全部")

  const filteredTemplates = useMemo(
    () =>
      templates.filter((template) => {
        const matchCategory = category === "全部" || template.category === category
        const matchRole = role === "全部" || template.roles.includes(role)
        return matchCategory && matchRole
      }),
    [category, role, templates]
  )

  return (
    <div>
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm md:p-5">
        <FilterGroup label="分类" options={categories} active={category} onChange={setCategory} />
        <div className="mt-4 border-t border-line pt-4">
          <FilterGroup label="角色" options={roles} active={role} onChange={setRole} />
        </div>
      </div>
      <div className="mt-8 space-y-4">
        {filteredTemplates.map((template) => (
          <TemplateDetail key={template.slug} template={template} />
        ))}
      </div>
      {filteredTemplates.length === 0 ? <div className="mt-8 rounded-lg border border-line bg-white p-8 text-center text-sm text-muted">没有符合筛选条件的模板。</div> : null}
    </div>
  )
}

function FilterGroup({ label, options, active, onChange }: { label: string; options: string[]; active: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="text-sm font-semibold text-ink">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${
              active === option ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:text-ink"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
