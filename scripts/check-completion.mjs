import assert from "node:assert/strict"
import fs from "node:fs"

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

export async function checkMobileCases(page, base, prefix, width) {
  await page.goto(`${base}/cases/bm-optimization#bm-mobile-prototype`, { waitUntil: "networkidle" })
  const bm = page.getByRole("region", { name: "BM手机交互原型", exact: true })
  const sport = bm.locator('[aria-label="比赛分类"]')
  const status = bm.locator('[aria-label="比赛状态筛选"]')
  for (const [category, counts] of [["全部", [4, 2, 1, 1]], ["足球", [2, 1, 1, 0]], ["篮球", [2, 1, 0, 1]]]) {
    await sport.getByRole("button", { name: category, exact: true }).click()
    for (const [index, state] of ["全部", "进行中", "未开始", "已结束"].entries()) {
      await status.getByRole("button", { name: state, exact: true }).click()
      assert.equal(await bm.getByRole("article").count(), counts[index])
    }
  }
  await sport.getByRole("button", { name: "足球", exact: true }).click()
  assert((await bm.getByRole("status").innerText()).includes("没有匹配记录"))
  await bm.getByRole("button", { name: "清除筛选", exact: true }).click()
  assert.equal(await bm.getByRole("article").count(), 4)
  await sport.getByRole("button", { name: "足球", exact: true }).click()
  await status.getByRole("button", { name: "未开始", exact: true }).click()
  await bm.getByRole("button", { name: "查看 MATCH-DEMO-002 详情", exact: true }).click()
  assert((await bm.innerText()).includes("不能用0:0代替尚无结果"))
  await bm.getByRole("button", { name: "核对当前记录", exact: true }).click()
  assert((await bm.getByRole("status").innerText()).includes("MATCH-DEMO-002"))
  await bm.getByRole("button", { name: "← 返回列表", exact: true }).click()
  assert.equal(await sport.getByRole("button", { name: "足球", exact: true }).getAttribute("aria-pressed"), "true")
  assert.equal(await status.getByRole("button", { name: "未开始", exact: true }).getAttribute("aria-pressed"), "true")
  assert.equal(await bm.getByRole("article").count(), 1)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  await bm.screenshot({ path: `/tmp/bm-prototype-${width}.png` })

  await page.goto(`${base}/cases/competitor-analysis#u8-profile-prototype`, { waitUntil: "networkidle" })
  const u8 = page.getByRole("region", { name: "U8个人中心交互原型", exact: true })
  const groups = u8.locator('[aria-label="个人中心分组"]')
  const states = u8.locator('[aria-label="个人中心状态选择"]')
  const content = u8.locator('[aria-label="个人中心内容"]')
  for (const group of ["账号", "资产", "订单", "服务"]) {
    await groups.getByRole("button", { name: group, exact: true }).click()
    for (const state of ["正常", "加载中", "空结果", "失败", "受限"]) {
      await states.getByRole("button", { name: state, exact: true }).click()
      if (state === "加载中") {
        assert.equal(await content.getAttribute("aria-busy"), "true")
        assert((await content.innerText()).includes("不将加载中的数据显示为余额0或无订单"))
      } else assert.equal(await content.getAttribute("aria-busy"), "false")
      if (state === "失败") {
        assert((await content.getByRole("alert").innerText()).includes(group))
        await content.getByRole("button", { name: "重新加载", exact: true }).click()
        assert.equal(await states.getByRole("button", { name: "正常", exact: true }).getAttribute("aria-pressed"), "true")
        assert.equal(await groups.getByRole("button", { name: group, exact: true }).getAttribute("aria-pressed"), "true")
      }
      if (state === "受限") assert((await content.innerText()).includes("不直接说明资金冻结"))
    }
  }
  await states.getByRole("button", { name: "正常", exact: true }).click()
  await groups.getByRole("button", { name: "资产", exact: true }).click()
  for (const amount of ["1,260.00", "180.00", "1,440.00"]) assert((await content.innerText()).includes(amount))
  await groups.getByRole("button", { name: "订单", exact: true }).click()
  await content.getByRole("button", { name: /ORD-DEMO-002/ }).click()
  assert((await content.getByRole("status").innerText()).includes("不重复发起"))
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  await u8.screenshot({ path: `/tmp/u8-prototype-${width}.png` })

  const manifest = JSON.parse(fs.readFileSync("public/images/official-comparison/manifest.json", "utf8"))
  assert.equal(manifest.length, 6)
  await page.goto(`${base}/cases/white-label-official#official-responsive-comparison`, { waitUntil: "networkidle" })
  const comparison = page.getByRole("region", { name: "官网桌面与手机对照", exact: true })
  const chooser = comparison.locator('[aria-label="选择官网对照模块"]')
  for (const name of ["服务展示", "页面结构", "咨询入口"]) {
    await chooser.getByRole("button", { name, exact: true }).click()
    assert.equal(await comparison.locator("img").count(), 2)
    for (const img of await comparison.locator("img").all()) {
      await img.scrollIntoViewIfNeeded()
      await img.evaluate((node) => node.decode())
      const info = await img.evaluate((node) => ({ src: node.currentSrc, width: node.naturalWidth, height: node.naturalHeight }))
      const record = manifest.find((item) => info.src.endsWith(item.file))
      assert(record)
      assert.equal(info.width, record.width)
      assert.equal(info.height, record.height)
    }
    await comparison.locator("article button").last().click()
    const dialog = page.getByRole("dialog")
    await dialog.getByRole("heading", { name: `${name} · 手机390`, exact: true }).waitFor()
    const viewport = dialog.locator('[aria-label="图片查看区域"]')
    const image = dialog.locator("img").first()
    assert((await image.evaluate((node) => node.naturalHeight)) > 900)
    await page.keyboard.press("Escape")
    await dialog.waitFor({ state: "hidden" })
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  console.log(`PASS ${width}px: BM 12 filters, empty/reset/detail/back/footer; U8 20 group/state combinations, retry/assets/orders; six real official captures and mobile image viewing`)
}
