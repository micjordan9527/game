import { articles } from "@/data/articles"
import { operationGroups, operationReferenceSlugs } from "@/data/operationGroups"

export function getOperationGroup(value: string | null | undefined) {
  return operationGroups.find((group) => group.slug === value)
}

export function articleOperationGroup(slug: string) {
  return operationGroups.find((group) => group.entries.some((entry) => entry.slug === slug))
}

export function operationTopicArticles() {
  const slugs = [...operationGroups.flatMap((group) => group.entries.map((entry) => entry.slug)), ...operationReferenceSlugs]
  return slugs.map((slug) => articles.find((article) => article.slug === slug)!)
}

export function operationReturnTo(source: "topic" | "library", params: Pick<URLSearchParams, "get">) {
  const query = new URLSearchParams()
  if (source === "library") query.set("role", "operation")
  const tag = params.get("tag")
  if (source === "library" && tag) query.set("tag", tag)
  const group = getOperationGroup(params.get("group"))
  if (group) query.set("group", group.slug)
  return (source === "library" ? "/articles" : "/operation") + (query.size ? "?" + query : "")
}

export function validOperationReturnTo(value: string | null) {
  if (!value?.startsWith("/") || value.startsWith("//")) return null
  try {
    const url = new URL(value, "https://knowledge.invalid")
    if (url.origin !== "https://knowledge.invalid") return null
    if (url.pathname === "/operation") return operationReturnTo("topic", url.searchParams)
    if (url.pathname === "/articles" && url.searchParams.get("role") === "operation") return operationReturnTo("library", url.searchParams)
  } catch { /* An invalid return address falls back to the operation directory. */ }
  return null
}

export function resumeOperationReturnTo(returnTo: string) {
  return returnTo + (returnTo.includes("?") ? "&" : "?") + "resume=1"
}

export function operationArticleHref(slug: string, returnTo: string) {
  const query = new URLSearchParams()
  const group = articleOperationGroup(slug)
  if (group) query.set("operation", group.slug)
  query.set("returnTo", returnTo)
  return `/articles/${slug}?${query}`
}

export function operationArticleContext(slug: string, params: Pick<URLSearchParams, "get">) {
  const group = getOperationGroup(params.get("operation"))
  const validGroup = group?.entries.some((entry) => entry.slug === slug) ? group : undefined
  const returnTo = validOperationReturnTo(params.get("returnTo"))
  if (!validGroup && !returnTo) return null
  if (group && !validGroup) return null
  return { group: validGroup, returnTo: returnTo ?? `/operation?group=${validGroup!.slug}` }
}
