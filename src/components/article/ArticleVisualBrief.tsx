import type { ImagePrompt } from "@/data/imagePrompts"
import { AiWorkflowOutputGallery } from "@/components/ai-workflows/AiWorkflowOutputGallery"
export function ArticleVisualBrief({ imagePrompts = [] }: { imagePrompts?: ImagePrompt[] }) {
  if (!imagePrompts.length) return null
  return (
    <section aria-label="主题信息图">
      <AiWorkflowOutputGallery
        label="图解"
        outputs={imagePrompts.map((image) => ({
          title: image.title,
          image: image.imageSrcAvif ?? image.imageSrcWebp ?? image.imageSrc,
          alt: image.title,
          width: image.width ?? 1600,
          height: image.height ?? 900,
        }))}
      />
    </section>
  )
}
