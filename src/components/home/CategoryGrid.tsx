import { categories } from "@/data/categories"
import { CategoryCard } from "@/components/common/CategoryCard"
import { SectionHeader } from "@/components/common/SectionHeader"

export function CategoryGrid() {
  return (
    <section className="container-shell py-12">
      <SectionHeader title="核心栏目入口" description="按业务、产品、运营、设计和技术维度拆分，既能查功能，也能理解功能背后的真实目标。" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  )
}
