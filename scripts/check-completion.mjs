import assert from "node:assert/strict"

export async function checkBusinessCases(page, base, prefix, width) {
  await page.goto(`${base}/cases#business-cases`, { waitUntil: "networkidle" })
  const library = page.getByRole("region", { name: "业务流程案例", exact: true })
  const links = library.getByRole("link")
  assert((await links.count()) >= 3)
  for (const link of await links.all()) {
    const href = await link.getAttribute("href")
    assert(href.includes("#"))
    await page.goto(new URL(href, base).href, { waitUntil: "networkidle" })
    await page.locator(new URL(href, base).hash).waitFor()
    await page.goto(`${base}/cases#business-cases`, { waitUntil: "networkidle" })
  }
  await page.goto(`${base}/articles/agent-system-design#agent-settlement-case`, { waitUntil: "networkidle" })
  const section = page.locator("#agent-settlement-case")
  const stages = section.getByRole("tablist", { name: "选择案例状态" }).getByRole("tab")
  const screens = section.getByRole("tablist", { name: "选择案例界面" }).getByRole("tab")
  const panel = section.getByRole("tabpanel")
  const field = (name) => panel.getByText(name, { exact: true }).locator("..").locator("dd")
  assert.equal(await stages.count(), 3)
  assert.equal(await screens.count(), 4)
  for (let stage = 0; stage < 3; stage++) {
    await stages.nth(stage).click()
    for (let screen = 0; screen < 4; screen++) {
      await screens.nth(screen).click()
      assert((await panel.innerText()).includes("SET-DEMO-20261026-001"))
      if (screen === 1) {
        assert((await field("前期 A 已确认").innerText()).endsWith("300.00 DEMO"))
        assert((await field("当期 B 应计").innerText()).endsWith("480.00 DEMO"))
        assert.equal(await field("本期应计合计").innerText(), stage ? "420.00 DEMO" : "480.00 DEMO")
      }
      if (screen === 2 && stage) {
        assert((await field("调整计算").innerText()).includes("-60.00 DEMO"))
        assert((await field("处理方式").innerText()).includes("不跨代理抵扣"))
      }
      if (screen === 3) assert((await field("调整所用规则").innerText()).includes("不能套用当前4%"))
    }
  }
  for (const tabs of [stages, screens]) {
    await tabs.first().focus()
    await page.keyboard.press("End")
    assert.equal(await tabs.last().getAttribute("aria-selected"), "true")
    await page.keyboard.press("ArrowRight")
    assert.equal(await tabs.first().getAttribute("aria-selected"), "true")
    assert.equal(await tabs.first().evaluate((node) => node === document.activeElement), true)
  }
  assert.notEqual(await page.locator("#article-details").getAttribute("open"), null)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  await section.screenshot({ path: `/tmp/agent-settlement-${width}.png` })
  await page.goto(`${base}/search?q=SET-DEMO-20261026-001`, { waitUntil: "networkidle" })
  await page.getByRole("button", { name: /^案例/ }).click()
  await page.locator(`main a[href="${prefix}/articles/agent-system-design#agent-settlement-case"]`).waitFor()
  console.log(`PASS ${width}px: business case directory links, 12 settlement combinations, original-rule correction, separate agent balances, keyboard and case-filtered search`)
}
