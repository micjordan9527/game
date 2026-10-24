import assert from "node:assert/strict"

async function downloadedText(download) {
  const stream = await download.createReadStream()
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks).toString("utf8")
}

export async function checkWorkTools(page, base, prefix, width) {
  const roles = [
    ["operation", "运营"],
    ["product", "产品"],
    ["interaction", "交互"],
    ["design", "设计"],
    ["development", "开发"],
  ]
  for (const [slug, title] of roles) {
    await page.goto(`${base}/roles/${slug}`, { waitUntil: "networkidle" })
    await page.getByRole("heading", { level: 1, name: `${title}精选` }).waitFor()
    assert.equal(
      await page.getByRole("navigation", { name: "角色资料筛选" }).locator('[aria-current="page"]').count(),
      1
    )
    assert.equal(await page.locator("main ol").count(), 0)
  }
  await page.goto(`${base}/articles`, { waitUntil: "networkidle" })
  await page.getByRole("button", { name: /^交互/ }).click()
  await page.locator(`main a[href="${prefix}/articles/member-account-states"]`).waitFor()
  await page.goto(`${base}/templates`, { waitUntil: "networkidle" })
  await page.getByRole("button", { name: "交互", exact: true }).click()
  await page.locator(`main a[href="${prefix}/templates/member-account-review"]`).first().waitFor()
  await page.goto(`${base}/search?q=${encodeURIComponent("交互")}`, { waitUntil: "networkidle" })
  await page.getByRole("button", { name: /^角色精选/ }).click()
  await page.locator(`main a[href="${prefix}/roles/interaction"]`).waitFor()

  const slug = "white-label-requirement-form"
  const key = `wg-template-draft:${slug}`
  const formUrl = `${base}/templates/${slug}`
  const brand = `测试项目 ${width}`
  const payment = "模拟环境\n覆盖重复通知与失败"
  await page.goto(formUrl, { waitUntil: "networkidle" })
  assert.equal(await page.getByLabel("品牌名称", { exact: true }).isVisible(), false)
  await openForm(page)
  await page.getByLabel("品牌名称", { exact: true }).fill(brand)
  await page.getByLabel("支付方式", { exact: true }).fill(payment)
  await page.reload({ waitUntil: "networkidle" })
  await openForm(page)
  assert.equal(await page.getByLabel("品牌名称", { exact: true }).inputValue(), brand)
  assert.equal(await page.getByLabel("支付方式", { exact: true }).inputValue(), payment)
  await page.getByText("已填写 2 / 15 项", { exact: true }).waitFor()
  const actions = page.getByRole("group", { name: "填写结果操作" })
  await actions.getByRole("button", { name: "复制填写结果", exact: true }).click()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  assert(copied.includes(brand) && copied.includes(payment) && copied.includes("未填写"))
  const downloadPromise = page.waitForEvent("download")
  await actions.getByRole("button", { name: "导出填写结果", exact: true }).click()
  assert.equal(await downloadedText(await downloadPromise), copied)
  await page.getByRole("button", { name: "复制模板", exact: true }).first().click()
  const blank = await page.evaluate(() => navigator.clipboard.readText())
  assert(blank.includes("- [ ] 品牌名称") && !blank.includes(brand))
  await page.getByRole("button", { name: "用示例补全空白", exact: true }).click()
  assert.equal(await page.getByLabel("品牌名称", { exact: true }).inputValue(), brand)
  await page.getByText("已填写 15 / 15 项", { exact: true }).waitFor()
  await actions.getByRole("button", { name: "清空草稿", exact: true }).click()
  await actions.getByRole("button", { name: "取消", exact: true }).click()
  assert.equal(await page.getByLabel("品牌名称", { exact: true }).inputValue(), brand)
  await actions.getByRole("button", { name: "清空草稿", exact: true }).click()
  await actions.getByRole("button", { name: "确认清空", exact: true }).click()
  assert.equal(await page.evaluate((key) => localStorage.getItem(key), key), null)
  await page.reload({ waitUntil: "networkidle" })
  await openForm(page)
  assert.equal(await page.getByLabel("品牌名称", { exact: true }).inputValue(), "")
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  if (width === 390) await page.screenshot({ path: "/tmp/knowledge-requirement-mobile.png", fullPage: true })

  await page.evaluate((key) => localStorage.setItem(key, "{invalid draft"), key)
  await page.reload({ waitUntil: "networkidle" })
  await openForm(page)
  await page.getByRole("status").filter({ hasText: "原记录已保留" }).waitFor()
  await page.getByLabel("品牌名称", { exact: true }).fill("可导出的临时内容")
  assert.equal(await page.evaluate((key) => localStorage.getItem(key), key), "{invalid draft")
  await actions.getByRole("button", { name: "清空草稿", exact: true }).click()
  await actions.getByRole("button", { name: "确认清空", exact: true }).click()
  await page.getByLabel("品牌名称", { exact: true }).fill(brand)
  await page.reload({ waitUntil: "networkidle" })
  await openForm(page)
  assert.equal(await page.getByLabel("品牌名称", { exact: true }).inputValue(), brand)
  console.log(
    `PASS work tools at ${width}px: five role collections, role filters/search, immediate draft restore, copy/export, sample merge, clear confirmation and damaged-draft recovery`
  )
}

export async function checkUnavailableStorage(context, base) {
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem", "removeItem"])
      Storage.prototype[method] = () => {
        throw new DOMException("Storage blocked", "SecurityError")
      }
  })
  await page.goto(`${base}/templates/white-label-requirement-form`, { waitUntil: "networkidle" })
  await openForm(page)
  await page.getByRole("status").filter({ hasText: "无法保存草稿" }).waitFor()
  await page.getByLabel("品牌名称", { exact: true }).fill("无存储时仍可导出")
  const actions = page.getByRole("group", { name: "填写结果操作" })
  const downloadPromise = page.waitForEvent("download")
  await actions.getByRole("button", { name: "导出填写结果", exact: true }).click()
  assert((await downloadedText(await downloadPromise)).includes("无存储时仍可导出"))
  assert.deepEqual(errors, [], "Browser errors with unavailable storage")
  await page.close()
  console.log("PASS draft export when browser storage is unavailable")
}

async function openForm(page) {
  if (!(await page.getByLabel("品牌名称", { exact: true }).isVisible()))
    await page.getByText("在线填写（可选）", { exact: true }).click()
}
