export const roleIdentities = [
  { slug: "operation", title: "运营", label: "运营", kind: "occupation", aliases: ["operations"] },
  { slug: "product", title: "产品", label: "产品", kind: "occupation", aliases: ["产品新人", "产品经理", "product-manager"] },
  { slug: "design", title: "设计", label: "设计", kind: "occupation", aliases: ["设计师", "designer"] },
  { slug: "development", title: "开发", label: "开发", kind: "occupation", aliases: ["技术", "技术负责人", "前端", "后端", "developer", "engineering"] },
  { slug: "test", title: "测试", label: "测试", kind: "occupation", aliases: ["testing", "qa"] },
  { slug: "support", title: "客服", label: "客服", kind: "occupation", aliases: ["customer-service", "customer-support"] },
  { slug: "finance", title: "财务", label: "财务", kind: "occupation", aliases: [] },
  { slug: "project", title: "项目经理", label: "项目管理", kind: "occupation", aliases: ["项目管理", "project-manager", "project-management"] },
  { slug: "devops", title: "运维", label: "运维", kind: "occupation", aliases: ["operations-engineering"] },
  { slug: "risk", title: "风控", label: "风控", kind: "occupation", aliases: ["risk-control"] },
  { slug: "management", title: "经营管理", label: "经营管理", kind: "occupation", aliases: ["老板", "管理者", "boss", "manager"] },
  { slug: "business", title: "商务", label: "商务", kind: "occupation", aliases: ["commercial"] },
  { slug: "newcomer", title: "新人", label: "新人入门", kind: "entry", aliases: ["行业新人", "新手", "新人入门", "beginner", "newbie"] },
  { slug: "interaction", title: "交互", label: "交互资料", kind: "direction", aliases: ["交互设计", "交互设计师", "interaction-design"] },
] as const

export type RoleIdentity = (typeof roleIdentities)[number]

// Keep stored audience labels and old role URLs compatible with the visible entries.
export function getRoleIdentity(value: string | null | undefined): RoleIdentity | undefined {
  const requested = value?.trim().toLowerCase()
  if (!requested) return undefined
  return roleIdentities.find((role) => [role.slug, role.title, role.label, ...role.aliases].some((alias) => alias.toLowerCase() === requested))
}

export function normalizeAudience(value: string): string {
  return getRoleIdentity(value)?.title ?? value
}

export const occupationalRoleIdentities = roleIdentities.filter((role) => role.kind === "occupation")
export const libraryShortcutIdentities = roleIdentities.filter((role) => role.kind !== "occupation")
