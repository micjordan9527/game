import assert from "node:assert/strict"

export async function checkMachineCover(page, base, prefix, width) {
  const articlePath = "/articles/electronic-gaming-machine"
  const coverPath = `${prefix}/images/articles/electronic-gaming-machine.svg`
  const tag = "电子游艺机"
  const cardFor = (slug) => page.locator(`main article`).filter({ has: page.locator(`a[href="${prefix}/articles/${slug}"]`) })
  const machineCard = () => cardFor("electronic-gaming-machine")
  const checkImage = async (card, source, expectedSize) => {
    assert.equal(await card.count(), 1, "Expected one article card")
    const image = card.locator("img")
    assert.equal(await image.count(), 1, "The card has a real image")
    await image.scrollIntoViewIfNeeded()
    await image.evaluate((node) => node.decode())
    assert.equal(await image.getAttribute("src"), source)
    const state = await image.evaluate((node) => ({ complete: node.complete, width: node.naturalWidth, height: node.naturalHeight }))
    assert(state.complete && state.width > 0 && state.height > 0, `Image loaded: ${source}`)
    if (expectedSize) assert.deepEqual([state.width, state.height], expectedSize)
    return image
  }
  const checkMachineCard = async () => {
    const card = machineCard()
    await checkImage(card, coverPath, [1600, 1000])
    for (const text of ["可交互", "7组部件 · 8步工作过程", "打开交互图解 →", "点击部件看作用，分步查看识钞、余额与出票。"]) {
      assert(await card.getByText(text, { exact: true }).isVisible(), text)
    }
    return card
  }

  await page.goto(base + "/articles?tag=" + encodeURIComponent(tag), { waitUntil: "networkidle" })
  await page.locator('#article-results[data-selected-role="全部"][data-selected-tag="电子游艺机"]').waitFor()
  const card = await checkMachineCard()
  await card.screenshot({ path: `/tmp/machine-cover-library-${width}.png`, style: "body > header { visibility: hidden !important; }" })

  await page.getByRole("group", { name: "角色筛选", exact: true }).locator('button[data-filter-value="产品"]').click()
  await page.waitForURL((url) => url.searchParams.get("role") === "product" && url.searchParams.get("tag") === tag)
  await page.locator('#article-results[data-selected-role="产品"][data-selected-tag="电子游艺机"]').waitFor()
  const details = page.locator("details[data-article-tags]")
  if (!(await details.evaluate((node) => node.open))) await details.locator("summary").click()
  const heading = machineCard().locator("h3")
  await heading.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const top = await page.evaluate(() => scrollY)
  assert(top > 0, "Return-position check starts at a scrolled reading position")
  await heading.click()
  await page.waitForURL((url) => url.pathname === prefix + articlePath)
  await page.locator("#machine-demo [data-machine-art]").waitFor()
  await page.locator("#article-details[open]").waitFor()
  await page.goBack({ waitUntil: "networkidle" })
  const returned = new URL(page.url())
  assert.equal(returned.pathname, prefix + "/articles")
  assert.equal(returned.searchParams.get("role"), "product")
  assert.equal(returned.searchParams.get("tag"), tag)
  await page.locator('#article-results[data-selected-role="产品"][data-selected-tag="电子游艺机"]').waitFor()
  assert.equal(await page.getByRole("group", { name: "角色筛选", exact: true }).locator('button[data-filter-value="产品"]').getAttribute("aria-pressed"), "true")
  await page.waitForFunction((top) => Math.abs(scrollY - top) < 8 && document.querySelector("details[data-article-tags]")?.open === true, top)

  await page.goto(base + "/industry", { waitUntil: "networkidle" })
  const industryCard = await checkMachineCard()
  await industryCard.screenshot({ path: `/tmp/machine-cover-industry-${width}.png`, style: "body > header { visibility: hidden !important; }" })
  const platform = cardFor("how-gambling-platform-works")
  await checkImage(platform, `${prefix}/images/articles/platform-ecosystem.avif`)
  assert(await platform.getByText("查看图解 →", { exact: true }).isVisible())
  assert.equal(await platform.getByText("可交互", { exact: true }).count(), 0)

  await page.goto(base + "/articles/how-gambling-platform-works", { waitUntil: "networkidle" })
  await page.locator("summary").filter({ hasText: /^相关术语与更多图解$/ }).click()
  await checkMachineCard()

  await page.goto(base + "/articles", { waitUntil: "networkidle" })
  await page.locator('#article-results[data-selected-role="全部"][data-selected-tag="全部"]').waitFor()
  const member = cardFor("member-account-states")
  await checkImage(member, `${prefix}/images/articles/member-account-overview.png`)
  assert(await member.getByText("查看图解 →", { exact: true }).isVisible())
  assert.equal(await member.getByText("可交互", { exact: true }).count(), 0)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  console.log(`PASS machine cover ${width}px: loaded 1600×1000 SVG, interactive labels/CTA, role+tag/disclosure/scroll return, industry and related-card reuse, existing AVIF/PNG covers`)
}
