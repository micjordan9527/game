import assert from "node:assert/strict"
import fs from "node:fs"
import ts from "typescript"
import matter from "gray-matter"

async function readModule(file) {
  const js = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  return import("data:text/javascript;base64," + Buffer.from(js).toString("base64"))
}
export async function checkEvidenceAi(page, base, prefix, width) {
  const { aiWorkflows } = await readModule("src/data/aiWorkflowLibrary.ts")
  const evidence = await readModule("src/data/acceptanceEvidence.ts")
  const { articles } = await readModule("src/data/articles.ts")
  const { data: meta, content } = matter(fs.readFileSync("content/articles/launch-checklist.md", "utf8"))
  const entry = articles.find((x) => x.slug === "launch-checklist")
  for (const key of ["title", "description", "category", "tags", "audience", "difficulty"]) assert.deepEqual(meta[key], entry[key])
  assert.equal(meta.updatedAt.toISOString().slice(0, 10), entry.updatedAt)
  assert.equal(aiWorkflows.length, 2)
  for (const run of evidence.historicalChecks) {
    assert.equal(run.headSha, "aa1370b68a3944fcadd5cbc138746a5c3a667890")
    assert.equal(run.status, "completed"); assert.equal(run.conclusion, "success")
    assert.equal(new URL(run.href).pathname, `/micjordan9527/game/actions/runs/${run.id}`)
    assert(Date.parse(run.updatedAt) >= Date.parse(run.startedAt))
  }
  const checkGraphics = async () => {
    const frames = page.locator("[data-guide-frame]")
    assert.equal(await frames.count(), 4)
    const boxes = await frames.evaluateAll((nodes) => nodes.map((node) => {
      const r = node.getBoundingClientRect()
      const fonts = [...node.querySelectorAll("span,p,h3,h4,strong,dt,dd")].filter((item) => item.textContent.trim()).map((item) => parseFloat(getComputedStyle(item).fontSize))
      return { x: r.x, y: r.y, right: r.right, minFont: Math.min(...fonts) }
    }))
    for (const box of boxes) { assert(box.minFont >= 14); assert(box.x >= 0 && box.right <= width + 1) }
    if (width === 390) for (let i = 1; i < boxes.length; i++) assert(boxes[i].y > boxes[i - 1].y)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
    assert.equal(await frames.locator("button,input,select").count(), 0)
  }
  await page.goto(base + "/articles/launch-checklist#visual-guide", { waitUntil: "networkidle" })
  await page.locator("#article-details[open]").waitFor(); await checkGraphics()
  for (const match of content.matchAll(/^(#{2,3}) (.+)$/gm)) {
    const id = match[2].trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-")
    assert.equal(await page.locator(`[id="${id}"]`).count(), 1)
  }
  const panel = page.getByRole("region", { name: "验收证据对照", exact: true })
  await panel.locator('[data-evidence-record="missing"]').waitFor()
  assert((await panel.getByRole("status").innerText()).includes("未验证"))
  await panel.getByRole("button", { name: "v26已完成的历史检查", exact: true }).click()
  await panel.locator('[data-evidence-record="historical"]').waitFor()
  assert((await panel.getByRole("status").innerText()).includes("历史检查成功"))
  for (const run of evidence.historicalChecks) await panel.locator(`a[href="${run.href}"]`).waitFor()
  await panel.getByRole("button", { name: "复制当前证据记录", exact: true }).click()
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), evidence.acceptanceExampleText(1))
  assert((await panel.innerText()).includes("不表示已部署Netlify"))
  await panel.getByRole("button", { name: "只有按钮截图", exact: true }).click()
  assert((await panel.getByRole("status").innerText()).includes("不能判断"))
  await panel.getByRole("button", { name: "缺少实测记录", exact: true }).click()
  assert((await panel.getByRole("status").innerText()).includes("未验证"))
  await page.locator("#visual-guide [data-guide-frame]").last().screenshot({ path: `/tmp/acceptance-history-${width}.png`, style: "body > header { visibility: hidden !important; }" })

  const removed = ["requirements-state-matrix", "screenshot-case-description"]
  for (const slug of removed) {
    assert.equal(aiWorkflows.some((x) => x.slug === slug), false)
    assert.equal(fs.existsSync(`out/ai-workflows/${slug}.html`), false)
    assert.equal(fs.existsSync(`out/ai-workflows/${slug}/index.html`), false)
    const status = await page.evaluate(async (url) => (await fetch(url, { cache: "no-store" })).status, base + "/ai-workflows/" + slug)
    assert.equal(status, 404, "Deleted workflow no longer serves a page")
  }
  await page.goto(base + "/ai-workflows", { waitUntil: "networkidle" })
  assert.equal(await page.locator('main a[href^="' + prefix + '/ai-workflows/"]').count(), 2)
  for (const slug of removed) assert.equal(await page.locator(`a[href*="/ai-workflows/${slug}"]`).count(), 0)
  for (const slug of ["brand-visual-system", "ui-design-system"]) {
    await page.goto(base + "/ai-workflows/" + slug, { waitUntil: "networkidle" })
    const visual = page.getByRole("region", { name: "AI生成成果", exact: true })
    await visual.waitFor(); await page.locator("#workflow-process").waitFor()
    const img = visual.locator("img").first(); await img.scrollIntoViewIfNeeded(); await img.evaluate((node) => node.decode())
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  }
  for (const query of ["需求转字段与状态矩阵", "截图转案例说明"]) {
    await page.goto(base + "/search?q=" + encodeURIComponent(query) + "&type=" + encodeURIComponent("AI 工作流"), { waitUntil: "networkidle" })
    assert.equal(await page.locator('main a[href^="' + prefix + '/ai-workflows/"]').count(), 0, "Removed workflows are absent from search")
  }
  await page.goto(base + "/updates#v27", { waitUntil: "networkidle" })
  await page.locator("#v27[open]").waitFor()
  const history = page.locator("#v27")
  assert((await history.innerText()).includes("已于v28按要求删除"))
  for (const slug of removed) assert.equal(await page.locator(`a[href*="/ai-workflows/${slug}"]`).count(), 0)
  await page.goto(base + "/updates#v28", { waitUntil: "networkidle" })
  const current = JSON.parse(fs.readFileSync("src/data/releaseHistory.json", "utf8")).current.version
  if (current !== 28) await page.locator("#v28[open]").waitFor()
  const release = page.locator(current === 28 ? "#current-release" : "#v28")
  assert((await release.innerText()).includes("页面变化 2 项"))
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false)
  console.log(`PASS workflow removal ${width}px: deleted URLs return404, no exported pages/catalog/search/related/history links, original two visual workflows load, acceptance evidence remains usable and default-open, updated release record`)
}
