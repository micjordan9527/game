import assert from "node:assert/strict"
import fs from "node:fs"

export async function checkReleaseLog(page, base, prefix, width) {
  const releases = JSON.parse(fs.readFileSync("src/data/releaseHistory.json", "utf8"))
  const articleSlugs = releases.history.flatMap((release) => release.articleSlugs)
  assert.equal(articleSlugs.length, 15)
  assert.equal(new Set(articleSlugs).size, 15, "Each content update belongs to exactly one release")
  assert(releases.current.version > releases.history[0].version)
  await page.goto(base + "/updates", { waitUntil: "networkidle" })
  const latest = page.getByRole("region", { name: releases.current.title, exact: true })
  assert((await latest.innerText()).includes("v" + releases.current.version))
  assert.equal(await latest.locator("li").count(), releases.current.changes.length)
  assert((await latest.boundingBox()).y < 300, "Current release should lead the page")
  assert.equal(await page.locator("details[data-release-version][open]").count(), 0, "History is initially collapsed")
  assert.equal(await page.locator("#demonstrations a").count(), 1, "A single directory entry instead of ten old feature cards")
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  await page.screenshot({ path: `/tmp/release-log-${width}.png` })

  const checkCopiedVersion = async (region, version) => {
    await region.getByRole("button", { name: `复制 v${version} 链接`, exact: true }).click()
    await region.getByRole("button", { name: "已复制", exact: true }).waitFor()
    const url = new URL(await page.evaluate(() => navigator.clipboard.readText()))
    const expectedOrigin = process.env.GITHUB_PAGES === "true" ? "https://micjordan9527.github.io" : new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://baowang-knowledge.aurora-5448.chatgpt.site").origin
    assert.equal(url.origin, expectedOrigin)
    assert.equal(url.pathname, prefix + "/updates")
    assert.equal(url.hash, "#v" + version)
    const shared = await page.context().newPage()
    await shared.goto(base + "/updates" + url.hash, { waitUntil: "networkidle" })
    await shared.locator(version === releases.current.version ? "#v" + version : `#v${version}[open]`).waitFor({ state: "attached" })
    await shared.close()
  }
  await checkCopiedVersion(latest, releases.current.version)

  const first = page.locator("#v" + releases.history[0].version)
  await first.locator("summary").focus()
  await page.keyboard.press("Enter")
  await page.locator(`#v${releases.history[0].version}[open]`).waitFor()
  assert.equal(await first.locator("[data-release-items] > li").count(), releases.history[0].changes.length)
  await page.keyboard.press("Enter")
  await page.locator(`#v${releases.history[0].version}:not([open])`).waitFor()

  await page.locator("#v12 summary").click()
  const manualLink = page.locator(`#access-approval-audit a[href^="${prefix}/articles/access-approval-audit#"]`)
  await manualLink.scrollIntoViewIfNeeded()
  const returnTop = await page.evaluate(() => scrollY)
  await manualLink.click()
  await page.locator("#article-details[open]").waitFor()
  await page.goBack({ waitUntil: "networkidle" })
  await page.locator("#v12[open]").waitFor()
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  assert(Math.abs(await page.evaluate(() => scrollY) - returnTop) < 8, "Manual expansion and reading position survive article return")

  await page.getByRole("navigation", { name: "版本定位", exact: true }).getByRole("link", { name: "v13", exact: true }).click()
  await page.locator("#v13[open]").waitFor()
  const article = page.locator(`#multi-tenant-site-config a[href^="${prefix}/articles/multi-tenant-site-config#"]`)
  await article.click()
  await page.locator("#article-details[open]").waitFor()
  await page.goBack({ waitUntil: "networkidle" })
  await page.locator("#v13[open]").waitFor()
  await article.waitFor()
  await checkCopiedVersion(page.locator("#v13"), 13)

  for (const [hash, version] of [["top-navigation", 14], ["access-approval-audit", 12], ["member-agent-platform", 11]]) {
    await page.goto(base + "/updates#" + hash, { waitUntil: "networkidle" })
    await page.locator(`#v${version}[open]`).waitFor()
    assert.equal(await page.locator("#" + hash).isVisible(), true)
    await page.reload({ waitUntil: "networkidle" })
    await page.locator(`#v${version}[open]`).waitFor()
  }
  await page.goto(base + "/updates#knowledge-content", { waitUntil: "networkidle" })
  for (const release of releases.history.filter((item) => item.articleSlugs.length)) {
    await page.locator(`#v${release.version}[open]`).waitFor()
    for (const slug of release.articleSlugs) assert.equal(await page.locator("#" + slug).isVisible(), true)
  }
  await page.goto(base + "/updates#demonstrations", { waitUntil: "networkidle" })
  await page.locator("#demonstrations").getByRole("link").click()
  await page.getByRole("heading", { name: "功能演示目录", level: 1, exact: true }).waitFor()
  const directory = page.getByRole("region", { name: "已有功能演示", exact: true })
  assert.equal(await directory.locator("[data-demo-entry]").count(), 10)
  assert.equal(await directory.getByRole("link").count(), 10)
  const groupNav = page.getByRole("navigation", { name: "演示场景定位", exact: true })
  assert.equal(await groupNav.getByRole("link").count(), 3)
  for (const [group, count] of [["business-process", 4], ["interface-design", 4], ["browse-search", 2]]) {
    assert.equal(await page.locator(`#${group} [data-demo-entry]`).count(), count)
    await groupNav.locator(`a[href="#${group}"]`).click()
    assert.equal(new URL(page.url()).hash, "#" + group)
  }
  for (const card of await directory.locator("[data-demo-entry]").all()) assert((await card.innerText()).includes("位置："))
  await page.screenshot({ path: `/tmp/demo-directory-${width}.png` })
  assert.equal(await page.locator("body > header").getByRole("link", { name: "更新记录", exact: true }).getAttribute("aria-current"), "location")
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  await page.locator(`main a[href="${prefix}/updates#demonstrations"]`).click()
  await page.locator("#demonstrations-title").waitFor()
  await page.goto(base + "/search?q=" + encodeURIComponent("界面设计"), { waitUntil: "networkidle" })
  await page.locator(`main a[href="${prefix}/updates/demonstrations"]`).waitFor()
  console.log(`PASS ${width}px: current/history link copy and fresh-tab sharing, version counts, collapsed history/keyboard, legacy links, article return and 10 demos in3 located groups`)
}
