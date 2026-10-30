import { getRoleIdentity, normalizeAudience } from "@/lib/role-identities"

export function libraryAudience(value: string, allowed: string[]) {
  const label = normalizeAudience(value)
  return allowed.includes(label) ? label : "全部"
}

export function libraryRoleParam(audience: string) {
  return getRoleIdentity(audience)?.slug ?? audience
}
