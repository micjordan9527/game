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
  const data = await readModule("src/data/practicalWorkflows.ts")
  const evidence = await readModule("src/data/acceptanceEvidence.ts")
  const { articles } = await readModule("src/data/articles.ts")
  const { data: meta, content } = matter(fs.readFileSync("content/articles/launch-checklist.md", "utf8"))
  const entry = articles.find((x) => x.slug === "launch-checklist")
  for (const key of ["title", "description", "category", "tags", "audience", "difficulty"]) assert.deepEqual(meta[key], entry[key])
  assert.equal(meta.updatedAt.toISOString().slice(0, 10), entry.updatedAt)
  assert.equal(aiWorkflows.length, 4)
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

  for (const slug of ["requirements-state-matrix", "screenshot-case-description"]) {
    const workflow = aiWorkflows.find((x) => x.slug === slug)
    assert.equal(workflow.kind, "structured"); assert.equal(workflow.outputs.length, 0)
    const response = await page.goto(base + "/ai-workflows/" + slug, { waitUntil: "networkidle" })
    assert.equal(response.status(), 200)
    assert.equal(await page.locator("h1").innerText(), workflow.title)
    await checkGraphics(); await page.locator("#workflow-details[open]").waitFor()
    assert.equal(await page.getByRole("region", { name: "AI生成成果", exact: true }).count(), 0)
    const inputRegion = page.getByRole("region", { name: "预置示例输入", exact: true })
    const outputRegion = page.getByRole("region", { name: "预置示例输出", exact: true })
    const sample = slug === "requirements-state-matrix" ? data.requirementExample : data.screenshotExample
    const output = slug === "requirements-state-matrix" ? data.matrixExampleText() : data.screenshotCaseText
    await inputRegion.getByRole("button", { name: "复制示例输入", exact: true }).click()
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), sample)
    await outputRegion.getByRole("button", { name: "复制示例输出", exact: true }).click()
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), output)
    const originalOutput = await outputRegion.innerText()
    const builder = page.getByRole("region", { name: "工作流输入与提示词", exact: true })
    const textarea = builder.getByLabel("输入材料（仅修改待复制提示词）", { exact: true })
    const replacement = "自定义DEMO输入\n未提供的权限与效果不得推断。"
    await textarea.fill(replacement)
    assert((await builder.getByRole("status").innerText()).includes("本站没有生成新结果"))
    await builder.getByRole("button", { name: "复制含当前输入的提示词", exact: true }).click()
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), data.practicalPrompt(slug, replacement))
    assert.equal((await outputRegion.innerText()).replace("已复制", "复制示例输出"), originalOutput.replace("已复制", "复制示例输出"), "Editing input never masquerades as regenerated output")
    await builder.getByRole("button", { name: "恢复示例输入", exact: true }).click()
    assert.equal(await textarea.inputValue(), sample)
    await page.locator("#workflow-outputs [data-guide-frame]").first().screenshot({ path: `/tmp/practical-${slug}-${width}.png`, style: "body > header { visibility: hidden !important; }" })
    if (slug === "requirements-state-matrix") {
      assert((await outputRegion.innerText()).includes("S6 · 查询中"))
      assert((await outputRegion.innerText()).includes("待确认；不从R3自行补全"))
      await page.locator(`a[href="${prefix}/articles/admin-filter-list-states#list-demo"]`).waitFor()
    } else {
      for (const img of await page.locator("[data-guide-frame] img").all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate((node) => node.decode()); assert.equal(await img.evaluate((node) => node.naturalWidth), 1440) }
      await page.locator("#workflow-outputs [data-guide-frame]").nth(1).screenshot({ path: `/tmp/screenshot-export-crop-${width}.png`, style: "body > header { visibility: hidden !important; }" })
      const source = page.getByRole("region", { name: "截图输入参考组", exact: true })
      const trigger = source.getByRole("button", { name: /查看完整长图/ }).first()
      await trigger.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
      const top = await page.evaluate(() => scrollY); await trigger.click()
      const dialog = page.getByRole("dialog"); await dialog.waitFor()
      await dialog.getByRole("region", { name: "图片浏览区域", exact: true }).locator("img").evaluate((node) => node.decode())
      await page.keyboard.press("Escape"); await dialog.waitFor({ state: "hidden" })
      await page.waitForFunction((top) => Math.abs(scrollY - top) < 8, top)
      assert((await builder.innerText()).includes("还需附上"))
    }
  }
  await page.goto(base + "/ai-workflows", { waitUntil: "networkidle" })
  assert.equal(await page.locator('main a[href^="' + prefix + '/ai-workflows/"]').count(), 4)
  await page.getByRole("button", { name: "需求梳理", exact: true }).click()
  assert.equal(await page.locator('main a[href^="' + prefix + '/ai-workflows/"]').count(), 1)
  await page.getByLabel("搜索 AI 工作流", { exact: true }).fill("截图")
  await page.getByText("没有匹配的工作流，可以清除筛选重新查看。", { exact: true }).waitFor()
  await page.getByRole("button", { name: "清除筛选", exact: true }).click()
  await page.getByRole("button", { name: "案例整理", exact: true }).click()
  await page.locator(`main a[href="${prefix}/ai-workflows/screenshot-case-description"]`).waitFor()
  for (const slug of ["brand-visual-system", "ui-design-system"]) {
    await page.goto(base + "/ai-workflows/" + slug, { waitUntil: "networkidle" })
    const visual = page.getByRole("region", { name: "AI生成成果", exact: true })
    await visual.waitFor(); await page.locator("#workflow-process").waitFor()
    const img = visual.locator("img").first(); await img.scrollIntoViewIfNeeded(); await img.evaluate((node) => node.decode())
  }
  for (const [query, href, type] of [["验收证据", "/articles/launch-checklist", "文章"], ["需求转字段", "/ai-workflows/requirements-state-matrix", "AI 工作流"], ["截图转案例", "/ai-workflows/screenshot-case-description", "AI 工作流"]]) {
    await page.goto(base + "/search?q=" + encodeURIComponent(query) + "&type=" + encodeURIComponent(type), { waitUntil: "networkidle" })
    const result = page.locator(`main a[href="${prefix}${href}"]`); await result.scrollIntoViewIfNeeded()
    const top = await page.evaluate(() => scrollY); await result.click()
    await page.waitForURL((url) => url.pathname.replace(/\/$/, "") === prefix + href)
    await page.locator(href.startsWith("/articles/") ? "#article-details[open]" : "#workflow-details[open]").waitFor()
    await page.goBack({ waitUntil: "networkidle" }); assert.equal(new URL(page.url()).searchParams.get("q"), query); assert.equal(new URL(page.url()).searchParams.get("type"), type)
    await page.waitForFunction((top) => Math.abs(scrollY - top) < 8, top)
  }
  await page.goto(base + "/updates#v27", { waitUntil: "networkidle" })
  const current = JSON.parse(fs.readFileSync("src/data/releaseHistory.json", "utf8")).current.version
  if (current !== 27) await page.locator("#v27[open]").waitFor()
  const release = page.locator(current === 27 ? "#current-release" : "#v27")
  assert((await release.innerText()).includes("补充文章 1 篇 · 页面变化 2 项"))
  assert(!(await release.innerText()).includes("GPT 配图"))
  for (const href of ["/articles/launch-checklist#visual-guide", "/ai-workflows/requirements-state-matrix#workflow-outputs", "/ai-workflows/screenshot-case-description#workflow-outputs"]) await release.locator(`a[href="${prefix}${href}"]`).waitFor()
  console.log(`PASS evidence/AI ${width}px: 12 readable scenes, bound historical run metadata and unverified boundaries, evidence switching/copy, literal input/output/prompt clipboard bytes, changed-input warning with frozen example, screenshot crop/source/load/zoom/return, workflow filter/no-results, original visual workflows, search state/position, default-open and release counts`)
}
