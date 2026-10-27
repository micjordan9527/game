import assert from "node:assert/strict"
import fs from "node:fs"
import ts from "typescript"

export async function checkBusinessQuestions(page, base, prefix, width) {
  const js = ts.transpileModule(fs.readFileSync("src/data/businessQuestions.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  const { businessQuestions } = await import("data:text/javascript;base64," + Buffer.from(js).toString("base64"))
  const section = page.getByRole("region", { name: "按问题找入口", exact: true })
  assert.equal(await section.locator("article").count(), 6)
  const nav = section.getByRole("navigation", { name: "业务问题定位", exact: true })
  for (const item of businessQuestions) {
    const card = section.locator("#question-" + item.id)
    assert.equal(await card.locator("ol > li").count(), 3)
    assert((await card.innerText()).includes(item.boundary))
    for (const link of [item.demo, item.article]) assert.equal(await card.locator(`a[href="${prefix}${link.href}"]`).count(), 1)
    await nav.locator(`a[href="#question-${item.id}"]`).click()
    await page.waitForFunction((id) => { const top = document.getElementById(id)?.getBoundingClientRect().top; return top >= 65 && top <= 120 }, "question-" + item.id)
  }
  await page.screenshot({ path: `/tmp/business-questions-${width}.png` })
  for (const item of [businessQuestions[0], businessQuestions.at(-1)]) {
    await page.goto(base + "/search?q=" + encodeURIComponent(item.keywords[0]) + "&type=" + encodeURIComponent("知识栏目"), { waitUntil: "networkidle" })
    const href = `${prefix}/updates/demonstrations#question-${item.id}`
    const hit = page.locator(`main a[href="${href}"]`)
    await hit.waitFor()
    const top = await page.evaluate(() => scrollY)
    await hit.click()
    await page.locator("#question-" + item.id).waitFor()
    await page.goBack({ waitUntil: "networkidle" })
    await hit.waitFor()
    assert.equal(new URL(page.url()).searchParams.get("q"), item.keywords[0])
    assert.equal(new URL(page.url()).searchParams.get("type"), "知识栏目")
    await page.waitForFunction((saved) => Math.abs(scrollY - saved) < 8, top)
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  console.log(`PASS ${width}px: six business questions, 18 diagnostic steps, 12 direct links, all question anchors and search/return`)
}
