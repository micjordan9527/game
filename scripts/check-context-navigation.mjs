import assert from "node:assert/strict"

export async function checkContextNavigation(page, base, prefix, width) {
  const contextMenu = async () => {
    if (width < 1280) {
      await page.locator("body > header").getByRole("button", { name: "打开导航", exact: true }).click()
      return page.getByRole("dialog", { name: "知识库导航", exact: true }).locator("[data-context-navigation]")
    }
    return page.locator("aside [data-context-navigation]")
  }
  const closeMenu = async () => {
    if (width < 1280) {
      await page.keyboard.press("Escape")
      await page.getByRole("dialog", { name: "知识库导航", exact: true }).waitFor({ state: "hidden" })
    }
  }
  const sectionActive = async (href) => {
    if (width < 1280) {
      const link = page.getByRole("navigation", { name: "移动端知识库导航", exact: true }).locator(`a[href="${prefix}${href}"]`).first()
      assert.notEqual(await link.getAttribute("aria-current"), null)
    } else assert.notEqual(await page.locator("body > header").locator(`a[href="${prefix}${href}"]`).getAttribute("aria-current"), null)
  }
  await page.goto(base, { waitUntil: "networkidle" })
  const homeMenu = await contextMenu()
  await homeMenu.locator('a[href$="#home-diagrams-title"]').click()
  await page.waitForFunction(() => {
    const target = document.getElementById("home-diagrams-title").getBoundingClientRect()
    return target.top >= 64 && target.top < innerHeight - 30
  })
  for (const [path, title, root] of [
    ["/cases/bm-optimization", "案例目录", "/cases"],
    ["/ai-workflows/brand-visual-system", "工作流目录", "/ai-workflows"],
    ["/templates/member-account-review", "模板目录", "/templates"],
  ]) {
    await page.goto(base + path, { waitUntil: "networkidle" })
    const menu = await contextMenu()
    assert((await menu.innerText()).includes(title))
    assert.equal(await menu.getByText("按主题浏览", { exact: true }).count(), 0)
    assert.equal(await menu.locator(`a[href="${prefix}${path}"][aria-current="page"]`).count(), 1)
    await sectionActive(root)
    await closeMenu()
  }
  await page.goto(base + "/articles", { waitUntil: "networkidle" })
  await page.getByRole("heading", { level: 1, name: "知识图解", exact: true }).waitFor()
  let menu = await contextMenu()
  assert.equal(await menu.getByText("按主题浏览", { exact: true }).count(), 1)
  const topics = menu.locator("section").filter({ has: page.getByRole("heading", { name: "按主题浏览", exact: true }) })
  assert.equal(await topics.locator("a").count(), 8)
  assert.equal(await menu.locator(`a[href="${prefix}/articles"]`).count(), 1)
  await menu.locator(`a[href="${prefix}/product"]`).click()
  await page.getByRole("heading", { level: 1, name: "产品设计", exact: true }).waitFor()
  if (width < 1280) await page.getByRole("dialog", { name: "知识库导航", exact: true }).waitFor({ state: "hidden" })
  menu = await contextMenu()
  await sectionActive("/articles")
  await closeMenu()
  // The product topic now opens its grouped directory. Check the original-topic
  // contract through a canonical article visit; role-context links have their own checks.
  await page.goto(base + "/articles/member-account-states", { waitUntil: "networkidle" })
  await page.locator("#article-details[open]").waitFor()
  const breadcrumb = page.getByRole("navigation", { name: "文章位置", exact: true })
  assert.equal(await breadcrumb.locator(`a[href="${prefix}/articles"]`).count(), 1)
  assert.equal(await breadcrumb.locator(`a[href="${prefix}/product"]`).count(), 1)
  assert((await breadcrumb.innerText()).includes("会员与账号状态"))
  await page.screenshot({ path: `/tmp/context-article-${width}.png` })
  menu = await contextMenu()
  assert.equal(await menu.locator(`a[href="${prefix}/product"][aria-current="location"]`).count(), 1)
  assert.equal(await menu.locator(`a[href="${prefix}/articles/member-account-states"][aria-current="page"]`).count(), 1)
  await sectionActive("/articles")
  await closeMenu()
  await breadcrumb.getByRole("link", { name: "产品设计", exact: true }).click()
  await page.waitForURL((url) => url.pathname === prefix + "/product")
  assert.equal(new URL(page.url()).pathname, prefix + "/product")
  await page.goBack({ waitUntil: "networkidle" })
  await page.getByRole("navigation", { name: "文章位置", exact: true }).getByRole("link", { name: "知识图解", exact: true }).click()
  await page.getByRole("heading", { level: 1, name: "知识图解", exact: true }).waitFor()

  for (const [path, link] of [["/sportsbook", "/sports/betting-explanation"], ["/design", "/design/prototypes"], ["/design/states", "/design/information"]]) {
    await page.goto(base + path, { waitUntil: "networkidle" })
    menu = await contextMenu()
    await sectionActive("/articles")
    await menu.locator(`a[href="${prefix}${link}"]`).waitFor()
    await closeMenu()
  }
  await page.goto(base + "/design/material-standards", { waitUntil: "networkidle" })
  assert.equal(await page.locator("aside [data-context-navigation]").count(), 0)
  if (width < 1280) {
    menu = await contextMenu()
    assert.equal(await menu.locator("section").count(), 0)
    await page.getByRole("dialog", { name: "知识库导航", exact: true }).getByRole("link", { name: "代理素材", exact: true }).waitFor()
  }
  await sectionActive("/design/material-standards")
  await closeMenu()
  await page.locator("[data-material-workspace]").waitFor()
  const materialFrame = page.frameLocator('iframe[title="代理素材规范 V1.86"]')
  await materialFrame.locator("#material-workspace-style").waitFor({ state: "attached" })
  if (width <= 800) {
    await materialFrame.getByRole("button", { name: "素材目录", exact: true }).click()
    await materialFrame.getByRole("button", { name: "品牌标识", exact: true }).click()
    await materialFrame.getByRole("button", { name: "品牌 Logo", exact: true }).click()
    await materialFrame.locator('.material-menu-toggle[aria-expanded="false"]').waitFor()
  }
  await page.goto(base + "/updates", { waitUntil: "networkidle" })
  assert.equal(await page.locator("aside [data-context-navigation]").count(), 0)
  if (width < 1280) {
    await contextMenu()
    assert.equal(await page.getByRole("dialog", { name: "知识库导航", exact: true }).getByRole("link", { name: "更新记录", exact: true }).count(), 0)
    await closeMenu()
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  console.log(`PASS navigation ${width}px: section directories, eight knowledge topics, article/category/library return, active states, sports/design entries and header-only updates`)
}
