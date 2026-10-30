import assert from "node:assert/strict"

export async function checkInterfaceCovers(page, base, prefix, width) {
  const entries = [
    { slug: "mobile-page-layout", tag: "手机布局" },
    { slug: "admin-bulk-actions", tag: "批量操作" },
    { slug: "admin-filter-list-states", tag: "筛选" },
    { slug: "form-validation-submit-feedback", tag: "字段校验" },
  ]
  const cardFor = (slug) => page.locator("main article").filter({ has: page.locator(`a[href="${prefix}/articles/${slug}"], a[href^="${prefix}/articles/${slug}?"]`) })
  const checkOverflow = async () => {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, page.url())
  }
  const checkCover = async (slug) => {
    const card = cardFor(slug)
    assert.equal(await card.count(), 1, `Expected one card: ${slug}`)
    const image = card.locator("img")
    assert.equal(await image.count(), 1, `Expected a real cover: ${slug}`)
    await image.scrollIntoViewIfNeeded()
    await image.evaluate((node) => node.decode())
    assert.equal(await image.getAttribute("src"), `${prefix}/images/articles/${slug}-cover.jpg`)
    const state = await image.evaluate((node) => ({ complete: node.complete, width: node.naturalWidth, height: node.naturalHeight }))
    assert.deepEqual(state, { complete: true, width: 1600, height: 1000 }, slug)
    return card
  }

  await page.goto(base + "/articles", { waitUntil: "networkidle" })
  await page.locator('#article-results[data-selected-role="全部"][data-selected-tag="全部"]').waitFor()
  for (const { slug } of entries) {
    const card = await checkCover(slug)
    await card.screenshot({ path: `/tmp/interface-cover-${slug}-${width}.png`, style: "body > header { visibility: hidden !important; }" })
  }
  await checkOverflow()

  await page.goto(base + "/design", { waitUntil: "networkidle" })
  for (const { slug } of entries) await checkCover(slug)
  await checkOverflow()

  for (const { slug, tag } of entries) {
    await page.goto(base + "/articles?role=design&tag=" + encodeURIComponent(tag), { waitUntil: "networkidle" })
    const selected = `#article-results[data-selected-role="设计"][data-selected-tag="${tag}"]`
    await page.locator(selected).waitFor()
    await checkCover(slug)
    const details = page.locator("details[data-article-tags]")
    if (!(await details.evaluate((node) => node.open))) await details.locator("summary").click()
    const heading = cardFor(slug).locator("h3")
    await heading.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const top = await page.evaluate(() => scrollY)
    assert(top > 0, `Return-position check starts scrolled: ${slug}`)
    await checkOverflow()
    await heading.click()
    await page.waitForURL((url) => url.pathname === `${prefix}/articles/${slug}`)
    await page.locator("#article-details[open]").waitFor()
    await checkOverflow()
    await page.goBack({ waitUntil: "networkidle" })
    const returned = new URL(page.url())
    assert.equal(returned.pathname, prefix + "/articles")
    assert.equal(returned.searchParams.get("role"), "design")
    assert.equal(returned.searchParams.get("tag"), tag)
    await page.locator(selected).waitFor()
    assert.equal(await page.getByRole("group", { name: "角色筛选", exact: true, includeHidden: true }).locator('button[data-filter-value="设计"]').getAttribute("aria-pressed"), "true")
    assert.equal(await page.getByRole("group", { name: "标签筛选", exact: true }).locator(`button[data-filter-value="${tag}"]`).getAttribute("aria-pressed"), "true")
    await page.waitForFunction((top) => Math.abs(scrollY - top) < 8 && document.querySelector("details[data-article-tags]")?.open === true, top)
    await checkOverflow()
  }
  console.log(`PASS interface covers ${width}px: four loaded 1600×1000 JPGs in the library and design topic, role/tag/disclosure/scroll return, expanded article details and no horizontal overflow`)
}
