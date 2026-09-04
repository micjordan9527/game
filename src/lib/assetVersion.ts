import fs from "node:fs"
import path from "node:path"

function normalizeAssetPath(src: string): string {
  return src.startsWith("/") ? src.slice(1) : src
}

export function appendAssetVersion(src: string): string {
  const separator = src.includes("?") ? "&" : "?"
  try {
    const absolutePath = path.join(process.cwd(), "public", normalizeAssetPath(src))
    const stat = fs.statSync(absolutePath)
    return `${src}${separator}v=${encodeURIComponent(String(stat.mtimeMs))}`
  } catch {
    return `${src}${separator}v=0`
  }
}

export function getAssetVersion(src: string): string | null {
  const normalized = src.split("#", 1)[0]
  const match = normalized.match(/[?&]v=([^&]+)/i)
  if (!match) return null

  try {
    const raw = decodeURIComponent(match[1])
    return Number.isNaN(Number(raw)) ? null : raw
  } catch {
    return null
  }
}

export type AssetVersionMeta = {
  version: string | null
  updatedAt: string | null
}

export function getAssetVersionMeta(src: string, locale = "zh-CN", timeZone = "Asia/Kuala_Lumpur"): AssetVersionMeta {
  const version = getAssetVersion(src)
  const updatedAt = version
    ? new Date(Number(version)).toLocaleString(locale, {
        timeZone,
      })
    : null

  return {
    version,
    updatedAt,
  }
}
