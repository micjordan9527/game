import assert from "node:assert/strict"

export async function checkAccountRecovery(page, base, prefix, width) {
  await page.goto(`${base}/articles/member-account-states#account-recovery-case`, { waitUntil: "networkidle" })
  const section = page.getByRole("region", { name: "账号受限与恢复完整案例", exact: true })
  const stages = section.getByRole("tablist", { name: "选择恢复进度" }).getByRole("tab")
  const screens = section.getByRole("tablist", { name: "选择恢复界面" }).getByRole("tab")
  const panel = section.getByRole("tabpanel")
  const field = (scope, name) => scope.getByText(name, { exact: true }).locator("..").locator("dd")
  assert.equal(await stages.count(), 4)
  assert.equal(await screens.count(), 4)
  for (let stage = 0; stage < 4; stage++) {
    await stages.nth(stage).click()
    assert.equal(await section.getByRole("list", { name: "恢复处理时间线" }).locator("li").count(), stage + 1)
    const dimensions = section.locator('dl[aria-label="四项独立状态"]')
    assert.equal(await field(dimensions, "资金").innerText(), "正常 · 本例无资金限制")
    assert.equal(await field(dimensions, "账号").innerText(), stage === 3 ? "正常" : "资料变更受限")
    assert.equal(await field(dimensions, "会话").innerText(), stage === 3 ? "原会话已撤销，需重新登录" : "当前会话有效")
    for (let screen = 0; screen < 4; screen++) {
      await screens.nth(screen).click()
      assert((await panel.innerText()).includes("ACC-DEMO-20261026-001"))
      if (screen === 1) assert.equal(await field(panel, "限制范围").innerText(), stage === 3 ? "资料变更限制已解除" : "仅限制资料变更，不限制登录")
      if (screen === 2) assert.equal(await field(panel, "复核结论").innerText(), ["尚未提交", "等待授权复核", "退回补充，限制保留", "授权复核通过 · AUDIT-DEMO-004"][stage])
      if (screen === 3) {
        assert.equal(await field(panel, "资金状态").innerText(), "正常 · 本例无资金限制")
        const profile = await field(panel, "资料申请").innerText()
        assert(profile.includes(stage === 3 ? "新资料已生效" : "原资料仍生效"))
      }
    }
  }
  for (const tabs of [stages, screens]) {
    await tabs.first().focus()
    for (const [key, selected] of [["ArrowLeft", 3], ["Home", 0], ["End", 3], ["ArrowRight", 0]]) {
      await page.keyboard.press(key)
      assert.equal(await tabs.nth(selected).getAttribute("aria-selected"), "true")
      assert.equal(await tabs.nth(selected).evaluate((node) => node === document.activeElement), true)
    }
  }
  assert.equal(await section.getByRole("navigation", { name: "恢复案例关联材料" }).getByRole("link").count(), 2)
  assert.notEqual(await page.locator("#article-details").getAttribute("open"), null)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  await section.screenshot({ path: `/tmp/account-recovery-${width}.png` })
  await page.reload({ waitUntil: "networkidle" })
  await section.waitFor()
  assert.equal(await stages.first().getAttribute("aria-selected"), "true")
  await page.goto(`${base}/search?q=ACC-DEMO-20261026-001`, { waitUntil: "networkidle" })
  await page.locator(`main a[href="${prefix}/articles/member-account-states"]`).waitFor()
  await page.goto(`${base}/articles/wallet-payment-reconciliation#reconciliation-case`, { waitUntil: "networkidle" })
  await page.getByRole("region", { name: "充值与对账完整案例", exact: true }).waitFor()
  assert.notEqual(await page.locator("#article-details").getAttribute("open"), null)
  console.log(`PASS ${width}px: 16 account recovery screen/state combinations, independent financial/session/profile states, timeline, keyboard, reload, identifier search and existing reconciliation case`)
}
