import assert from "node:assert/strict"
import fs from "node:fs"

const subjects = ["member-account-states", "wallet-payment-reconciliation", "agent-system-design", "campaign-risk-review", "admin-information-hierarchy", "bet-ticket-status"]
const templates = ["member-account-review", "wallet-reconciliation-checklist", "white-label-requirement-form"]
const workflows = ["brand-visual-system", "ui-design-system"]
const cases = ["admin-optimization", "bm-optimization", "competitor-analysis", "white-label-official"]
const settle = (page) => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
async function noOverflow(page, note) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, note)
}
async function loadImages(scope) {
  for (const image of await scope.locator("img").all()) {
    await image.scrollIntoViewIfNeeded()
    await image.evaluate((node) => node.decode())
    assert((await image.evaluate((node) => node.naturalWidth)) > 0)
  }
}
export async function checkContentExpansion(page, base, prefix, width) {
  const provenance = JSON.parse(fs.readFileSync("public/images/enrichment/provenance.json", "utf8"))
  assert.equal(provenance.filter((item) => item.materialType.includes("截图") && !item.materialType.includes("GPT")).length, 12)
  assert(provenance.some((item) => item.materialType.includes("GPT")))
  for (const item of provenance) assert(fs.existsSync("public" + item.path))
  const routes = [...cases.map((slug) => "/cases/" + slug), ...subjects.map((slug) => "/articles/" + slug), ...templates.map((slug) => "/templates/" + slug), ...workflows.map((slug) => "/ai-workflows/" + slug)]
  for (const route of routes) {
    const response = await page.goto(base + route, { waitUntil: "networkidle" })
    assert.equal(response.status(), 200, route)
    assert.equal(await page.locator("main h1").count(), 1, route)
    const text = await page.locator("main").innerText()
    assert(!/作品案例|作业|答题|打卡|后续新增|等待接入/.test(text), route)
    await noOverflow(page, route)
  }

  await page.goto(`${base}/cases/admin-optimization#admin-role-tour`, { waitUntil: "networkidle" })
  const tour = page.getByRole("region", { name: "后台三角色导览", exact: true })
  for (const [role, title] of [["运营", "活动记录"], ["财务", "充值记录"], ["客服", "会员列表"]]) {
    await tour.getByRole("button", { name: role, exact: true }).click()
    const steps = tour.locator("ol > li")
    assert.equal(await steps.count(), 3)
    await loadImages(steps)
    await steps.nth(0).getByRole("button", { name: "在上方演示中查看", exact: true }).click()
    const frame = page.frameLocator('iframe[title="后台优化案例预览"]')
    await frame.locator("#currentRole").filter({ hasText: role }).waitFor()
    await steps.nth(1).getByRole("button", { name: "在上方演示中查看", exact: true }).click()
    await frame.locator("#pageTitle").getByText(title, { exact: true }).waitFor()
    await steps.nth(2).getByRole("button", { name: "在上方演示中查看", exact: true }).click()
    await frame.locator("#detailDrawer.open").waitFor()
    assert.equal(await frame.locator("#detailDrawer header small").innerText(), title + "详情")
    await frame.locator("#closeDrawer").click()
  }
  await noOverflow(page, "Admin role tour")
  console.log(`PASS ${width}px: 3 role tours, 9 actual screenshots, all overview/list/detail live links and matching detail labels`)

  for (const slug of ["bm-optimization", "competitor-analysis", "white-label-official"]) {
    await page.goto(`${base}/cases/${slug}#case-focus`, { waitUntil: "networkidle" })
    const focus = page.locator("#case-focus")
    const tabs = focus.getByRole("tab")
    assert.equal(await tabs.count(), 3)
    for (const tab of await tabs.all()) {
      await tab.click()
      assert.equal(await tab.getAttribute("aria-selected"), "true")
      await loadImages(focus.getByRole("tabpanel"))
    }
    await tabs.first().focus()
    await page.keyboard.press("ArrowRight")
    assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true")
    const related = page.locator('details[aria-label="相关案例与图解"]')
    assert.equal(await related.getAttribute("open"), "")
    assert.equal(await related.getByRole("link").count(), 3)
    await noOverflow(page, slug + " focus")
  }
  console.log(`PASS ${width}px: 9 case focus regions, keyboard selection and 3 explicit related links per case`)

  for (const slug of subjects) {
    await page.goto(`${base}/articles/${slug}#scenario`, { waitUntil: "networkidle" })
    const scenario = page.getByRole("region", { name: "业务场景示例", exact: true })
    const tabs = scenario.getByRole("tab")
    assert((await tabs.count()) >= 3)
    const firstText = await scenario.getByRole("tabpanel").innerText()
    await tabs.last().click()
    assert.notEqual(await scenario.getByRole("tabpanel").innerText(), firstText)
    await page.keyboard.press("Home")
    assert.equal(await tabs.first().getAttribute("aria-selected"), "true")
    await scenario.getByText("查看完整状态对照表", { exact: true }).click()
    assert.equal(await scenario.getByRole("table").isVisible(), true)
    await scenario.getByText("对照站内界面材料", { exact: true }).click()
    await loadImages(scenario)
    assert.notEqual(await page.locator("#article-details").getAttribute("open"), null)
    assert.equal(await page.locator("#article-content").isVisible(), true)
    await noOverflow(page, slug + " scenario")
  }
  await page.goto(`${base}/articles/wallet-payment-reconciliation#scenario`, { waitUntil: "networkidle" })
  await page.screenshot({ path: `/tmp/content-wallet-${width}.png` })
  console.log(`PASS ${width}px: 6 scenario explorers, state changes/tables/evidence images, GPT diagram and expanded article details`)

  await page.goto(`${base}/articles/wallet-payment-reconciliation#reconciliation-case`, { waitUntil: "networkidle" })
  const reconciliation = page.getByRole("region", { name: "充值与对账完整案例", exact: true })
  const resultTabs = reconciliation.getByRole("tablist", { name: "选择对账结果" }).getByRole("tab")
  const screenTabs = reconciliation.getByRole("tablist", { name: "选择案例界面" }).getByRole("tab")
  assert.equal(await resultTabs.count(), 4)
  assert.equal(await screenTabs.count(), 5)
  const ledgerExpectations = ["入账 100.00", "未找到关联入账", "仅入账 1 次", "无入账，不自动补偿"]
  const panel = reconciliation.getByRole("tabpanel")
  for (let resultIndex = 0; resultIndex < 4; resultIndex++) {
    await resultTabs.nth(resultIndex).click()
    for (let screenIndex = 0; screenIndex < 5; screenIndex++) {
      await screenTabs.nth(screenIndex).click()
      assert.equal(await screenTabs.nth(screenIndex).getAttribute("aria-selected"), "true")
      assert((await panel.innerText()).includes("DP-DEMO-20261025-001"), "Every screen retains the same order identifier")
      if (screenIndex === 3) {
        const ledger = panel.locator("dl > div").filter({ has: page.getByText("账本结果", { exact: true }) })
        assert((await ledger.locator("dd").innerText()).includes(ledgerExpectations[resultIndex]))
        const balance = panel.locator("dl > div").filter({ has: page.getByText("预期入账后余额", { exact: true }) })
        assert.equal(await balance.locator("dd").innerText(), [0, 2].includes(resultIndex) ? "1,360.00 DEMO" : "尚未确认")
      }
      if (screenIndex === 4) {
        const status = panel.locator("dl > div").filter({ has: page.getByText("处理状态", { exact: true }) })
        assert.equal(await status.locator("dd").innerText(), resultIndex === 0 ? "已复核关闭" : "待核实")
      }
    }
  }
  for (const tabs of [resultTabs, screenTabs]) {
    await tabs.first().focus()
    for (const [key, selected] of [["ArrowLeft", await tabs.count() - 1], ["Home", 0], ["End", await tabs.count() - 1], ["ArrowRight", 0]]) {
      await page.keyboard.press(key)
      assert.equal(await tabs.nth(selected).getAttribute("aria-selected"), "true")
      assert.equal(await tabs.nth(selected).getAttribute("tabindex"), "0")
      assert.equal(await tabs.nth(selected).evaluate((node) => node === document.activeElement), true)
    }
  }
  assert.equal(await reconciliation.getByRole("list", { name: "对账流程图" }).locator("li").count(), 5)
  await noOverflow(page, "Reconciliation complete case")
  await reconciliation.scrollIntoViewIfNeeded()
  await page.screenshot({ path: `/tmp/reconciliation-${width}.png` })
  console.log(`PASS ${width}px: all 20 reconciliation screen/state combinations, ledger/balance consistency, keyboard controls and no page overflow`)

  for (const slug of workflows) {
    await page.goto(`${base}/ai-workflows/${slug}#workflow-process`, { waitUntil: "networkidle" })
    const process = page.getByRole("region", { name: "工作流过程与对照" })
    assert.equal(await process.locator("ol > li").count(), 4)
    assert.equal(await process.getByRole("article").count(), 3)
    assert.equal(await process.locator("figure").count(), 2)
    assert((await process.innerText()).includes("不是原始生成会话"))
    await loadImages(process)
    await noOverflow(page, slug + " process")
  }
  for (const slug of templates) {
    await page.goto(`${base}/templates/${slug}`, { waitUntil: "networkidle" })
    const sample = page.getByRole("region", { name: "模板成品示例" })
    assert((await sample.locator("h3").count()) >= 8)
    await sample.getByRole("button", { name: "复制示例", exact: true }).click()
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    assert(copied.includes("虚构填写示例"))
    assert(copied.length > 300)
    assert.equal(await sample.getByRole("navigation", { name: "示例关联材料" }).getByRole("link").count(), 2)
    await noOverflow(page, slug + " sample")
  }
  console.log(`PASS ${width}px: 2 workflow process/comparison sections and 3 complete copyable template examples`)

  await page.goto(`${base}/search`, { waitUntil: "networkidle" })
  const recommended = page.getByRole("region", { name: "精选功能图解", exact: true })
  for (const link of await recommended.getByRole("link").all()) assert((await link.getAttribute("href")).endsWith("#scenario"))
  const input = page.getByRole("textbox", { name: "搜索知识库", exact: true })
  await input.fill("DIFF-DEMO-01")
  await page.locator(`main a[href="${prefix}/templates/wallet-reconciliation-checklist"]`).waitFor()
  await input.fill("DP-DEMO-20261025-001")
  await page.locator(`main a[href="${prefix}/articles/wallet-payment-reconciliation"]`).waitFor()
  await page.goto(base, { waitUntil: "networkidle" })
  assert.equal(await page.getByRole("navigation", { name: "业务主题导航" }).locator('a[href$="#scenario"]').count(), 6)
  assert.equal(await page.getByRole("region", { name: "最近更新", exact: true }).locator("time").count(), 3)
  assert((await page.getByRole("region", { name: "最近更新", exact: true }).innerText()).includes("代理跨期结算"))
  await noOverflow(page, "Updated homepage")
  await settle(page)
  console.log(`PASS ${width}px: new content indexed, curated deep links and specific update descriptions`)
}
