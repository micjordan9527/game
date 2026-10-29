import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

const root = path.resolve("out")
const prefix = process.env.TEST_BASE_PATH ?? ""
const origin = process.env.GITHUB_PAGES === "true" ? "https://micjordan9527.github.io" : new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://baowang-knowledge.aurora-5448.chatgpt.site").origin
const errors = []
const pages = fs.readdirSync(root, { recursive: true }).filter((file) => file.endsWith(".html") && !file.startsWith("case-assets/") && file !== "404.html")
const resolveFile = (pathname) => {
  const relative = decodeURIComponent(pathname.slice(prefix.length)).replace(/^\//, "")
  const target = path.resolve(root, relative || "index.html")
  if (target !== root && !target.startsWith(root + path.sep)) return null
  return [target, target + ".html", path.join(target, "index.html")].find((file) => fs.existsSync(file) && fs.statSync(file).isFile())
}
for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), "utf8")
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = raw.replaceAll("&amp;", "&")
    if (!value.startsWith("/") || value.startsWith("//")) continue
    const url = new URL(value, origin)
    if (prefix && !url.pathname.startsWith(prefix + "/") && url.pathname !== prefix) continue
    if (!resolveFile(url.pathname)) errors.push(`${file}: missing ${url.pathname}`)
  }
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)
  assert(canonical, `${file}: canonical missing`)
  assert.equal(new URL(canonical[1]).origin, origin, `${file}: canonical origin`)
}
for (const manifestPath of ["public/images/enrichment/provenance.json", "public/images/official-comparison/manifest.json", "public/images/knowledge-20261026/manifest.json", "public/images/platform-wallet-20261027/manifest.json"]) {
  const items = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  for (const item of items) {
    const file = item.path ? path.join("public", item.path) : path.join(path.dirname(manifestPath), item.file)
    assert(fs.existsSync(file), `Provenance references a missing asset: ${file}`)
    assert(item.width > 0 && item.height > 0)
    assert(item.source && item.materialType)
  }
}
const moduleSource = fs.readFileSync("src/data/businessCases.ts", "utf8")
const updateSource = fs.readFileSync("src/data/knowledgeContentUpdates.ts", "utf8")
const contentUpdates = JSON.parse(updateSource.slice(updateSource.indexOf("= ") + 2))
const releaseNotes = JSON.parse(fs.readFileSync("src/data/releaseHistory.json", "utf8"))
const groupedSlugs = [...releaseNotes.current.articleSlugs, ...releaseNotes.history.flatMap((release) => release.articleSlugs)]
assert.deepEqual([...groupedSlugs].sort(), contentUpdates.map((item) => item.slug).sort(), "Content updates must belong to one release each")
assert.equal(new Set(groupedSlugs).size, groupedSlugs.length)
assert(releaseNotes.current.version > releaseNotes.history[0].version)
for (const release of releaseNotes.history) {
  assert(release.githubCommit === null || /^[0-9a-f]{40}$/.test(release.githubCommit))
  assert(Number.isFinite(Date.parse(release.publishedAt)))
}
for (const release of [releaseNotes.current, ...releaseNotes.history]) {
  const ids = [...release.articleSlugs, ...release.changes.map((item) => item.id)]
  assert.equal(new Set(ids).size, ids.length, `v${release.version}: duplicate release rows`)
}
for (const change of [...releaseNotes.current.changes, ...releaseNotes.history.flatMap((release) => release.changes)]) {
  const target = new URL(change.href, origin)
  const file = resolveFile(prefix + target.pathname)
  assert(file, `Release entry ${change.id}: missing ${change.href}`)
  assert(change.location && change.description && change.linkLabel)
  if (target.hash) assert(fs.readFileSync(file, "utf8").includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), change.href)
}
for (const item of contentUpdates) {
  for (const key of ["href", "detailHref", "relatedHref"]) {
    const target = new URL(item[key], origin)
    const file = resolveFile(prefix + target.pathname)
    assert(file, `Content update ${item.slug}: missing ${item[key]}`)
    if (target.hash) {
      const id = decodeURIComponent(target.hash.slice(1))
      assert(fs.readFileSync(file, "utf8").includes(`id="${id}"`), `Content update ${item.slug}: missing anchor ${item[key]}`)
    }
  }
}
const javascript = ts.transpileModule(moduleSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const data = await import("data:text/javascript;base64," + Buffer.from(javascript).toString("base64"))
const demoJavascript = ts.transpileModule(fs.readFileSync("src/data/demonstrationEntries.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const demos = await import("data:text/javascript;base64," + Buffer.from(demoJavascript).toString("base64"))
const questionJavascript = ts.transpileModule(fs.readFileSync("src/data/businessQuestions.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const { businessQuestions } = await import("data:text/javascript;base64," + Buffer.from(questionJavascript).toString("base64"))
assert.equal(businessQuestions.length, 6)
assert.equal(new Set(businessQuestions.map((item) => item.id)).size, 6)
for (const item of businessQuestions) {
  assert.equal(item.steps.length, 3)
  for (const link of [item.demo, item.article]) {
    const target = new URL(link.href, origin)
    const file = resolveFile(prefix + target.pathname)
    assert(file, link.href)
    if (target.hash) assert(fs.readFileSync(file, "utf8").includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), link.href)
  }
}
assert.equal(demos.demonstrationEntries.length, 18)
assert.equal(new Set(demos.demonstrationEntries.map((item) => item.title)).size, demos.demonstrationEntries.length)
for (const item of demos.demonstrationEntries) {
  assert(demos.demonstrationGroups.some((group) => group.id === item.group))
  assert(item.location)
  const target = new URL(item.href, origin)
  const file = resolveFile(prefix + target.pathname)
  assert(file, item.href)
  if (target.hash) assert(fs.readFileSync(file, "utf8").includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), item.href)
}
assert.equal(data.commissionCents(1_000_000, 300), 30_000)
assert.equal(data.commissionCents(1_200_000, 400), 48_000)
assert.equal(data.commissionCents(-200_000, 300), -6_000)
for (const stage of data.withdrawalStages) {
  assert.equal(stage.available + stage.frozen + stage.paid, 126_000, stage.label + ": funds conservation")
  assert(stage.available >= 0 && stage.frozen >= 0 && stage.paid >= 0)
  if (["处理中", "结果未知"].includes(stage.label)) assert.equal(stage.frozen, 10_000)
  if (stage.label === "已完成") assert.equal(stage.available, 116_000, "Successful payment must not debit available twice")
}
for (const demo of [data.settlementCase, data.withdrawalCase]) {
  for (const stage of demo.stages) {
    assert.equal(stage.fields.length, demo.screens.length)
    for (const screen of stage.fields) assert(screen.some(([, value]) => value === demo.recordId))
  }
}
assert.deepEqual([...new Set(errors)], [], "Broken exported internal references:\n" + [...new Set(errors)].join("\n"))
console.log(`Integrity checks passed: ${pages.length} exported pages, internal files, canonical origins, asset provenance, settlement arithmetic and withdrawal conservation.`)
