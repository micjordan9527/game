import { articles, type Article } from "@/data/articles"
import { designArticleEntries, designFormats, designObjects, type DesignFormat } from "@/data/designObjects"

export function getDesignObject(value: string | null | undefined) { return designObjects.find((object) => object.slug === value) }
export function getDesignDirection(object: ReturnType<typeof getDesignObject>, value: string | null | undefined) { return object?.directions.find((direction) => direction.slug === value) }
export function getDesignFormat(value: string | null | undefined) { return designFormats.find((format) => format.slug === value) }
export function designArticleEntry(slug: string) { return designArticleEntries.find((entry) => entry.slug === slug) }
export function designArticleFormat(slug: string): DesignFormat { return slug === "tg-message-media" ? "video" : "article" }
export function designTopicArticles() { return designArticleEntries.map((entry) => articles.find((article) => article.slug === entry.slug)!) }

export function designReturnTo(source: "topic" | "library", params: Pick<URLSearchParams, "get">) {
  const query = new URLSearchParams()
  if (source === "library") query.set("role", "design")
  const tag = params.get("tag")
  if (source === "library" && tag) query.set("tag", tag)
  const object = getDesignObject(params.get("object"))
  if (object) query.set("object", object.slug)
  const direction = getDesignDirection(object, params.get("direction"))
  if (direction) query.set("direction", direction.slug)
  const format = getDesignFormat(params.get("format"))
  if (format) query.set("format", format.slug)
  return (source === "library" ? "/articles" : "/design") + (query.size ? "?" + query : "")
}

export function validDesignReturnTo(value: string | null) {
  if (!value?.startsWith("/") || value.startsWith("//")) return null
  try {
    const url = new URL(value, "https://knowledge.invalid")
    if (url.origin !== "https://knowledge.invalid") return null
    if (url.pathname === "/design") return designReturnTo("topic", url.searchParams)
    if (url.pathname === "/articles" && url.searchParams.get("role") === "design") return designReturnTo("library", url.searchParams)
  } catch { /* Invalid return addresses keep ordinary article navigation. */ }
  return null
}

export function designArticleHref(slug: string, returnTo: string) {
  const query = new URLSearchParams()
  const entry = designArticleEntry(slug)
  if (entry) { query.set("design", entry.object); query.set("direction", entry.direction) }
  query.set("returnTo", returnTo)
  return `/articles/${slug}?${query}`
}

export function designArticleContext(slug: string, params: Pick<URLSearchParams, "get">) {
  const entry = designArticleEntry(slug), object = getDesignObject(params.get("design"))
  if (object && entry?.object !== object.slug) return null
  const returnTo = validDesignReturnTo(params.get("returnTo"))
  if (!object && !returnTo) return null
  const actualObject = object ?? getDesignObject(entry?.object)
  const direction = getDesignDirection(actualObject, entry?.direction)
  return { object: actualObject, direction, reference: entry?.reference ?? true, returnTo: returnTo ?? `/design?object=${actualObject!.slug}&direction=${direction!.slug}` }
}

export function visibleDesignArticles(items: Article[], params: Pick<URLSearchParams, "get">) {
  const object = getDesignObject(params.get("object")), direction = getDesignDirection(object, params.get("direction")), format = getDesignFormat(params.get("format"))
  return items.filter((article) => {
    const entry = designArticleEntry(article.slug)
    return (!object || entry?.object === object.slug) && (!direction || entry?.direction === direction.slug) && (!format || designArticleFormat(article.slug) === format.slug)
  })
}

export function designResourceHref(href: string, object: string, direction: string, returnTo: string) {
  const url = new URL(href, "https://knowledge.invalid")
  if (["/design/information", "/design/prototypes", "/design/mobile", "/design/review", "/design/states"].includes(url.pathname)) {
    url.searchParams.set("design", object); url.searchParams.set("direction", direction); url.searchParams.set("returnTo", returnTo)
  }
  return url.pathname + url.search + url.hash
}
