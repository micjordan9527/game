import assert from "node:assert/strict"
import fs from "node:fs"

const featured = new Set([
  "/",
  "/cases",
  "/cases/bm-optimization",
  "/cases/admin-optimization",
  "/cases/white-label-official",
  "/cases/competitor-analysis",
  "/ai-workflows/brand-visual-system",
  "/ai-workflows/ui-design-system",
])
const teaching =
  /理解检查|应用练习|学习引导|课程式学习路径|题库|下一题|正确率|本次完成记录|建议时长|后续新增|规划中|已接入/

export async function checkShowcase(page, base, prefix, width, rounds) {
  const routes = fs
    .readdirSync("out", { recursive: true })
    .filter((file) => file.endsWith(".html") && file !== "404.html" && !file.startsWith("case-assets/"))
    .map((file) => (file === "index.html" ? "/" : "/" + file.replace(/\.html$/, "")))
    .sort()
  assert(routes.length >= 81, "Expected the full site export")
  const metrics = []
  for (const route of routes) {
    const response = await page.goto(base + (route === "/" ? "" : route), { waitUntil: "networkidle" })
    assert(response.status() < 400, `${route}: HTTP ${response.status()}`)
    assert.equal(await page.locator("main h1").count(), 1, `${route}: expected one page title`)
    const result = await page.locator("main").evaluate((main) => ({
      text: main.innerText,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      visualTop: (() => {
        const visual = main.querySelector("img, iframe")
        return visual ? Math.round(visual.getBoundingClientRect().top) : null
      })(),
    }))
    assert(!teaching.test(result.text), `${route}: course or maintenance copy is visible at ${width}px`)
    assert(!result.overflow, `${route}: horizontal page overflow at ${width}px`)
    if (featured.has(route)) {
      assert(
        result.visualTop !== null && result.visualTop < 760,
        `${route}: the work starts too far down (${result.visualTop}px) at ${width}px`
      )
      metrics.push(`${route}=${result.visualTop}px`)
    }
    if (route === "/articles/tg-message-media") {
      assert.equal(await page.locator("details#article-details, #article-content").count(), 0, "TG shows video and screenshots without a details module")
      assert.equal(await page.locator("#tg-message-demo video").count(), 1, "TG defaults to video")
      assert.equal(await page.locator("#tg-case-details").isVisible(), true, "TG screenshots are directly visible")
    } else if (route.startsWith("/articles/")) {
      assert.notEqual(await page.locator("#article-details").getAttribute("open"), null, `${route}: article details must start expanded`)
      assert.equal(await page.locator("#article-content").isVisible(), true, `${route}: article body is hidden`)
      assert.equal(await page.locator("main h1").count(), 1, `${route}: expanded article duplicates title`)
      assert.equal((await page.locator("#article-content h2").count()) > 0, true)
    }
  }
  console.log(
    `PASS ${routes.length} pages at ${width}px: titles, no course UI, page width; first works: ${metrics.join(", ")}`
  )

  for (const slug of ["admin-optimization", "bm-optimization", "competitor-analysis", "white-label-official"]) {
    await page.goto(`${base}/cases/${slug}`, { waitUntil: "networkidle" })
    for (let index = 0; index < rounds; index++) {
      await page.reload({ waitUntil: "networkidle" })
      assert.equal(await page.locator("main h1").count(), 1)
    }
  }
  await page.goto(`${base}/cases/admin-optimization`, { waitUntil: "networkidle" })
  const frame = page.frameLocator('iframe[title="后台优化案例预览"]')
  await frame.locator('.role-tab[data-role="财务"]').click()
  assert.equal(await frame.locator("#currentRole").innerText(), "财务")
  await frame.locator('.role-tab[data-role="客服"]').click()
  assert.equal(await frame.locator("#currentRole").innerText(), "客服")
  await frame.getByRole("button", { name: "说明", exact: true }).click()
  await frame.locator("#explainModal.open").waitFor()

  await page.goto(`${base}/cases/bm-optimization`, { waitUntil: "networkidle" })
  await page.getByRole("region", { name: "案例长图组" }).locator("article button").first().click()
  const dialog = page.getByRole("dialog")
  await dialog.getByRole("heading", { name: "BM 首页优化信息图" }).waitFor()
  await dialog.getByRole("button", { name: "下一张", exact: true }).click()
  await dialog.getByRole("heading", { name: "BM 详情页优化信息图" }).waitFor()
  await page.keyboard.press("Escape")
  await dialog.waitFor({ state: "hidden" })

  await page.goto(`${base}/ai-workflows/brand-visual-system`, { waitUntil: "networkidle" })
  const tabs = page.getByRole("tablist", { name: "切换输出图片" }).first()
  await tabs.getByRole("tab", { name: "输出 2", exact: true }).click()
  await page.getByRole("img", { name: "品牌图形语言延展与品牌海报样式应用", exact: true }).first().waitFor()
  await page
    .locator("main button")
    .filter({ has: page.locator('img[alt="品牌图形语言延展与品牌海报样式应用"]') })
    .first()
    .click()
  await page.getByRole("dialog").waitFor()
  await page.keyboard.press("Escape")
  await page.getByRole("dialog").waitFor({ state: "hidden" })
  await page.goto(`${base}/design/prototypes`, { waitUntil: "networkidle" })
  const designs = page.getByRole("tablist", { name: "切换设计演示" })
  await designs.getByRole("tab", { name: "钱包流水", exact: true }).focus()
  await page.keyboard.press("ArrowRight")
  assert.equal(await designs.getByRole("tab", { name: "风险审核", exact: true }).getAttribute("aria-selected"), "true")
  assert((await page.getByRole("tabpanel").innerText()).includes("风险"))
  await page.reload({ waitUntil: "networkidle" })
  assert.equal(await designs.getByRole("tab", { name: "风险审核", exact: true }).getAttribute("aria-selected"), "true")
  await page.goto(`${base}/design/prototypes#workbench`, { waitUntil: "networkidle" })
  assert.equal(
    await designs.getByRole("tab", { name: "后台工作台", exact: true }).getAttribute("aria-selected"),
    "true"
  )
  await page.goto(`${base}/search?q=${encodeURIComponent("钱包")}`, { waitUntil: "networkidle" })
  await page.getByRole("button", { name: /^案例/ }).click()
  const result = page.locator(`main a[href="${prefix}/cases/admin-optimization"]`)
  await result.waitFor()
  assert.equal(await result.locator("img").count(), 1)
  console.log(
    `PASS case refreshes, prototype roles, image navigation, keyboard tabs, hash restore and visual search at ${width}px`
  )
}
