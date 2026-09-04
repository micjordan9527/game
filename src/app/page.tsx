import { CategoryGrid } from "@/components/home/CategoryGrid"
import { FeaturedArticles } from "@/components/home/FeaturedArticles"
import { GlossaryPreview } from "@/components/home/GlossaryPreview"
import { HeroSection } from "@/components/home/HeroSection"
import { LatestArticles } from "@/components/home/LatestArticles"
import { LearningGuide } from "@/components/home/LearningGuide"
import { TemplatePreview } from "@/components/home/TemplatePreview"
import { TopicExplorer } from "@/components/home/TopicExplorer"
import { VisualGallery } from "@/components/home/VisualGallery"
import { Checklist } from "@/components/common/Checklist"
import { SectionHeader } from "@/components/common/SectionHeader"

export default function HomePage() {
  return (
  <>
      <HeroSection />
      <LearningGuide />
      <CategoryGrid />
      <TopicExplorer />
      <FeaturedArticles />
      <LatestArticles />
      <VisualGallery />
      <GlossaryPreview />
      <TemplatePreview />
      <section className="container-shell py-12">
        <div className="grid gap-6 rounded-xl border border-line bg-white p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <SectionHeader title="专业视角说明" description="内容重点放在结构理解、风险识别、权限控制、异常监控、平台稳定性和用户体验优化。" />
          <Checklist
            items={[
              "保持中性科普视角，不写营销承诺。",
              "关注结构理解、流程边界、审计记录和异常处理。",
              "用产品文档和行业白皮书的方式解释业务流程。",
              "通过模板沉淀可复用的项目资料和检查清单。",
            ]}
          />
        </div>
      </section>
    </>
  )
}
