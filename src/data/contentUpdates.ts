import releaseHistory from "./releaseHistory.json"

export const contentUpdates = [releaseHistory.current, ...releaseHistory.history.slice(0, 2)].map((release) => ({
  title: release.title,
  description: release.summary,
  href: `/updates#v${release.version}`,
  date: release.date ?? release.publishedAt.slice(0, 10),
  kind: "更新",
}))
