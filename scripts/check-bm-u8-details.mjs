import assert from "node:assert/strict"
import fs from "node:fs"
import ts from "typescript"

export async function checkBmU8Details(page, base, prefix, width) {
  const js = ts.transpileModule(fs.readFileSync("src/data/caseEnhancements.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  const { bmFocus, u8Focus } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"))
  const sets = [["bm-optimization", bmFocus], ["competitor-analysis", u8Focus]]
  const decodeCrops = async (locator) => locator.evaluateAll(async (nodes) => Promise.all(nodes.map(async (node) => {
    const image = new Image(); image.src = node.querySelector("image").getAttribute("href"); await image.decode()
    if (!image.naturalWidth) throw Error("Cropped source failed to load")
  })))
  for (const [slug, items] of sets) {
    await page.goto(base + "/cases/" + slug + "#case-focus", { waitUntil: "networkidle" })
    const focus = page.locator("#case-focus"), tabs = focus.getByRole("tab")
    assert.equal(await tabs.count(), 3)
    for (const [index, entry] of items.entries()) {
      for (const side of [entry.comparison.before, entry.comparison.after]) {
        const c = side.crop
        assert(c.x >= 0 && c.y >= 0 && c.width > 0 && c.height > 0 && c.x + c.width <= entry.width && c.y + c.height <= entry.height)
      }
      await tabs.nth(index).click()
      const panel = focus.locator(`[role="tabpanel"][data-focus-id="${entry.id}"]`)
      await panel.waitFor()
      assert.equal(new URL(page.url()).searchParams.get("focus"), entry.id)
      const previews = panel.locator("svg[data-cropped-image]")
      assert.equal(await previews.count(), 2)
      await decodeCrops(previews)
      const boxes = await previews.evaluateAll((nodes) => nodes.map((node) => {
        const r = node.getBoundingClientRect(), view = node.viewBox.baseVal
        return { x: r.x, y: r.y, right: r.right, ratio: r.height / r.width, expected: view.height / view.width }
      }))
      for (const box of boxes) { assert(box.x >= 0 && box.right <= width + 1); assert(Math.abs(box.ratio - box.expected) < 0.01) }
      if (width === 390) assert(boxes[1].y > boxes[0].y, "Mobile comparisons stack without shrinking two sides into one strip")
      const trigger = panel.getByRole("button", { name: /放大这一局部/ }).first()
      const control = trigger.getByText("放大这一局部", { exact: true })
      await control.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      const top = await page.evaluate(() => scrollY); await control.click()
      const dialog = page.getByRole("dialog"), viewport = dialog.getByRole("region", { name: "图片浏览区域", exact: true })
      await dialog.waitFor(); await decodeCrops(viewport.locator("svg[data-cropped-image]"))
      const lockedTop = await page.evaluate(() => -parseFloat(document.body.style.top))
      const fit = async () => {
        const box = await viewport.locator("svg").boundingBox()
        const dimensions = await viewport.evaluate((node) => { const s = getComputedStyle(node); return { width: node.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight), overflow: node.scrollWidth > node.clientWidth + 1 } })
        assert(Math.abs(box.width - dimensions.width) <= 1); assert.equal(dimensions.overflow, false)
      }
      await fit()
      await dialog.getByRole("button", { name: "原尺寸", exact: true }).click()
      assert.equal(Math.round((await viewport.locator("svg").boundingBox()).width), entry.comparison.before.crop.width)
      await dialog.getByRole("button", { name: "下一张", exact: true }).click()
      assert.equal((await dialog.getByRole("heading").innerText()).trim(), entry.comparison.after.label)
      assert.equal(Math.round((await viewport.locator("svg").boundingBox()).width), entry.comparison.after.crop.width)
      await dialog.getByRole("button", { name: "适应屏幕", exact: true }).click(); await fit()
      const thumb = dialog.getByRole("button", { name: /^查看/ })
      assert.equal(await thumb.count(), 2)
      await thumb.first().click(); assert.equal(await thumb.first().getAttribute("aria-pressed"), "true")
      await page.keyboard.press("ArrowRight")
      assert.equal((await dialog.getByRole("heading").innerText()).trim(), entry.comparison.after.label)
      await page.keyboard.press("ArrowLeft")
      await dialog.getByRole("button", { name: "关闭", exact: true }).focus()
      await page.keyboard.press("Shift+Tab")
      assert(await dialog.evaluate((node) => node.contains(document.activeElement)))
      await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" })
      try { await page.waitForFunction((top) => Math.abs(scrollY - top) < 8, top, { timeout: 3000 }) }
      catch { throw Error(`${slug}/${entry.id}/${width}: close scroll expected ${top}, locked ${lockedTop}, got ${await page.evaluate(() => scrollY)}`) }
      assert(await trigger.evaluate((node) => node === document.activeElement))
      const captionFonts = await panel.locator("h3,p,a").evaluateAll((nodes) => nodes.filter((node) => node.textContent.trim() && !node.classList.contains("uppercase")).map((node) => parseFloat(getComputedStyle(node).fontSize)))
      assert(Math.min(...captionFonts) >= 14)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
      if (index === 2) await panel.screenshot({ path: `/tmp/bm-u8-detail-${slug}-${width}.png`, style: "body > header { visibility:hidden !important; }" })
      await panel.locator(`a[href="${entry.comparison.demoHref}"]`).click()
      await page.waitForURL((url) => url.hash === entry.comparison.demoHref)
      await page.locator(entry.comparison.demoHref).waitFor()
      await page.goBack({ waitUntil: "networkidle" }); await panel.waitFor()
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      assert.equal(new URL(page.url()).searchParams.get("focus"), entry.id)
    }
    await tabs.first().focus(); await page.keyboard.press("End")
    assert.equal(await tabs.last().getAttribute("aria-selected"), "true")
    await page.keyboard.press("Home"); assert.equal(await tabs.first().getAttribute("aria-selected"), "true")
    await page.keyboard.press("ArrowRight"); assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true")
    await page.goto(base + "/cases/" + slug + "?focus=" + items[2].id + "#case-focus", { waitUntil: "networkidle" })
    await focus.locator(`[data-focus-id="${items[2].id}"]`).waitFor()
    await page.reload({ waitUntil: "networkidle" }); await focus.locator(`[data-focus-id="${items[2].id}"]`).waitFor()
    await page.goto(base + "/search?q=" + encodeURIComponent(slug === "bm-optimization" ? "BM" : "U8") + "&type=" + encodeURIComponent("案例"), { waitUntil: "networkidle" })
    await page.locator(`main a[href="${prefix}/cases/${slug}"]`).click()
    await page.waitForURL((url) => url.pathname === prefix + "/cases/" + slug)
    await page.locator("#case-focus").waitFor(); await page.goBack({ waitUntil: "networkidle" })
    assert.equal(new URL(page.url()).searchParams.get("type"), "案例")
  }
  await page.goto(base + "/updates#v31", { waitUntil: "networkidle" })
  const current = JSON.parse(fs.readFileSync("src/data/releaseHistory.json", "utf8")).current.version
  if (current !== 31) await page.locator("#v31[open]").waitFor()
  const release = page.locator(current === 31 ? "#current-release" : "#v31")
  assert((await release.innerText()).includes("页面变化 2 项"))
  for (const [id, slug, selected] of [["bm-local-comparisons", "bm-optimization", "categories"], ["u8-local-comparisons", "competitor-analysis", "profile"]]) {
    await release.locator(`#${id} a[href="${prefix}/cases/${slug}?focus=${selected}#case-focus"]`).click()
    await page.locator(`#case-focus [data-focus-id="${selected}"]`).waitFor()
    await page.goBack({ waitUntil: "networkidle" })
  }
  console.log(`PASS BM/U8 details ${width}px: six pairs/12 bounded source crops, full previews and readable captions, width-fit/native/SVG loading, next/previous/thumbs/keyboard/focus and close restoration, roving tabs, direct/reloaded focus links, prototype/search return and release links`)
}
