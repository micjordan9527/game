import assert from "node:assert/strict"
import fs from "node:fs"

export async function checkKnowledgeContent(page, base, prefix, width) {
  const manifest = JSON.parse(fs.readFileSync("public/images/knowledge-20261026/manifest.json", "utf8"))
  const source = fs.readFileSync("src/data/knowledgeContentUpdates.ts", "utf8")
  const updates = JSON.parse(source.slice(source.indexOf("= ") + 2))
  assert.equal(updates.length, manifest.length)
  assert.equal(new Set(manifest.map((item) => item.articleSlug)).size, manifest.length)
  await page.locator("footer").getByRole("link", { name: "更新记录", exact: true }).waitFor()
  if (width === 390) {
    await page.getByRole("button", { name: "打开导航", exact: true }).click()
    await page.getByRole("navigation", { name: "移动端知识库导航", exact: true }).getByRole("link", { name: "更新记录", exact: true }).click()
    await page.getByRole("dialog", { name: "知识库导航", exact: true }).waitFor({ state: "hidden" })
  } else {
    await page.getByRole("navigation", { name: "知识库导航", exact: true }).getByRole("link", { name: "更新记录", exact: true }).click()
  }
  await page.locator("#knowledge-content").waitFor()
  assert.equal(await page.locator("#knowledge-content ol > li").count(), manifest.length)
  assert.equal(await page.locator("#demonstrations a").count(), 10)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  await page.screenshot({ path: `/tmp/knowledge-updates-${width}.png` })
  for (const [index, item] of updates.entries()) {
    const material = manifest.find((image) => image.articleSlug === item.slug)
    assert(material && material.source === "GPT Image" && material.materialType === "GPT 生成示意图")
    const raw = fs.readFileSync("public" + material.path)
    assert.equal(raw.readUInt32BE(16), material.width, item.slug + ": PNG width")
    assert.equal(raw.readUInt32BE(20), material.height, item.slug + ": PNG height")
    const response = await page.goto(base + item.detailHref, { waitUntil: "networkidle" })
    assert.equal(response.status(), 200, item.slug)
    const hash = decodeURIComponent(new URL(page.url()).hash.slice(1))
    assert.equal(await page.evaluate((id) => !!document.getElementById(id), hash), true, item.detailHref)
    assert.notEqual(await page.locator("#article-details").getAttribute("open"), null, item.slug)
    const visual = page.getByRole("region", { name: "主题信息图", exact: true })
    assert((await visual.innerText()).includes("GPT 生成示意图"))
    const image = visual.locator("img").first()
    await image.scrollIntoViewIfNeeded()
    await image.evaluate((node) => node.decode())
    assert.equal(await image.evaluate((node) => node.naturalWidth), material.width)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, item.slug)
    if (index === 0 || item.slug === "backup-restore-verification") {
      const top = await page.evaluate(() => scrollY)
      await visual.getByRole("button", { name: "查看大图" }).click()
      const dialog = page.getByRole("dialog")
      await dialog.locator("img").evaluate((node) => node.decode())
      await page.keyboard.press("Escape")
      await dialog.waitFor({ state: "hidden" })
      assert(Math.abs(await page.evaluate(() => scrollY) - top) < 5, "Article image close preserves position")
    }
    await page.goto(base + "/search?q=" + encodeURIComponent(item.title) + "&type=" + encodeURIComponent("文章"), { waitUntil: "networkidle" })
    const link = page.locator(`main a[href="${prefix}${item.href}"]`)
    await link.waitFor()
    assert.equal(await page.locator("#site-search").inputValue(), item.title)
    await link.click()
    await page.locator("#article-details[open]").waitFor()
    await page.goBack({ waitUntil: "networkidle" })
    assert.equal(new URL(page.url()).searchParams.get("q"), item.title)
    assert.equal(new URL(page.url()).searchParams.get("type"), "文章")
    await link.waitFor()
  }
  await page.goto(base + "/search?q=" + encodeURIComponent("更新记录"), { waitUntil: "networkidle" })
  await page.locator(`main a[href="${prefix}/updates"]`).waitFor()
  console.log(`PASS ${width}px: ${manifest.length} content updates, global/mobile/footer access, exact section links, GPT provenance, PNG dimensions/loading, expanded articles, image close and article search/return`)
}
