export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://w-gaming-knowledge.netlify.app"

export const siteTitle = "包网知识库"

export const siteDescription = "用产品、运营、设计、技术视角，理解包网平台、后台系统与项目交付资料。"

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString()
}
