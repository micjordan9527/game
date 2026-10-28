import assert from "node:assert/strict"
import fs from "node:fs"
import matter from "gray-matter"
import ts from "typescript"

async function readModule(file) {
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  return import("data:text/javascript;base64," + Buffer.from(js).toString("base64"))
}

export async function checkReportCatalog(page, base, prefix, width) {
  const { articles } = await readModule("src/data/articles.ts")
  const data = await readModule("src/data/reportVisualExample.ts")
  const current = data.reportExampleFor("2026-10-28", "USD")
  assert.deepEqual({ members: current.members, count: current.count, cents: current.amountMinor }, { members: 2, count: 3, cents: 35000 })
  assert.deepEqual(current.rows.map((row) => row.id), ["DEMO-R001", "DEMO-R002", "DEMO-R003"])
  assert.equal(data.reportExampleFor("2026-10-28", "EUR").amountMinor, 10000)
  assert.equal(data.reportExampleFor("2026-10-27", "USD").amountMinor, 4000)
  assert.equal(data.reportExampleFor("2026-10-29", "USD").count, 0)
  assert.equal(new Set(data.reportExampleOrders.map((row) => row.id)).size, 6)
  assert.equal(data.reportExampleTime("2026-10-27T16:03:00Z"), "10-28 00:03")
  assert.equal(data.reportExampleTime("2026-10-27T15:58:00Z"), "10-27 23:58")
  const entries = [["data-report-metrics", "数据报表指标怎么看？"], ["game-catalog-availability", "游戏目录与可用状态"]]
  for (const [slug, query] of entries) {
    const response = await page.goto(base + "/articles/" + slug + "#visual-guide", { waitUntil: "networkidle" })
    assert.equal(response.status(), 200)
    await page.locator("#article-details[open]").waitFor()
    const { data: meta, content } = matter(fs.readFileSync(`content/articles/${slug}.md`, "utf8"))
    const item = articles.find((row) => row.slug === slug)
    for (const key of ["title", "description", "category", "tags", "audience", "difficulty"]) assert.deepEqual(meta[key], item[key])
    assert.equal(meta.updatedAt.toISOString().slice(0, 10), item.updatedAt)
    for (const heading of content.matchAll(/^## (.+)$/gm)) {
      const id = heading[1].trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-")
      assert.equal(await page.locator(`[id="${id}"]`).count(), 1)
    }
    const guide = page.locator("#visual-guide"), frames = guide.locator("[data-guide-frame]")
    assert.equal(await frames.count(), 4)
    assert.equal(await frames.locator("button,input,select,textarea").count(), 0)
    assert((await guide.innerText()).includes("结果均为虚构"))
    const boxes = await frames.evaluateAll((nodes) => nodes.map((node) => {
      const r = node.getBoundingClientRect()
      const fonts = [...node.querySelectorAll("span,p,h3,h4,strong,dt,dd,b,small,code")].filter((item) => item.textContent.trim()).map((item) => parseFloat(getComputedStyle(item).fontSize))
      return { x: r.x, y: r.y, right: r.right, minFont: Math.min(...fonts), overflow: node.scrollWidth > node.clientWidth + 1 }
    }))
    for (const box of boxes) { assert(box.x >= 0 && box.right <= width + 1); assert(box.minFont >= 14); assert.equal(box.overflow, false) }
    if (width === 390) for (let i = 1; i < boxes.length; i++) assert(boxes[i].y > boxes[i - 1].y)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
    if (slug === "data-report-metrics") {
      const summary = await guide.locator('[data-report-summary="2026-10-28-USD"]').innerText()
      assert(summary.includes("2") && summary.includes("3") && summary.includes("350.00"))
      assert.equal(await guide.locator("[data-report-rows] > div").count(), 3)
      assert((await frames.nth(2).innerText()).includes("仍为3笔 · 350.00 USD"))
      await guide.getByRole("link", { name: "看现有后台截图", exact: true }).click()
      const gallery = guide.getByRole("region", { name: "报表界面截图", exact: true })
      assert.equal(await gallery.locator("img").count(), 2)
      for (const img of await gallery.locator("img").all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate((node) => node.decode()); assert(await img.evaluate((node) => node.naturalWidth === 1440)) }
      const trigger = gallery.getByRole("button", { name: /查看完整长图/ }).first()
      await trigger.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
      const top = await page.evaluate(() => scrollY); await trigger.click()
      const dialog = page.getByRole("dialog"); await dialog.waitFor()
      await dialog.getByRole("region", { name: "图片浏览区域", exact: true }).locator("img").evaluate((node) => node.decode())
      await dialog.getByRole("button", { name: "原尺寸", exact: true }).click()
      await dialog.getByRole("button", { name: "适应屏幕", exact: true }).click()
      await dialog.getByRole("button", { name: "下一张", exact: true }).click()
      await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" })
      await page.waitForFunction((top) => Math.abs(scrollY - top) < 8, top)
    } else {
      assert.equal(await guide.locator("[data-game-scene]").count(), 4)
      for (const scene of ["maintenance", "restricted", "query-failed"]) assert((await guide.locator(`[data-game-scene="${scene}"]`).innerText()).includes("GAME-DEMO-21"))
      assert((await guide.locator('[data-game-scene="maintenance"]').innerText()).includes("PROVIDER_MAINTENANCE"))
      assert((await guide.locator('[data-game-scene="restricted"]').innerText()).includes("ACCOUNT_RESTRICTED"))
      assert((await guide.locator('[data-game-scene="query-failed"]').innerText()).includes("状态未知"))
      await guide.getByRole("link", { name: "看相关状态示例", exact: true }).click()
      await guide.locator(`a[href="${prefix}/articles/member-account-states#account-recovery-case"]`).click()
      await page.waitForURL((url) => url.pathname === prefix + "/articles/member-account-states")
      await page.locator("#account-recovery-case").waitFor()
    }
    await page.goto(base + "/articles/" + slug + "#visual-guide", { waitUntil: "networkidle" })
    await page.locator("#visual-guide [data-guide-frame]").nth(slug === "data-report-metrics" ? 1 : 3).screenshot({ path: `/tmp/report-catalog-${slug}-${width}.png`, style: "body > header { visibility: hidden !important; }" })
    await page.goto(base + "/search?q=" + encodeURIComponent(query) + "&type=" + encodeURIComponent("文章"), { waitUntil: "networkidle" })
    const link = page.locator(`main a[href="${prefix}/articles/${slug}"]`)
    await link.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
    const top = await page.evaluate(() => scrollY)
    await link.click(); await page.locator("#visual-guide").waitFor(); await page.locator("#article-details[open]").waitFor()
    await page.goBack({ waitUntil: "networkidle" })
    assert.equal(new URL(page.url()).searchParams.get("q"), query); assert.equal(new URL(page.url()).searchParams.get("type"), "文章")
    await page.waitForFunction((top) => Math.abs(scrollY - top) < 8, top)
  }
  await page.goto(base + "/updates#v30", { waitUntil: "networkidle" })
  const currentVersion = JSON.parse(fs.readFileSync("src/data/releaseHistory.json", "utf8")).current.version
  if (currentVersion !== 30) await page.locator("#v30[open]").waitFor()
  const release = page.locator(currentVersion === 30 ? "#current-release" : "#v30")
  assert((await release.innerText()).includes("补充文章 2 篇")); assert(!(await release.innerText()).includes("GPT 配图"))
  for (const [slug] of entries) {
    await release.locator(`#${slug}-v30 a[href="${prefix}/articles/${slug}#visual-guide"]`).click()
    await page.waitForURL((url) => url.pathname === prefix + "/articles/" + slug)
    await page.locator("#visual-guide").waitFor(); await page.goBack({ waitUntil: "networkidle" })
  }
  console.log(`PASS report/catalog ${width}px: eight readable scenes, exact USD/EUR totals and UTC+8 date boundaries, unknown/duplicate exclusions, four independent game states, reference images/viewer, legacy anchors, default-open details, search/back, existing account demo and release links`)
}
