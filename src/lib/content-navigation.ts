import { articles } from "@/data/articles"
import { categories } from "@/data/categories"
import { caseItems } from "@/data/cases"
import { aiWorkflows } from "@/data/aiWorkflowLibrary"
import { templates } from "@/data/templates"
import { sportsModules } from "@/data/sports"
import type { OperationGroup } from "@/data/operationGroups"
import { operationArticleHref, operationTopicArticles } from "@/lib/operation-navigation"
import type { DesignObject } from "@/data/designObjects"
import { designArticleEntry, designArticleHref, designTopicArticles, designEntriesFor } from "@/lib/design-navigation"
import { roleDirectoryArticles, roleArticleHref } from "@/lib/role-navigation"
import type { RoleDirectoryDefinition, RoleGroup } from "@/data/roleGroups"

export type ContentNavItem = { href: string; label: string; meta?: string; children?: ContentNavItem[] }
export type ContentNavGroup = { title: string; items: ContentNavItem[] }

export function knowledgeCategory(pathname: string) {
  if (pathname.startsWith("/articles/")) return articles.find((item) => item.slug === pathname.split("/")[2])?.category
  if (pathname === "/sports" || pathname.startsWith("/sports/")) return "sportsbook"
  if (pathname.startsWith("/design/") && pathname !== "/design/material-standards") return "design"
  return categories.find((item) => pathname === "/" + item.slug)?.slug
}

export function isNavigationSectionActive(pathname: string, href: string) {
  if (href === "/articles") return pathname === "/articles" || pathname.startsWith("/articles/") || Boolean(knowledgeCategory(pathname))
  return pathname === href || (href !== "/" && pathname.startsWith(href + "/"))
}

export type DesignNavContext = { object?: DesignObject; direction?: { slug: string; title: string }; returnTo: string }
export type RoleNavContext = { role: RoleDirectoryDefinition; group?: RoleGroup; reference?: boolean; returnTo: string }

export function getContentNavigation(pathname: string, operation?: { group?: OperationGroup; returnTo: string }, design?: DesignNavContext, work?: RoleNavContext): ContentNavGroup[] {
  if (isNavigationSectionActive(pathname, "/cases")) return [{ title: "案例目录", items: [
    { href: "/cases", label: "全部案例", meta: `${caseItems.length} 个` },
    ...caseItems.map((item) => ({ href: item.href, label: item.title })),
  ] }]
  if (isNavigationSectionActive(pathname, "/articles")) {
    if (work) {
      const root = new URL(work.returnTo, "https://knowledge.invalid"); root.searchParams.delete("group")
      const rootHref = root.pathname + (root.searchParams.size ? "?" + root.searchParams : "")
      const result: ContentNavGroup[] = [
        { title: "知识图解", items: [{ href: "/articles", label: "全部图解", meta: `${articles.length} 篇` }] },
        { title: "当前角色", items: [{ href: rootHref, label: work.role.title, meta: `${roleDirectoryArticles(work.role).length} 篇` }] },
        { title: "工作分类", items: work.role.groups.map((group) => {
          const target = new URL(rootHref, "https://knowledge.invalid"); target.searchParams.set("group", group.slug)
          return { href: target.pathname + "?" + target.searchParams, label: group.title, meta: `${group.entries.length} 篇`, children: work.group?.slug === group.slug && !work.reference ? group.entries.map((entry) => ({ href: roleArticleHref(entry.slug, work.role, work.returnTo), label: articles.find((article) => article.slug === entry.slug)!.title })) : undefined }
        }) },
      ]
      const current = articles.find((article) => pathname === "/articles/" + article.slug)
      if (current && work.reference) result.push({ title: "相关参考", items: [{ href: roleArticleHref(current.slug, work.role, work.returnTo), label: current.title }] })
      return result
    }
    const active = design ? "design" : operation ? "operation" : knowledgeCategory(pathname)
    const groups: ContentNavGroup[] = [
      { title: "知识图解", items: [{ href: "/articles", label: "全部图解", meta: `${articles.length} 篇` }] },
      { title: "按主题浏览", items: categories.map((category) => {
        const items = category.slug === "operation" ? operationTopicArticles() : category.slug === "design" ? design ? designEntriesFor(new URL(design.returnTo, "https://knowledge.invalid").searchParams).map((entry) => articles.find((article) => article.slug === entry.slug)!) : designTopicArticles() : articles.filter((item) => item.category === category.slug)
        const reference = operation && !operation.group ? articles.find((item) => pathname === "/articles/" + item.slug) : undefined
        let visible = category.slug === "operation" && operation?.group ? operation.group.entries.map((entry) => articles.find((item) => item.slug === entry.slug)!) : category.slug === "operation" && reference ? [reference] : items
        if (category.slug === "design" && design) {
          const current = articles.find((item) => pathname === "/articles/" + item.slug), currentEntry = current ? designArticleEntry(current.slug, design.returnTo) : undefined
          visible = current && (!currentEntry || currentEntry.reference) ? [current] : items.filter((item) => {
            const entry = designArticleEntry(item.slug, design.returnTo)
            return (!design.object || entry?.object === design.object.slug) && (!design.direction || entry?.direction === design.direction.slug)
          })
        }
        return { href: "/" + category.slug, label: category.title, meta: items.length ? `${items.length} 篇` : undefined,
          children: active === category.slug ? visible.map((item) => ({ href: category.slug === "operation" ? operationArticleHref(item.slug, operation?.returnTo ?? "/operation") : category.slug === "design" ? designArticleHref(item.slug, design?.returnTo ?? "/design") : "/articles/" + item.slug, label: item.title })) : undefined }
      }) },
    ]
    if (active === "sportsbook") groups.push({ title: "体育专题", items: sportsModules.map((item) => ({ href: item.href, label: item.title })) })
    if (active === "design") groups.push({ title: "相关演示与规范", items: [
      { href: "/design/information", label: "信息层级与组件" },
      { href: "/design/prototypes", label: "关键页面原型" },
      { href: "/design/mobile", label: "移动端与状态反馈" },
      { href: "/design/review", label: "界面优化图解" },
      { href: "/design/states", label: "状态对照" },
      { href: "/design/material-standards", label: "代理素材" },
    ] })
    return groups
  }
  if (isNavigationSectionActive(pathname, "/ai-workflows")) return [{ title: "工作流目录", items: [
    { href: "/ai-workflows", label: "全部工作流", meta: `${aiWorkflows.length} 个` },
    ...aiWorkflows.map((item) => ({ href: "/ai-workflows/" + item.slug, label: item.title })),
  ] }]
  if (isNavigationSectionActive(pathname, "/templates")) return [{ title: "模板目录", items: [
    { href: "/templates", label: "全部模板", meta: `${templates.length} 个` },
    ...templates.map((item) => ({ href: "/templates/" + item.slug, label: item.title })),
  ] }]
  if (pathname === "/design/material-standards") return []
  if (pathname === "/") return [{ title: "首页目录", items: [
    { href: "/#home-topics-title", label: "业务主题" },
    { href: "/#home-cases-title", label: "精选案例" },
    { href: "/#home-diagrams-title", label: "知识图解" },
    { href: "/#home-workflows-title", label: "AI 工作流" },
  ] }]
  return []
}
