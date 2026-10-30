import assert from "node:assert/strict"

export async function checkTgCaseDetails(page, base, prefix, width) {
  await page.goto(base + "/articles/tg-message-media#tg-case-details", { waitUntil: "networkidle" })
  await page.getByRole("heading", { level: 1, name: "TG频道推送：图片与视频展示", exact: true }).waitFor()
  for (const id of ["tg-case-details", "tg-output-examples", "tg-check-points", "article-details"]) {
    const alias = page.locator("#" + id)
    assert.equal(await alias.count(), 1)
    assert.equal(await alias.getAttribute("aria-hidden"), "true")
    assert(await alias.evaluate((node) => !node.textContent.trim() && !node.querySelector("h1,h2,h3,img,svg,video,details")), "Historical links remain empty anchors")
  }
  assert.equal(await page.getByRole("heading", { name: "TG推送截图", exact: true }).count(), 0)
  assert.equal(await page.getByRole("region", { name: "TG推送完整截图", exact: true }).count(), 0)
  assert.equal(await page.locator("details#article-details, main #article-content").count(), 0)
  assert.equal(await page.locator("#tg-message-demo video").count(), 2)

  const navigation = page.getByRole("navigation", { name: "本文阅读入口", exact: true })
  assert.deepEqual((await navigation.getByRole("link").allTextContents()).map((text) => text.trim()), ["视频", "相关资料"])
  const materials = page.locator("#tg-materials")
  const links = materials.locator("a")
  assert.equal(await links.count(), 2, "Only the requested related links remain")
  assert.deepEqual((await links.allTextContents()).map((text) => text.trim()), ["查看TG素材规范 →", "查看后台公告发布演示 →"])
  assert.equal(await links.nth(0).getAttribute("href"), `${prefix}/design/material-standards?module=tg-assets`)
  assert.equal(await links.nth(1).getAttribute("href"), `${prefix}/articles/content-publication-versions#publication-demo`)
  assert.equal(await materials.locator("[download]").count(), 0)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)

  await links.nth(1).click()
  await page.waitForURL((url) => url.pathname === prefix + "/articles/content-publication-versions" && url.hash === "#publication-demo")
  await page.getByRole("heading", { name: "公告审核与发布演示", exact: true }).waitFor()
  await page.goto(base + "/articles/form-validation-submit-feedback", { waitUntil: "networkidle" })
  await page.locator("#article-details[open] #article-content").waitFor()
  console.log(`PASS TG related links ${width}px: screenshot module and downloads removed, two related links, announcement demo destination and other article details`)
}
