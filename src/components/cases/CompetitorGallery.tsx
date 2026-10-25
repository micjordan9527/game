"use client"

import { useState } from "react"
import { LongImageGallery } from "@/components/cases/LongImageGallery"

export type CompetitorInfographic = {
  brand: "U8" | "星际体育" | "皇冠"
  title: string
  description: string
  src: string
  srcWebp?: string
  srcAvif?: string
  width: number
  height: number
}

const filters: Array<CompetitorInfographic["brand"]> = ["U8", "星际体育", "皇冠"]

export function CompetitorGallery({ items }: { items: CompetitorInfographic[] }) {
  const availableBrands = filters.filter((brand) => items.some((item) => item.brand === brand))
  const [selectedBrand, setActiveBrand] = useState<CompetitorInfographic["brand"]>(items[0]?.brand ?? filters[0])
  const activeBrand = availableBrands.includes(selectedBrand) ? selectedBrand : availableBrands[0] ?? filters[0]
  const filteredItems = items.filter((item) => item.brand === activeBrand)

  return (
    <>
      {availableBrands.length > 1 ? <section className="mt-8 rounded-lg border border-line bg-white p-4 shadow-sm md:p-5" aria-label="竞品筛选">
        <div className="flex flex-wrap gap-2">
          {availableBrands.map((brand) => {
            const count = items.filter((item) => item.brand === brand).length
            const isActive = activeBrand === brand

            return (
              <button
                className={[
                  "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition",
                  isActive
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-white text-muted hover:border-brand-100 hover:text-brand-700",
                ].join(" ")}
                key={brand}
                aria-pressed={isActive}
                onClick={() => setActiveBrand(brand)}
                type="button"
              >
                {brand}
                <span
                  className={[
                    "rounded bg-white/15 px-1.5 py-0.5 text-xs",
                    isActive ? "text-white" : "bg-paper text-muted",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </section> : null}

      <LongImageGallery
        items={filteredItems.map((item) => ({
          id: item.src,
          title: item.title,
          description: item.description,
          src: item.src,
          srcWebp: item.srcWebp,
          srcAvif: item.srcAvif,
          width: item.width,
          height: item.height,
          sourceHref: item.src,
        }))}
        emptyMessage={`${activeBrand} 暂无可显示的信息图，请选择其他分类。`}
      />
    </>
  )
}
