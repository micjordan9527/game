import { workRoles } from "@/data/workRoles"
import { normalizeAudience } from "@/lib/role-identities"

export function resourceAudiences(href: string, audiences: string[]) {
  return Array.from(new Set([
    ...audiences,
    ...workRoles.filter((role) => role.steps.some((step) => step.href === href)).map((role) => role.title),
  ].map(normalizeAudience)))
}
