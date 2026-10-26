import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

export async function checkCaseReading(page, base, prefix, width) {
  const javascript = ts.transpileModule(fs.readFileSync("src/data/caseReadingGuides.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  const { caseReadingGuides } = await import("data:text/javascript;base64," + Buffer.from(javascript).toString("base64"))
  assert.equal(Object.keys(caseReadingGuides).length, 4)
  for (const [slug, data] of Object.entries(caseReadingGuides)) {
    await page.goto(base + "/cases/" + slug, { waitUntil: "networkidle" })
    assert.equal(await page.locator("main h1").count(), 1)
    const firstVisual = await page.locator("main").evaluate((node) => node.querySelector("img,iframe")?.getBoundingClientRect().top)
    assert(firstVisual < 760, slug + ": original material remains near the top")
    await page.locator('main a[href="#case-reading-guide"]').click()
    const guide = page.getByRole("region", { name: "界面阅读说明", exact: true })
    await page.waitForFunction(() => {
      const top = document.getElementById("case-reading-guide")?.getBoundingClientRect().top
      return top !== undefined && top >= 65 && top <= 120
    })
    assert.equal(await guide.locator("ol > li").count(), 3)
    const text = await guide.innerText()
    assert(text.includes(data.material))
    assert.equal((text.match(/位置：/g) ?? []).length, 3)
    assert.equal((text.match(/判断边界：/g) ?? []).length, 3)
    for (const step of data.steps) {
      assert(step.where && step.observation && step.boundary)
      const url = new URL(step.href, "https://knowledge.example/cases/" + slug)
      const filename = "out" + url.pathname
      const target = [filename, filename + ".html", path.join(filename, "index.html")].find((item) => fs.existsSync(item) && fs.statSync(item).isFile())
      assert(target, step.href)
      if (url.hash) assert(fs.readFileSync(target, "utf8").includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), step.href)
      const href = step.href.startsWith("/") ? prefix + step.href : step.href
      assert.equal(await guide.locator(`a[href="${href}"]`).count(), 1)
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, slug)
    await page.screenshot({ path: `/tmp/case-reading-${slug}-${width}.png` })
  }
  await page.goto(base + "/search?q=" + encodeURIComponent("界面阅读说明") + "&type=" + encodeURIComponent("案例"), { waitUntil: "networkidle" })
  for (const slug of Object.keys(caseReadingGuides)) await page.locator(`main a[href="${prefix}/cases/${slug}"]`).waitFor()
  console.log(`PASS ${width}px: four case reading guides,12 located observations/boundaries, real target anchors, preserved first visuals and case search`)
}
