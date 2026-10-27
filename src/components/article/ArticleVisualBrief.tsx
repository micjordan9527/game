import type { ImagePrompt } from "@/data/imagePrompts"
import { AiWorkflowOutputGallery } from "@/components/ai-workflows/AiWorkflowOutputGallery"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
export function ArticleVisualBrief({ imagePrompts = [] }: { imagePrompts?: ImagePrompt[] }) {
  if (!imagePrompts.length) return null
  return (
    <section aria-label="主题信息图">
      {imagePrompts.some((image) => image.viewer === "scroll") ? <LongImageGallery
        label="主题图解"
        groupLabel="主题图解组"
        emptyMessage="图解暂时无法显示。"
        items={imagePrompts.map((image) => ({ id: image.slug, title: image.title, description: "概念图示，完整说明见正文。", src: image.imageSrc, width: image.width ?? 1024, height: image.height ?? 1536 }))}
      /> : <AiWorkflowOutputGallery
        label="图解"
        outputs={imagePrompts.map((image) => ({
          title: image.title,
          image: image.imageSrcAvif ?? image.imageSrcWebp ?? image.imageSrc,
          alt: image.title,
          width: image.width ?? 1600,
          height: image.height ?? 900,
        }))}
      />}
      {imagePrompts.filter((image) => image.caption).map((image) => (
        <p key={image.slug} className="mt-3 text-sm leading-7 text-muted">{image.caption}</p>
      ))}
    </section>
  )
}
