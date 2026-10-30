import { articles, type Article } from "@/data/articles"
import { roleDirectories, type RoleDirectoryDefinition } from "@/data/roleGroups"
import { getRoleIdentity } from "@/lib/role-identities"
import { resourceAudiences } from "@/lib/work-audiences"

export function getRoleDirectory(value: string | null | undefined) {
  const id = getRoleIdentity(value)?.slug ?? value
  return roleDirectories.find((role) => role.id === id)
}
export function getRoleGroup(role: RoleDirectoryDefinition, value: string | null | undefined) { return role.groups.find((group) => group.slug === value) }
export function roleDirectoryArticles(role: RoleDirectoryDefinition) { return articles.filter((article) => resourceAudiences("/articles/" + article.slug, article.audience).includes(role.audience)) }
export function roleArticleEntry(role: RoleDirectoryDefinition, slug: string) {
  for (const group of role.groups) {
    const entry = group.entries.find((entry) => entry.slug === slug)
    if (entry) return { group, reference: entry.reference === true }
  }
  return { group: undefined, reference: true }
}
export function roleReturnTo(role: RoleDirectoryDefinition, source: "topic" | "library", params: Pick<URLSearchParams, "get">) {
  const query = new URLSearchParams()
  if (source === "library") query.set("role", role.id)
  if (source === "library" && params.get("tag")) query.set("tag", params.get("tag")!)
  const group = getRoleGroup(role, params.get("group"))
  if (group) query.set("group", group.slug)
  return (source === "topic" ? "/product" : "/articles") + (query.size ? "?" + query : "")
}
export function validRoleReturnTo(value: string | null) {
  if (!value?.startsWith("/") || value.startsWith("//")) return null
  try {
    const url = new URL(value, "https://knowledge.invalid")
    if (url.origin !== "https://knowledge.invalid") return null
    const role = url.pathname === "/product" ? getRoleDirectory("product") : url.pathname === "/articles" ? getRoleDirectory(url.searchParams.get("role")) : undefined
    if (role) return roleReturnTo(role, url.pathname === "/product" ? "topic" : "library", url.searchParams)
  } catch { /* Malformed return addresses keep ordinary navigation. */ }
  return null
}
export function roleArticleHref(slug: string, role: RoleDirectoryDefinition, returnTo: string) {
  const query = new URLSearchParams({ workRole: role.id, returnTo })
  const entry = roleArticleEntry(role, slug)
  if (entry.group) query.set("roleGroup", entry.group.slug)
  return `/articles/${slug}?${query}`
}
export function roleArticleContext(slug: string, params: Pick<URLSearchParams, "get">) {
  const returnTo = validRoleReturnTo(params.get("returnTo"))
  const origin = returnTo ? new URL(returnTo, "https://knowledge.invalid") : null
  const requested = getRoleDirectory(params.get("workRole")), originRole = origin?.pathname === "/product" ? getRoleDirectory("product") : getRoleDirectory(origin?.searchParams.get("role"))
  if (requested && originRole && requested.id !== originRole.id) return null
  const role = requested ?? originRole
  if (!role || !roleDirectoryArticles(role).some((article) => article.slug === slug)) return null
  const entry = roleArticleEntry(role, slug)
  if (params.get("roleGroup") && entry.group?.slug !== params.get("roleGroup")) return null
  return { role, ...entry, returnTo: returnTo ?? roleReturnTo(role, "library", new URLSearchParams(entry.group ? { group: entry.group.slug } : {})) }
}
export type RoleArticleContext = NonNullable<ReturnType<typeof roleArticleContext>>
export function visibleRoleArticles(role: RoleDirectoryDefinition, items: Article[], params: Pick<URLSearchParams, "get">) {
  const group = getRoleGroup(role, params.get("group"))
  return group ? items.filter((article) => group.entries.some((entry) => entry.slug === article.slug)) : items
}
