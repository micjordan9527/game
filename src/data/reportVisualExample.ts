// Fictional records used only by the report article's explanatory scenes.
export const reportTimeZone = "Asia/Shanghai"
export const reportExampleOrders = [
  { id: "DEMO-R001", member: "会员A", amountMinor: 10000, currency: "USD", status: "已入账", creditedAt: "2026-10-27T16:03:00Z" },
  { id: "DEMO-R002", member: "会员A", amountMinor: 20000, currency: "USD", status: "已入账", creditedAt: "2026-10-28T01:20:00Z" },
  { id: "DEMO-R003", member: "会员B", amountMinor: 5000, currency: "USD", status: "已入账", creditedAt: "2026-10-28T01:30:00Z" },
  { id: "DEMO-R004", member: "会员B", amountMinor: 8000, currency: "USD", status: "结果未知", creditedAt: null },
  { id: "DEMO-R005", member: "会员C", amountMinor: 10000, currency: "EUR", status: "已入账", creditedAt: "2026-10-28T01:35:00Z" },
  { id: "DEMO-R006", member: "会员D", amountMinor: 4000, currency: "USD", status: "已入账", creditedAt: "2026-10-27T15:58:00Z" },
] as const

export function reportExampleFor(day: string, currency: "USD" | "EUR") {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: reportTimeZone, year: "numeric", month: "2-digit", day: "2-digit" })
  const rows = reportExampleOrders.filter((row) => row.status === "已入账" && row.currency === currency && row.creditedAt && date.format(new Date(row.creditedAt)) === day)
  return { rows, members: new Set(rows.map((row) => row.member)).size, count: rows.length, amountMinor: rows.reduce((sum, row) => sum + row.amountMinor, 0) }
}

export function reportExampleTime(instant: string) {
  const parts = new Intl.DateTimeFormat("en", { timeZone: reportTimeZone, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(instant))
  const value = (type: string) => parts.find((part) => part.type === type)!.value
  return `${value("month")}-${value("day")} ${value("hour")}:${value("minute")}`
}
