import assert from "node:assert/strict"
import fs from "node:fs"
import ts from "typescript"

export async function checkRoleLibrary(page, base, prefix, width) {
  const source = ["src/data/articles.ts", "src/data/workRoles.ts", "src/lib/work-audiences.ts"].map((file) => fs.readFileSync(file, "utf8").replace(/^import .*$/gm, "")).join("\n")
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  const { articles, workRoles, resourceAudiences } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"))
  const expected = (role, tag = "全部") => articles.filter((item) => (role === "全部" || resourceAudiences("/articles/" + item.slug, item.audience).includes(role)) && (tag === "全部" || item.tags.includes(tag)))
  const verify = async (role, tag = "全部") => {
    const results = page.getByRole("region", { name: "文章列表", exact: true })
    await page.locator(`[aria-label="文章列表"][data-selected-role="${role}"][data-selected-tag="${tag}"]`).waitFor()
    const matches = expected(role, tag)
    assert.equal(await results.locator("article").count(), matches.length)
    assert((await results.locator("[data-library-summary]").innerText()).includes("角色：" + role))
    const hrefs = await results.locator("article a").evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    const expectedHrefs = matches.map((item) => prefix + "/articles/" + item.slug)
    if (role === "运营" || role === "设计") {
      assert.deepEqual(hrefs.map((href) => new URL(href, base).pathname).sort(), expectedHrefs.sort(), "Grouped directories and references retain the exact role article set")
      assert.equal(new Set(hrefs.map((href) => new URL(href, base).pathname)).size, matches.length)
    } else assert.deepEqual(hrefs, expectedHrefs)
    assert.equal(await page.getByRole("group", { name: "角色筛选", exact: true }).locator(`button[data-filter-value="${role}"]`).getAttribute("aria-pressed"), "true")
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
    return results
  }
  for (const role of workRoles) {
    await page.goto(base, { waitUntil: "networkidle" })
    await page.getByRole("navigation", { name: "按角色看图解", exact: true }).getByRole("link", { name: role.title, exact: true }).click()
    await page.waitForURL((url) => url.pathname === prefix + "/articles" && url.searchParams.get("role") === role.slug)
    await verify(role.title)
  }
  await page.screenshot({ path: `/tmp/role-library-${width}.png` })
  await page.goto(base + "/articles?role=product", { waitUntil: "networkidle" })
  await verify("产品")
  await page.locator("details[data-article-tags] > summary").click()
  await page.getByRole("group", { name: "标签筛选", exact: true }).locator('button[data-filter-value="会员"]').click()
  await page.waitForURL((url) => url.searchParams.get("tag") === "会员")
  await verify("产品", "会员")
  await page.goBack({ waitUntil: "networkidle" });await verify("产品")
  await page.goForward({ waitUntil: "networkidle" });await verify("产品", "会员")
  await page.reload({ waitUntil: "networkidle" });await verify("产品", "会员")
  const shared = await page.context().newPage()
  await shared.goto(page.url(), { waitUntil: "networkidle" })
  await shared.locator('[data-selected-role="产品"][data-selected-tag="会员"]').waitFor()
  assert.equal(await shared.locator('[aria-label="文章列表"] article').count(), expected("产品", "会员").length)
  await shared.close();await page.bringToFront()

  const returnFromArticle = async (role, tag, tagsOpen) => {
    const details = page.locator("details[data-article-tags]")
    if (await details.evaluate((node) => node.open) !== tagsOpen) await details.locator("summary").click()
    const results = await verify(role, tag)
    const heading = results.locator("article h3").last()
    await heading.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const top = await page.evaluate(() => scrollY)
    await heading.click()
    await page.locator("#article-details[open]").waitFor()
    await page.goBack({ waitUntil: "networkidle" })
    await verify(role, tag)
    await page.waitForFunction(({ top, tagsOpen }) => Math.abs(scrollY - top) < 8 && document.querySelector("details[data-article-tags]").open === tagsOpen, { top, tagsOpen })
  }
  await returnFromArticle("产品", "会员", true)
  await page.getByRole("group", { name: "标签筛选", exact: true }).locator('button[data-filter-value="全部"]').click()
  await returnFromArticle("产品", "全部", false)
  await page.getByRole("button", { name: "重置", exact: true }).click()
  await page.waitForURL((url) => !url.searchParams.has("role") && !url.searchParams.has("tag"))
  await verify("全部")
  await page.goto(base + "/articles?role=product&tag=" + encodeURIComponent("会员"), { waitUntil: "networkidle" })
  await verify("产品", "会员")
  let directory
  if (width < 1280) {
    await page.locator("body > header").getByRole("button", { name: "打开导航", exact: true }).click()
    directory = page.getByRole("dialog", { name: "知识库导航", exact: true })
  } else directory = page.getByRole("navigation", { name: "知识库导航", exact: true })
  await directory.locator(`[data-context-navigation] a[href="${prefix}/articles"]`).click()
  await page.waitForURL((url) => !url.searchParams.has("role") && !url.searchParams.has("tag"))
  await verify("全部")
  await page.goto(base + "/articles?role=" + encodeURIComponent("技术"), { waitUntil: "networkidle" });await verify("开发")
  await page.goto(base + "/articles?role=unknown&tag=unknown", { waitUntil: "networkidle" });await verify("全部")
  await page.goto(base + "/roles/design", { waitUntil: "networkidle" })
  await page.getByRole("heading", { level: 1, name: "设计精选", exact: true }).waitFor()
  await page.getByRole("link", { name: "查看设计的全部图解 →", exact: true }).click()
  await verify("设计")
  console.log(`PASS role library ${width}px: five homepage roles, exact article sets, combined URL filters, reload/sharing/history, expanded/collapsed filter return positions, reset/all-library, aliases and legacy collections`)
}
