import assert from "node:assert/strict"
import fs from "node:fs"
import ts from "typescript"

export async function checkRoleDirectories(page, base, prefix, width) {
  const files = ["src/data/articles.ts", "src/data/categories.ts", "src/data/workRoles.ts", "src/lib/role-identities.ts", "src/lib/work-audiences.ts", "src/data/roleGroups.ts"]
  const source = files.map((file) => fs.readFileSync(file, "utf8").replace(/^import .*$/gm, "")).join("\n")
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  const { articles, categories, roleDirectories, resourceAudiences, getRoleIdentity } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"))
  const expected = (audience, tag) => articles.filter((item) => resourceAudiences("/articles/" + item.slug, item.audience).includes(audience) && (!tag || item.tags.includes(tag)))
  const directory = (id) => page.locator(`[data-role-directory="${id}"]`)
  const paths = async (links) => (await links.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")))).map((href) => new URL(href, base).pathname)
  const expectedPaths = (items) => items.map((item) => prefix + "/articles/" + item.slug).sort()
  const assertSet = async (locator, items) => {
    const actual = await paths(locator.locator("article a"))
    assert.deepEqual(actual.slice().sort(), expectedPaths(items), "The directory retains its exact role membership")
    assert.equal(new Set(actual).size, actual.length, "Each article appears once within a role")
  }
  const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, page.url())
  const assertMobileFirstCover = async () => {
    if (width >= 768) return
    assert.equal(await page.locator("details[data-role-picker]").evaluate((node) => node.open), false, "The mobile role picker is closed on a default visit")
    const image = page.locator("#article-results article img").first()
    await image.waitFor()
    const box = await image.boundingBox()
    assert(box.y >= 0 && box.y < 900, `A cover starts in the first mobile viewport: ${page.url()} (y=${box.y})`)
  }
  const headingTop = async (heading) => {
    await heading.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    return page.evaluate(() => scrollY)
  }
  const pager = () => page.getByRole("navigation", { name: "连续阅读", exact: true })
  const breadcrumb = () => page.getByRole("navigation", { name: "文章位置", exact: true })
  const roleReturn = () => pager().getByRole("link", { name: /返回角色目录/ }).first()
  const choose = async (id, slug) => {
    await directory(id).locator(`[data-role-group-filter="${slug}"]`).click()
    await directory(id).locator(`[data-role-group-filter="${slug}"][aria-pressed="true"]`).waitFor()
  }

  for (const role of roleDirectories) {
    const mapped = [...role.groups.flatMap((group) => group.entries), ...role.references]
    assert.deepEqual(mapped.map((entry) => entry.slug).sort(), expected(role.audience).map((article) => article.slug).sort(), role.id + ": one primary group or reference per actual role article")
    assert.equal(new Set(mapped.map((entry) => entry.slug)).size, mapped.length)
    await page.goto(base + "/articles?role=" + role.id, { waitUntil: "networkidle" })
    await directory(role.id).waitFor()
    if (role.id === "product") await assertMobileFirstCover()
    await assertSet(directory(role.id), expected(role.audience))
    assert.equal(await directory(role.id).locator("details[data-role-references]").count(), 0, "References use ordinary visible cards")
    for (const card of await directory(role.id).locator("[data-role-references] article").all()) assert(await card.isVisible())
    assert.deepEqual(await directory(role.id).locator("[data-role-group]").evaluateAll((nodes) => nodes.map((node) => node.dataset.roleGroup)), role.groups.filter((group) => group.entries.length).map((group) => group.slug))
    for (const group of role.groups.filter((item) => item.entries.length)) assert.deepEqual(await paths(directory(role.id).locator(`[data-role-group="${group.slug}"] article a`)), group.entries.map((entry) => prefix + "/articles/" + entry.slug))
    await noOverflow()
  }

  for (const [id, count] of [["product", 8], ["development", 5], ["test", 5]]) {
    const role = roleDirectories.find((item) => item.id === id)
    assert.equal(role.groups.length, count)
    const group = role.groups.find((item) => item.entries.filter((entry) => !entry.reference).length >= 2)
    const ordered = group.entries.filter((entry) => !entry.reference)
    await page.goto(base + "/articles?role=" + id, { waitUntil: "networkidle" })
    await choose(id, group.slug)
    await page.reload({ waitUntil: "networkidle" })
    await directory(id).locator(`[data-role-group-filter="${group.slug}"][aria-pressed="true"]`).waitFor()
    await assertSet(directory(id), group.entries.map((entry) => articles.find((item) => item.slug === entry.slug)))
    const tags = page.locator("details[data-article-tags]")
    if (!await tags.evaluate((node) => node.open)) await tags.locator("summary").click()
    const picker = page.locator("details[data-role-picker]"), checkOpenPicker = width < 768 && id === "product"
    if (checkOpenPicker && !await picker.evaluate((node) => node.open)) await picker.locator("summary").click()
    const heading = directory(id).locator(`article a[href*="/articles/${ordered[0].slug}?"] h3`), top = await headingTop(heading)
    await heading.click()
    await page.waitForURL((url) => url.pathname === prefix + "/articles/" + ordered[0].slug && url.searchParams.get("workRole") === id && url.searchParams.get("roleGroup") === group.slug)
    assert((await breadcrumb().innerText()).includes(role.title))
    assert((await breadcrumb().innerText()).includes(group.title))
    await page.locator("#article-details[open]").waitFor()
    assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute("href")).pathname, prefix + "/articles/" + ordered[0].slug)
    if (width < 1280) await page.locator("body > header").getByRole("button", { name: "打开导航", exact: true }).click()
    const menu = width < 1280 ? page.getByRole("dialog", { name: "知识库导航", exact: true }) : page.getByRole("navigation", { name: "知识库导航", exact: true })
    const currentLinks = await menu.locator('[data-context-navigation] a[aria-current="page"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")))
    assert(currentLinks.some((href) => { const u = new URL(href, base); return u.pathname === prefix + "/articles/" + ordered[0].slug && u.searchParams.get("workRole") === id }), "The sidebar keeps the current role reading context")
    if (width < 1280) await page.keyboard.press("Escape")
    assert((await pager().innerText()).includes(`第 1 / ${ordered.length} 篇`))
    await pager().getByRole("link").filter({ hasText: "下一篇" }).click()
    await page.waitForURL((url) => url.pathname === prefix + "/articles/" + ordered[1].slug && url.searchParams.get("workRole") === id)
    assert((await pager().innerText()).includes(`第 2 / ${ordered.length} 篇`))
    await roleReturn().click()
    await directory(id).waitFor()
    await page.waitForFunction((top) => Math.abs(scrollY - top) < 8 && document.querySelector("details[data-article-tags]")?.open, top)
    if (checkOpenPicker) {
      assert.equal(await picker.evaluate((node) => node.open), true, "An explicitly opened role picker survives article return")
      await picker.locator("summary").click()
    }
    assert.equal(new URL(page.url()).searchParams.get("group"), group.slug)
    await noOverflow()
    if (id === "product") await page.screenshot({ path: `/tmp/product-role-directory-${width}.png` })
    await page.goto(base + "/articles/" + ordered[0].slug, { waitUntil: "networkidle" })
    const original = articles.find((item) => item.slug === ordered[0].slug), category = categories.find((item) => item.slug === original.category)
    await breadcrumb().getByRole("link", { name: category.title, exact: true }).waitFor()
    assert.equal(await pager().getByRole("link", { name: /返回角色目录/ }).count(), 0, "A direct article visit keeps its original topic")
  }

  const product = roleDirectories.find((item) => item.id === "product")
  const tag = "会员", matching = expected(product.audience, tag)
  assert(matching.length > 0 && matching.length < expected(product.audience).length)
  await page.goto(base + "/articles?role=product&group=" + product.groups[0].slug, { waitUntil: "networkidle" })
  const tags = page.locator("details[data-article-tags]")
  if (!await tags.evaluate((node) => node.open)) await tags.locator("summary").click()
  await page.getByRole("group", { name: "标签筛选", exact: true }).locator(`button[data-filter-value="${tag}"]`).click()
  await page.waitForURL((url) => url.searchParams.get("tag") === tag && !url.searchParams.has("group"))
  await assertSet(directory("product"), matching)
  assert.deepEqual(await directory("product").locator("[data-role-group]").evaluateAll((nodes) => nodes.map((node) => node.dataset.roleGroup)), product.groups.filter((group) => group.entries.some((entry) => matching.some((article) => article.slug === entry.slug))).map((group) => group.slug), "Tag filtering hides empty groups")
  const matchingGroup = product.groups.find((group) => group.entries.some((entry) => matching.some((article) => article.slug === entry.slug)))
  await choose("product", matchingGroup.slug)
  await page.reload({ waitUntil: "networkidle" })
  await assertSet(directory("product"), matching.filter((article) => matchingGroup.entries.some((entry) => entry.slug === article.slug)))
  if (!await tags.evaluate((node) => node.open)) await tags.locator("summary").click()
  const taggedHeading = directory("product").locator("article h3").first(), taggedTop = await headingTop(taggedHeading)
  await taggedHeading.click()
  await page.waitForURL((url) => url.pathname.startsWith(prefix + "/articles/") && url.searchParams.get("workRole") === "product")
  await roleReturn().click(); await directory("product").waitFor()
  await page.waitForFunction((top) => Math.abs(scrollY - top) < 8 && document.querySelector("details[data-article-tags]")?.open, taggedTop)
  let returned = new URL(page.url())
  assert.equal(returned.searchParams.get("tag"), tag); assert.equal(returned.searchParams.get("group"), matchingGroup.slug)
  const backHeading = directory("product").locator("article h3").first(), backTop = await headingTop(backHeading)
  await backHeading.click()
  await page.waitForURL((url) => url.pathname.startsWith(prefix + "/articles/") && url.searchParams.get("workRole") === "product")
  await roleReturn().waitFor()
  await page.goBack({ waitUntil: "networkidle" }); await directory("product").waitFor()
  await page.waitForFunction((top) => Math.abs(scrollY - top) < 8 && document.querySelector("details[data-article-tags]")?.open, backTop)

  await page.goto(base + "/articles?role=product", { waitUntil: "networkidle" })
  const reference = directory("product").locator("[data-role-references] article h3").first(), referenceTop = await headingTop(reference)
  await reference.click()
  await page.waitForURL((url) => url.pathname.startsWith(prefix + "/articles/") && url.searchParams.get("workRole") === "product")
  await roleReturn().waitFor()
  assert((await pager().innerText()).includes("相关参考"))
  assert.equal(await pager().getByRole("link").filter({ hasText: "下一篇" }).count(), 0)
  await roleReturn().click(); await directory("product").waitFor()
  await page.waitForFunction((top) => Math.abs(scrollY - top) < 8, referenceTop)

  for (const alias of ["老板", "管理者", "boss", "manager"]) {
    await page.goto(base + "/articles?role=" + encodeURIComponent(alias), { waitUntil: "networkidle" })
    await directory("management").waitFor(); await assertSet(directory("management"), expected("经营管理"))
    assert.equal(await page.getByRole("group", { name: "角色筛选", exact: true, includeHidden: true }).locator('[data-filter-value="经营管理"]').getAttribute("aria-pressed"), "true")
    assert.equal(new URL(page.url()).searchParams.get("role"), alias, "Legacy aliases do not discard query/history state")
  }
  for (const [role, aliases] of [["新人", ["newcomer", "行业新人"]], ["交互", ["interaction", "交互"]]]) {
    for (const alias of aliases) {
      await page.goto(base + "/articles?role=" + encodeURIComponent(alias), { waitUntil: "networkidle" })
      await page.locator(`#article-results[data-selected-role="${role}"]`).waitFor()
      await assertSet(page.locator("#article-results"), expected(role))
      assert.equal(await page.locator(`[data-reading-entry="${role}"]`).getAttribute("aria-pressed"), "true")
      assert.equal(await page.getByRole("group", { name: "角色筛选", exact: true, includeHidden: true }).locator(`[data-filter-value="${role}"]`).count(), 0)
      assert((await page.locator("[data-library-summary]").innerText()).includes(getRoleIdentity(role).label))
      if (role === "交互") {
        await page.locator("[data-design-directory]").waitFor()
        await assertMobileFirstCover()
        for (const slug of ["mobile-page-layout", "member-account-states"]) assert.equal(await page.locator(`#article-results article a[href*="/articles/${slug}?"]`).count(), 1, "The shared interaction direction retains cross-topic references")
      }
      if (width < 768 && role === "新人" && alias === "newcomer") {
        const picker = page.locator("details[data-role-picker]")
        if (!await picker.evaluate((node) => node.open)) await picker.locator("summary").click()
        await page.locator('[data-reading-entry="交互"]').click()
        await page.locator('#article-results[data-selected-role="交互"]').waitFor()
        await page.locator("[data-design-directory]").waitFor()
        await assertSet(page.locator("#article-results"), expected("交互"))
      }
      await noOverflow()
    }
  }
  await page.goto(base + "/product", { waitUntil: "networkidle" })
  await directory("product").waitFor(); await assertSet(directory("product"), expected("产品"))
  assert.equal(await directory("product").locator("[data-role-group-filter]").count(), 9, "The product topic and product role share the eight-domain directory")
  console.log(`PASS role directories ${width}px: exact role sets and category order, product/development/testing groups, canonical/shared/legacy links, role-context breadcrumbs/sidebar/continuous reading, direct-topic fallback, tag/group/disclosure/scroll return, visible references and normalized management/newcomer/interaction entries`)
}
