import assert from "node:assert/strict"

export async function checkHomepage(page, base, prefix, width) {
  await page.goto(base, { waitUntil: "networkidle" })
  assert.equal(await page.getByRole("heading", { level: 1 }).innerText(), "包网知识库")
  const cases = page.getByRole("region", { name: "精选案例", exact: true })
  const topics = page.getByRole("region", { name: "业务主题", exact: true })
  assert.deepEqual(
    await cases
      .locator(`a[href^="${prefix}/cases/"]`)
      .evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
    [`${prefix}/cases/admin-optimization`, `${prefix}/cases/bm-optimization`]
  )
  assert.equal(await page.getByRole("navigation", { name: "业务主题导航" }).getByRole("link").count(), 6)
  assert.equal(await page.getByRole("navigation", { name: "按角色浏览" }).getByRole("link").count(), 5)
  assert.equal(await page.getByRole("navigation", { name: "常用资料", exact: true }).getByRole("link").count(), 3)
  for (const title of ["功能图解", "AI 工作流"]) {
    const region = page.getByRole("region", { name: title, exact: true })
    assert.equal(await region.getByRole("heading", { level: 3 }).count(), 2, title)
  }
  const dates = await page
    .getByRole("region", { name: "最近更新", exact: true })
    .locator("time")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("datetime")))
  assert.equal(dates.length, 3)
  assert(dates.every((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)))
  assert.deepEqual(dates, [...dates].sort().reverse())
  const caseBox = await cases.boundingBox(),
    topicBox = await topics.boundingBox()
  if (width >= 1280) assert(caseBox.x < topicBox.x, "Desktop cases should be beside business topics")
  else assert(topicBox.y < caseBox.y, "Mobile business topics should precede cases")
  const visualTop = await cases
    .locator("img")
    .first()
    .evaluate((node) => Math.round(node.getBoundingClientRect().top))
  assert(visualTop < 760, `First homepage case starts too low at ${width}px: ${visualTop}px`)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  await page.screenshot({ path: `/tmp/knowledge-home-${width}.png` })

  const search = page.getByRole("search", { name: "首页搜索" })
  await search.getByRole("searchbox", { name: "搜索知识库", exact: true }).fill("钱包")
  await Promise.all([
    page.waitForURL((url) => url.pathname === `${prefix}/search` && url.searchParams.get("q") === "钱包"),
    search.getByRole("button", { name: "搜索", exact: true }).click(),
  ])
  await page.locator(`main a[href="${prefix}/articles/wallet-payment-reconciliation"]`).waitFor()
  await page.goBack({ waitUntil: "networkidle" })
  assert.equal(await page.getByRole("heading", { level: 1 }).innerText(), "包网知识库")
  console.log(
    `PASS homepage ${width}px: curated content, six topics, resource/role links, updates, layout, native search and return navigation; first case=${visualTop}px`
  )
}
