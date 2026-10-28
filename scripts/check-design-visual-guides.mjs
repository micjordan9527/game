import assert from "node:assert/strict"
import fs from "node:fs"
import matter from "gray-matter"
import ts from "typescript"

export async function checkDesignVisualGuides(page, base, prefix, width) {
  const source = ts.transpileModule(fs.readFileSync("src/data/articles.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  const { articles } = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"))
  const guides = [
    ["admin-information-hierarchy", 3, "#scenario"],
    ["admin-filter-list-states", 4, "#list-demo"],
    ["form-validation-submit-feedback", 6, "#form-demo"],
    ["admin-bulk-actions", 4, "#bulk-action-demo"],
  ]
  for (const [slug, scenes, demo] of guides) {
    const { data, content } = matter(fs.readFileSync(`content/articles/${slug}.md`, "utf8"))
    const meta = articles.find((item) => item.slug === slug)
    for (const key of ["title", "description", "category", "tags", "audience", "difficulty"]) assert.deepEqual(data[key], meta[key], slug + ": " + key)
    assert.equal(data.updatedAt.toISOString().slice(0, 10), meta.updatedAt)
    const response = await page.goto(base + "/articles/" + slug, { waitUntil: "networkidle" })
    assert.equal(response.status(), 200)
    const guide = page.locator("#visual-guide")
    await guide.waitFor()
    assert.equal(await guide.locator("[data-guide-frame]").count(), scenes)
    assert((await guide.innerText()).includes("静态讲解图"))
    assert.equal(await guide.locator("[data-guide-frame] button, [data-guide-frame] input, [data-guide-frame] select").count(), 0, "Static explanations must not masquerade as interactive controls")
    const dimensions = await guide.locator("[data-guide-frame]").evaluateAll((frames) => frames.map((node) => {
      const r = node.getBoundingClientRect()
      const sizes = [...node.querySelectorAll("p, span, h3, h4, dt, dd, strong, small")].filter((item) => item.textContent.trim()).map((item) => parseFloat(getComputedStyle(item).fontSize))
      return { x: r.x, y: r.y, right: r.right, width: r.width, minFont: Math.min(...sizes) }
    }))
    for (const frame of dimensions) {
      assert(frame.minFont >= 14, slug + ": explanation labels remain at least 14px")
      assert(frame.x >= 0 && frame.right <= width + 1, slug + ": diagram stays in viewport")
    }
    if (width === 390) for (let i = 1; i < dimensions.length; i++) assert(dimensions[i].y > dimensions[i - 1].y, "Phone scenes stack vertically")
    const before = await guide.evaluate((node) => !!(node.compareDocumentPosition(document.querySelector("#article-details")) & Node.DOCUMENT_POSITION_FOLLOWING))
    assert(before, "Graphics lead the detailed prose")
    await page.locator("#article-details[open]").waitFor()
    for (const heading of content.matchAll(/^## (.+)$/gm)) {
      const id = heading[1].trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-")
      assert.equal(await page.locator(`[id="${id}"]`).count(), 1, slug + ": retained heading " + id)
    }
    await guide.getByRole("link", { name: "操作演示 ↓", exact: true }).click()
    assert.equal(new URL(page.url()).hash, demo)
    await page.locator(demo).waitFor()
    await guide.getByRole("link", { name: "查看详细规则 ↓", exact: true }).click()
    assert.equal(new URL(page.url()).hash, "#article-details")
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
    await guide.scrollIntoViewIfNeeded()
    await page.screenshot({ path: `/tmp/design-visual-${slug}-${width}.png`, fullPage: true })
    await guide.locator("[data-guide-frame]").first().screenshot({ path: `/tmp/design-scene-${slug}-${width}.png`, style: "body > header { visibility: hidden !important; }" })
  }
  await page.goto(base + "/articles/admin-information-hierarchy#visual-guide", { waitUntil: "networkidle" })
  const reference = page.getByRole("region", { name: "界面参考组", exact: true })
  const img = reference.locator("img").first()
  await img.scrollIntoViewIfNeeded(); await img.evaluate((node) => node.decode())
  assert.equal(await img.evaluate((node) => node.naturalWidth), 1440)
  const trigger = reference.getByRole("button", { name: /查看完整长图/ }).first()
  await trigger.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
  const top = await page.evaluate(() => scrollY)
  await trigger.click()
  const dialog = page.getByRole("dialog")
  await dialog.waitFor()
  await dialog.locator("img").evaluate((node) => node.decode())
  await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" })
  await page.waitForFunction((top) => Math.abs(scrollY - top) < 8, top)
  await page.goto(base + "/search?q=" + encodeURIComponent("表单校验") + "&type=" + encodeURIComponent("文章"), { waitUntil: "networkidle" })
  const link = page.locator(`main a[href="${prefix}/articles/form-validation-submit-feedback"]`)
  await link.click(); await page.locator("#visual-guide").waitFor()
  await page.goBack({ waitUntil: "networkidle" })
  assert.equal(new URL(page.url()).searchParams.get("q"), "表单校验")
  assert.equal(new URL(page.url()).searchParams.get("type"), "文章")
  await page.goto(base + "/updates#v25", { waitUntil: "networkidle" })
  const currentVersion = JSON.parse(fs.readFileSync("src/data/releaseHistory.json", "utf8")).current.version
  if (currentVersion !== 25) await page.locator("#v25[open]").waitFor()
  const release = page.locator(currentVersion === 25 ? "#current-release" : "#v25")
  assert((await release.innerText()).includes("补充文章 4 篇"))
  assert(!(await release.innerText()).includes("GPT 配图"), "Existing UI reference and HTML diagrams are not new generated images")
  for (const [slug] of guides) await release.locator(`a[href="${prefix}/articles/${slug}#visual-guide"]`).waitFor()
  console.log(`PASS design visual guides ${width}px: 17 legible UI scenes before prose, 14px labels, vertical phone layout, metadata/anchors, static-control distinction, demo/detail jumps, real image load/zoom/close, search return and four accurate release entries`)
}
