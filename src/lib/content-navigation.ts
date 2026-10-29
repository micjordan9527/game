import { articles } from "@/data/articles"
import { categories } from "@/data/categories"
import { caseItems } from "@/data/cases"
import { aiWorkflows } from "@/data/aiWorkflowLibrary"
import { templates } from "@/data/templates"
import { sportsModules } from "@/data/sports"

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

export function getContentNavigation(pathname: string): ContentNavGroup[] {
  if (isNavigationSectionActive(pathname, "/cases")) return [{ title: "案例目录", items: [
    { href: "/cases", label: "全部案例", meta: `${caseItems.length} 个` },
    ...caseItems.map((item) => ({ href: item.href, label: item.title })),
  ] }]
  if (isNavigationSectionActive(pathname, "/articles")) {
    const active = knowledgeCategory(pathname)
    const groups: ContentNavGroup[] = [
      { title: "知识图解", items: [{ href: "/articles", label: "全部图解", meta: `${articles.length} 篇` }] },
      { title: "按主题浏览", items: categories.map((category) => {
        const items = articles.filter((item) => item.category === category.slug)
        return { href: "/" + category.slug, label: category.title, meta: items.length ? `${items.length} 篇` : undefined,
          children: active === category.slug ? items.map((item) => ({ href: "/articles/" + item.slug, label: item.title })) : undefined }
      }) },
    ]
    if (active === "sportsbook") groups.push({ title: "体育专题", items: sportsModules.map((item) => ({ href: item.href, label: item.title })) })
    if (active === "design") groups.push({ title: "设计体验入口", items: [
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
