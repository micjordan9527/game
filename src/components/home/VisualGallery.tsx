import Image from "next/image"
import Link from "next/link"
import { Images } from "lucide-react"
import { getImagePromptsForArticle, imagePrompts } from "@/data/imagePrompts"
import { SectionHeader } from "@/components/common/SectionHeader"
import { assetPath } from "@/lib/assets"

export function VisualGallery() {
  const standardImages = imagePrompts.filter((image) => image.kind !== "long-infographic").slice(0, 4)
  const adminModuleImages = getImagePromptsForArticle("admin-modules")
  const adminModuleCover = adminModuleImages[0]

  return (
    <section className="container-shell py-12">
      <SectionHeader title="信息图精选" description="用结构图、流程图和长图组解释平台生态、钱包模式、体育注单、上线检查和后台模块。" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {standardImages.map((image) => (
          <Link key={image.slug} href={`/articles/${image.articleSlug}`} className="overflow-hidden rounded-lg border border-line bg-white shadow-sm hover:border-brand-100 hover:shadow-soft">
            <div className="relative aspect-video bg-paper">
              <picture className="contents">
                {image.imageSrcAvif ? <source srcSet={assetPath(image.imageSrcAvif)} type="image/avif" /> : null}
                {image.imageSrcWebp ? <source srcSet={assetPath(image.imageSrcWebp)} type="image/webp" /> : null}
                <Image
                  src={assetPath(image.imageSrc)}
                  alt={image.title}
                  fill
                  sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, calc(100vw - 2rem)"
                  className="object-contain p-2"
                  loading="lazy"
                />
              </picture>
            </div>
            <div className="p-4 text-sm font-semibold text-ink">{image.title}</div>
          </Link>
        ))}
        {adminModuleCover ? (
          <Link
            href="/articles/admin-modules"
            className="group overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm hover:border-brand-200 hover:shadow-soft md:col-span-2"
          >
            <div className="grid gap-0 md:grid-cols-[0.82fr_1.18fr]">
              <div className="flex flex-col justify-between border-b border-line bg-brand-50/70 p-5 md:border-b-0 md:border-r md:p-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
                    <Images className="h-4 w-4" aria-hidden="true" />
                    长图组
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold leading-8 tracking-normal text-ink">平台后台功能模块地图</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">账号权限、钱包订单、运营协作、数据监控与风险治理的模块化拆解。</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-brand-700">
                  <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-brand-100">{adminModuleImages.length} 张长图</span>
                  <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-brand-100">后台模块</span>
                </div>
              </div>
              <div className="grid aspect-[16/9] grid-cols-3 gap-2 bg-paper p-2 md:aspect-[21/9]">
                {adminModuleImages.slice(0, 3).map((image) => (
                  <div className="relative overflow-hidden rounded-md bg-white" key={image.slug}>
                    <picture className="contents">
                      {image.imageSrcAvif ? <source srcSet={assetPath(image.imageSrcAvif)} type="image/avif" /> : null}
                      {image.imageSrcWebp ? <source srcSet={assetPath(image.imageSrcWebp)} type="image/webp" /> : null}
                      <Image
                        src={assetPath(image.imageSrc)}
                        alt={image.title}
                        fill
                        sizes="(min-width: 1024px) 220px, 30vw"
                        className="object-cover object-top transition duration-300 group-hover:scale-[1.01]"
                        loading="lazy"
                        unoptimized={image.imageSrc.endsWith(".svg")}
                      />
                    </picture>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ) : null}
      </div>
    </section>
  )
}
