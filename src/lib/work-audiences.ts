import { workRoles } from "@/data/workRoles"

const aliases: Record<string, string> = {
  产品新人: "产品", 产品经理: "产品", 行业新人: "新人",
  设计师: "设计", 技术: "开发", 技术负责人: "开发", 前端: "开发", 后端: "开发",
}

export function resourceAudiences(href: string, audiences: string[]) {
  return Array.from(new Set([
    ...audiences.map((audience) => aliases[audience] ?? audience),
    ...workRoles.filter((role) => role.steps.some((step) => step.href === href)).map((role) => role.title),
  ]))
}
