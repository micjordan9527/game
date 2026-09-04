const siteBasePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? ""

export function assetPath(path: string) {
  if (!path || path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("#")) {
    return path
  }

  if (!siteBasePath || !path.startsWith("/")) return path

  return `${siteBasePath}${path}`
}
