const isGitHubPages = process.env.GITHUB_PAGES === "true"

// GitHub Pages serves this repository under /game; Netlify uses the root path.
export const siteUrl = isGitHubPages
  ? "https://micjordan9527.github.io/game"
  : process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowledge001.netlify.app"

export const siteTitle = "包网知识库"

export const siteDescription = "用产品、运营、设计、技术视角，理解包网平台、后台系统与项目交付资料。"

export function absoluteUrl(path = "/") {
  const base = new URL(siteUrl)
  const basePath = base.pathname.replace(/\/$/, "")
  const normalizedPath = `/${path.replace(/^\/+/, "")}`
  return new URL(`${basePath}${normalizedPath}`, base.origin).toString()
}
