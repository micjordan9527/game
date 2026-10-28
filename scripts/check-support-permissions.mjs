import assert from "node:assert/strict"
import fs from "node:fs"
import matter from "gray-matter"
import ts from "typescript"

export async function checkSupportPermissions(page, base, prefix, width) {
  const js = ts.transpileModule(fs.readFileSync("src/data/articles.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  const { articles } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"))
  const entries = [
    ["notification-support-tickets", "消息通知与客服工单", "客服查询截图"],
    ["access-approval-audit", "权限、审批与审计记录", "财务订单截图"],
  ]
  for (const [slug, query, galleryName] of entries) {
    const response = await page.goto(base + "/articles/" + slug + "#visual-guide", { waitUntil: "networkidle" })
    assert.equal(response.status(), 200)
    await page.locator("#article-details[open]").waitFor()
    const { data, content } = matter(fs.readFileSync(`content/articles/${slug}.md`, "utf8"))
    const meta = articles.find((item) => item.slug === slug)
    for (const key of ["title", "description", "category", "tags", "audience", "difficulty"]) assert.deepEqual(data[key], meta[key])
    assert.equal(data.updatedAt.toISOString().slice(0, 10), meta.updatedAt)
    // Old section links remain valid after adding the new lead graphics.
    for (const heading of content.matchAll(/^## (.+)$/gm)) {
      const id = heading[1].trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-")
      assert.equal(await page.locator(`[id="${id}"]`).count(), 1)
    }
    const guide = page.locator("#visual-guide")
    const frames = guide.locator("[data-guide-frame]")
    assert.equal(await frames.count(), 4)
    assert.equal(await frames.locator("button,input,select,textarea").count(), 0, "Static scenes should not pretend to submit anything")
    assert((await guide.innerText()).includes("均为虚构"))
    const boxes = await frames.evaluateAll((nodes) => nodes.map((node) => {
      const r = node.getBoundingClientRect()
      const text = [...node.querySelectorAll("span,p,h3,h4,strong,dt,dd,small")].filter((item) => item.textContent.trim())
      return { x: r.x, y: r.y, right: r.right, minFont: Math.min(...text.map((item) => parseFloat(getComputedStyle(item).fontSize))), overflows: node.scrollWidth > node.clientWidth + 1 }
    }))
    for (const box of boxes) { assert(box.minFont >= 14); assert(box.x >= 0 && box.right <= width + 1); assert.equal(box.overflows, false) }
    if (width === 390) for (let i = 1; i < boxes.length; i++) assert(boxes[i].y > boxes[i - 1].y)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
    if (slug === "notification-support-tickets") {
      assert.equal(await guide.locator("[data-support-user-thread]").getByText("内部备注", { exact: false }).count(), 0)
      assert((await guide.locator("[data-support-internal]").innerText()).includes("用户不可见"))
      const result = await frames.last().innerText()
      assert(result.includes("已解决") && result.includes("外部通知失败") && result.includes("等待用户确认"))
    } else {
      const scope = await frames.first().innerText()
      assert(scope.includes("站点B订单：无权查看") && scope.includes("执行退款 · 无权限"))
      assert((await frames.nth(2).innerText()).includes("原批准失效"))
      const result = await frames.last().innerText()
      assert(result.includes("执行结果未知") && result.includes("退款已完成") && result.includes("RF-DEMO-001"))
      assert(!result.includes("80.00"), "Independent modified-amount example must not change the original execution")
    }
    await frames.nth(slug === "notification-support-tickets" ? 1 : 2).screenshot({ path: `/tmp/support-permissions-${slug}-${width}.png`, style: "body > header { visibility: hidden !important; }" })
    await guide.getByRole("link", { name: "看现有后台截图", exact: true }).click()
    assert.equal(new URL(page.url()).hash, "#interface-reference")
    const gallery = guide.getByRole("region", { name: galleryName, exact: true })
    for (const img of await gallery.locator("img").all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate((node) => node.decode()); assert(await img.evaluate((node) => node.naturalWidth === 1440)) }
    const trigger = gallery.getByRole("button", { name: /查看完整长图/ }).first()
    await trigger.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
    const top = await page.evaluate(() => scrollY)
    await trigger.click()
    const dialog = page.getByRole("dialog"); await dialog.waitFor()
    const viewport = dialog.getByRole("region", { name: "图片浏览区域", exact: true })
    await viewport.locator("img").evaluate((node) => node.decode())
    assert(await viewport.evaluate((node) => node.scrollWidth <= node.clientWidth + 1))
    await dialog.getByRole("button", { name: "原尺寸", exact: true }).click()
    await dialog.getByRole("button", { name: "适应屏幕", exact: true }).click()
    await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" })
    await page.waitForFunction((top) => Math.abs(scrollY - top) < 8, top)
    const other = entries.find((item) => item[0] !== slug)[0]
    await guide.locator(`a[href="${prefix}/articles/${other}#visual-guide"]`).click()
    await page.waitForURL((url) => url.pathname === prefix + "/articles/" + other)
    await page.locator("#visual-guide").waitFor()
    assert.equal(new URL(page.url()).pathname, prefix + "/articles/" + other)
    await page.goto(base + "/search?q=" + encodeURIComponent(query) + "&type=" + encodeURIComponent("文章"), { waitUntil: "networkidle" })
    const found = page.locator(`main a[href="${prefix}/articles/${slug}"]`)
    await found.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
    const searchTop = await page.evaluate(() => scrollY)
    await found.click(); await page.locator("#visual-guide").waitFor()
    await page.goBack({ waitUntil: "networkidle" })
    assert.equal(new URL(page.url()).searchParams.get("q"), query)
    assert.equal(new URL(page.url()).searchParams.get("type"), "文章")
    await page.waitForFunction((top) => Math.abs(scrollY - top) < 8, searchTop)
  }
  for (const slug of ["requirements-state-matrix", "screenshot-case-description"]) {
    assert.equal(await page.evaluate(async (url) => (await fetch(url, { cache: "no-store" })).status, base + "/ai-workflows/" + slug), 404)
  }
  await page.goto(base + "/updates#v29", { waitUntil: "networkidle" })
  const current = JSON.parse(fs.readFileSync("src/data/releaseHistory.json", "utf8")).current.version
  if (current !== 29) await page.locator("#v29[open]").waitFor()
  const release = page.locator(current === 29 ? "#current-release" : "#v29")
  assert((await release.innerText()).includes("补充文章 2 篇"))
  assert(!(await release.innerText()).includes("GPT 配图"))
  for (const [slug] of entries) {
    const row = release.locator(`#${slug}-v29`)
    await row.locator(`a[href="${prefix}/articles/${slug}#visual-guide"]`).click()
    await page.locator("#visual-guide").waitFor(); await page.locator("#article-details[open]").waitFor()
    await page.goBack({ waitUntil: "networkidle" })
  }
  console.log(`PASS support/permissions ${width}px: eight readable scenes, visible/internal replies, solved vs notification failure, role/site restrictions, original refund and approval separation, loaded screenshots/viewer restoration, old anchors, default-open details, search/back, removed workflows and release links`)
}
