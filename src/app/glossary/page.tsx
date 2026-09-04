import { GlossarySearch } from "@/components/glossary/GlossarySearch"
import { SectionHeader } from "@/components/common/SectionHeader"
import { glossary } from "@/data/glossary"
import { absoluteUrl } from "@/lib/seo"

export const metadata = {
  title: "术语库",
  description: "快速查询博彩、体育博彩、包网、运营、产品和技术相关行业术语。",
  alternates: {
    canonical: absoluteUrl("/glossary"),
  },
}

export default function GlossaryPage() {
  return (
    <div className="container-shell py-12">
      <SectionHeader
        eyebrow="Glossary"
        title="术语库"
        description="用一句话解释常见行业术语，并补充它们通常出现在哪些功能、运营或风控场景中。"
      />
      <div className="mt-8">
        <GlossarySearch terms={glossary} />
      </div>
    </div>
  )
}
