import { articles, type Article } from "@/data/articles"
import { designArticleEntries, interactionDesignEntries, designFormats, designObjects, designResources, type DesignFormat } from "@/data/designObjects"
import { getRoleIdentity } from "@/lib/role-identities"
import { resourceAudiences } from "@/lib/work-audiences"

export function getDesignObject(value: string | null | undefined) { return designObjects.find((object) => object.slug === value) }
export function getDesignDirection(object: ReturnType<typeof getDesignObject>, value: string | null | undefined) { return object?.directions.find((direction) => direction.slug === value) }
export function getDesignFormat(value: string | null | undefined) { return designFormats.find((format) => format.slug === value) }
export function isInteractionDesign(params: Pick<URLSearchParams, "get">) { return getRoleIdentity(params.get("role"))?.slug === "interaction" }
export function designEntriesFor(params: Pick<URLSearchParams, "get">) { return isInteractionDesign(params) ? interactionDesignEntries : designArticleEntries }
export function designArticleEntry(slug: string, returnTo?: string) { return (returnTo ? designEntriesFor(new URL(returnTo, "https://knowledge.invalid").searchParams) : designArticleEntries).find((entry) => entry.slug === slug) }
export function designArticleFormat(slug: string): DesignFormat { return slug === "tg-message-media" ? "video" : "article" }
export function designTopicArticles() { return designArticleEntries.map((entry) => articles.find((article) => article.slug === entry.slug)!) }

export function designReturnTo(source: "topic" | "library", params: Pick<URLSearchParams, "get">) {
  const query = new URLSearchParams()
  if (source === "library") query.set("role", isInteractionDesign(params) ? "interaction" : "design")
  const tag = params.get("tag")
  if (source === "library" && tag) query.set("tag", tag)
  const object = isInteractionDesign(params) ? undefined : getDesignObject(params.get("object"))
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
    if (url.pathname === "/articles" && ["design", "interaction"].includes(getRoleIdentity(url.searchParams.get("role"))?.slug ?? "")) return designReturnTo("library", url.searchParams)
  } catch { /* Invalid return addresses keep ordinary article navigation. */ }
  return null
}

export function designArticleHref(slug: string, returnTo: string) {
  const query = new URLSearchParams()
  const entry = designArticleEntry(slug, returnTo)
  if (entry) { query.set("design", entry.object); query.set("direction", entry.direction) }
  query.set("returnTo", returnTo)
  return `/articles/${slug}?${query}`
}

export function designArticleContext(slug: string, params: Pick<URLSearchParams, "get">) {
  const returnTo = validDesignReturnTo(params.get("returnTo"))
  const entry = designArticleEntry(slug, returnTo ?? undefined), object = getDesignObject(params.get("design"))
  const article = articles.find((article) => article.slug === slug)
  const interaction = returnTo ? isInteractionDesign(new URL(returnTo, "https://knowledge.invalid").searchParams) : false
  if (!entry && (interaction || !article || !resourceAudiences("/articles/" + slug, article.audience).includes("设计"))) return null
  if (object && entry?.object !== object.slug) return null
  if (!object && !returnTo) return null
  const actualObject = object ?? getDesignObject(entry?.object)
  const direction = getDesignDirection(actualObject, entry?.direction)
  return { object: actualObject, direction, reference: entry?.reference ?? true, returnTo: returnTo ?? `/design?object=${actualObject!.slug}&direction=${direction!.slug}` }
}

export function visibleDesignArticles(items: Article[], params: Pick<URLSearchParams, "get">) {
  const object = getDesignObject(isInteractionDesign(params) ? "digital" : params.get("object")), direction = getDesignDirection(object, isInteractionDesign(params) ? "interaction" : params.get("direction")), format = getDesignFormat(params.get("format"))
  return items.filter((article) => {
    const entry = designEntriesFor(params).find((entry) => entry.slug === article.slug)
    return (!object || entry?.object === object.slug) && (!direction || entry?.direction === direction.slug) && (!format || designArticleFormat(article.slug) === format.slug)
  })
}

export function getDesignDirectoryResults(items: Article[], params: Pick<URLSearchParams, "get">, source: "topic" | "library") {
  const interaction = isInteractionDesign(params)
  const object = getDesignObject(interaction ? "digital" : params.get("object"))
  const direction = getDesignDirection(object, interaction ? "interaction" : params.get("direction"))
  const format = getDesignFormat(params.get("format"))
  const available = new Set(items.map((article) => article.slug))
  const entries = designEntriesFor(params).filter((entry) => available.has(entry.slug))
  const resources = source === "topic" || !params.get("tag")
    ? designResources.filter((resource) => !interaction || resource.object === "digital" && resource.direction === "interaction")
    : []
  const matches = (item: { object: string; direction: string }) => (!object || item.object === object.slug) && (!direction || item.direction === direction.slug)
  const articleMatchesFormat = (slug: string) => !format || designArticleFormat(slug) === format.slug
  const visibleEntries = entries.filter((entry) => matches(entry) && articleMatchesFormat(entry.slug))
  const visibleResources = resources.filter((resource) => matches(resource) && (!format || resource.format === format.slug))
  const known = new Set<string>(designEntriesFor(params).map((entry) => entry.slug))
  const unassigned = items.filter((article) => !known.has(article.slug) && articleMatchesFormat(article.slug))
  const other = !object && !direction ? unassigned : []
  const counts = (slug?: string, area?: string) => entries.filter((entry) => (!slug || entry.object === slug) && (!area || entry.direction === area) && articleMatchesFormat(entry.slug)).length
    + resources.filter((resource) => (!slug || resource.object === slug) && (!area || resource.direction === area) && (!format || resource.format === format.slug)).length
  const unit = format ? { article: "篇图解", video: "个视频", case: "个案例", demo: "项演示", standard: "项规范", workflow: "个AI 工作流" }[format.slug] : "项资料"
  return { interaction, object, direction, format, visibleEntries, visibleResources, other, counts, unit, allCount: counts() + unassigned.length, total: visibleEntries.length + visibleResources.length + other.length }
}

export function designResourceHref(href: string, object: string, direction: string, returnTo: string) {
  const url = new URL(href, "https://knowledge.invalid")
  if (["/design/information", "/design/prototypes", "/design/mobile", "/design/review", "/design/states"].includes(url.pathname)) {
    url.searchParams.set("design", object); url.searchParams.set("direction", direction); url.searchParams.set("returnTo", returnTo)
  }
  return url.pathname + url.search + url.hash
}
