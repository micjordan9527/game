import { workRoles } from "@/data/workRoles"
import { resourceAudiences } from "@/lib/work-audiences"

export function libraryAudience(value: string, allowed: string[]) {
  const role = workRoles.find((item) => item.slug === value.toLowerCase())
  const label = role?.title ?? resourceAudiences("", [value])[0]
  return allowed.includes(label) ? label : "全部"
}

export function libraryRoleParam(audience: string) {
  return workRoles.find((item) => item.title === audience)?.slug ?? audience
}
