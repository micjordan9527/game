import assert from "node:assert/strict"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright-core")

// Photograph existing pages and their actual states; retain their fields and values.
const entries = [
  { id: "admin-information-hierarchy", article: true, title: "后台页面的信息层级", subtitle: "同一条订单，比较信息堆叠与分层展示", href: "/articles/admin-information-hierarchy#visual-guide", selector: "#visual-guide [data-guide-frame] > div", indexes: [0, 1], labels: ["信息堆叠", "列表与详情分层"] },
  { id: "content-publication-versions", article: true, title: "公告与发布版本", subtitle: "发布范围、后台生效与前台可见分别核对", href: "/articles/content-publication-versions#visual-guide", selector: "#visual-guide [data-guide-frame] > div", indexes: [0, 3], labels: ["固定站点、语言与版本", "后台与前台版本对照"] },
  { id: "export-masking-audit", article: true, title: "数据导出与下载审计", subtitle: "固定筛选快照，查看文件状态与脱敏字段", href: "/articles/export-masking-audit#export-task-demo", selector: "[data-export-state]", action: "export", labels: ["生成后的任务与下载入口"] },
  { id: "brand-logo", title: "品牌Logo使用规范", subtitle: "查看标志规格与实际页面位置", href: "/design/material-standards?module=brand-logo", material: true, labels: ["标志规格", "实际页面预览"] },
  { id: "banner", title: "首页Banner素材规范", subtitle: "对照两端尺寸与导出要求", href: "/design/material-standards?module=banner", material: true, labels: ["H5 · 347 × 110", "PC · 1261 × 300"] },
  { id: "activity", title: "活动图素材规范", subtitle: "查看活动封面、详情图与使用位置", href: "/design/material-standards?module=activity-list", material: true, labels: ["活动图规格", "页面预览"] },
  { id: "information", title: "信息层级演示", subtitle: "默认信息、折叠内容与风险操作", href: "/design/information#hierarchy", selector: '[role="tabpanel"] section .mt-6.grid', labels: ["后台列表 · 三层信息展示"] },
  { id: "prototypes", title: "关键页面原型", subtitle: "钱包流水、关联订单与余额变化", href: "/design/prototypes#wallet", selector: "#wallet-ledger-prototype .mt-6.grid > div", indexes: [0, 1], labels: ["钱包流水详情", "摘要核对入口"] },
  { id: "states", title: "界面状态对照", subtitle: "结果、原因与下一步操作一起展示", href: "/design/states#state-feedback", selector: "#state-feedback .mt-6.grid > div", action: "states", labels: ["已受理", "未能提交"] },
  { id: "review", title: "界面优化图解", subtitle: "比较列表信息与金额记录的调整", href: "/design/review", selector: "main .mt-6.grid > section", indexes: [0, 2], labels: ["列表先呈现当前任务", "金额与记录保持相邻"] },
  { id: "components", title: "业务组件演示", subtitle: "状态、金额和关联记录怎样一起展示", href: "/design/information#component", selector: '[role="tabpanel"] section .mt-6.grid > div', action: "components", labels: ["订单状态标签", "钱包金额与余额"] },
]
const root = path.resolve("out"), output = path.resolve("public/images/design-directory")
fs.mkdirSync(output, { recursive: true })
const types = { ".html": "text/html", ".txt": "text/x-component", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".mp4": "video/mp4" }
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://localhost"), name = path.resolve(root, "." + decodeURIComponent(u.pathname))
  if (name !== root && !name.startsWith(root + path.sep)) return res.writeHead(404).end()
  const file = [name, name + ".html", path.join(name, "index.html")].find((f) => fs.existsSync(f) && fs.statSync(f).isFile())
  if (!file) return res.writeHead(404).end()
  res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" }); res.end(fs.readFileSync(file))
})
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
const base = `http://127.0.0.1:${server.address().port}`
let browser
const manifestPath = path.join(output, "manifest.json")
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : []
const selected = process.env.COVER_IDS?.split(",")
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] })
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
  await context.route("**/*", (route) => new URL(route.request().url()).origin === base || route.request().url().startsWith("data:") ? route.continue() : route.abort())
  const page = await context.newPage(), canvas = await context.newPage()
  for (const entry of entries) {
    if (selected && !selected.includes(entry.id)) continue
    const module = entry.material ? new URL(entry.href, base).searchParams.get("module") : null
    const capturedFrom = module ? `/case-assets/material-standards/index.html#${module}` : entry.href
    await page.goto(base + capturedFrom, { waitUntil: "networkidle" })
    await page.addStyleTag({ content: "body > header { visibility:hidden!important; }" })
    await page.evaluate(() => document.fonts.ready)
    const scenes = []
    const take = async (locator) => {
      await locator.waitFor()
      await locator.evaluate(async (node) => { await Promise.all([...node.querySelectorAll("img")].map((image) => image.decode())) })
      const buffer = await locator.screenshot({ type: "png", animations: "disabled", caret: "hide" })
      scenes.push("data:image/png;base64," + buffer.toString("base64"))
    }
    if (entry.material) {
      assert.equal(await page.evaluate(() => location.hash), "#" + module)
      await take(page.locator(module === "brand-logo" ? ".brand-logo-asset" : ".spec").first())
      if (module === "banner") {
        await page.locator(".spec").first().getByRole("button", { name: "PC", exact: true }).click()
        await take(page.locator(".spec").first())
      } else await take(page.locator(module === "brand-logo" ? ".brand-logo-screen" : ".preview").first())
    } else if (entry.action === "export") {
      const demo = page.locator("#export-task-demo")
      await demo.getByRole("button", { name: "创建导出任务", exact: true }).click()
      await demo.getByRole("button", { name: "开始生成", exact: true }).click()
      await demo.locator('[data-export-state="可下载"]').waitFor()
      await demo.getByText("查看脱敏文件示例", { exact: true }).click()
      await take(demo.locator(entry.selector))
    } else if (entry.action === "states" || entry.action === "components") {
      await take(page.locator(entry.selector).first())
      await page.getByRole("tab", { name: entry.action === "states" ? "未完成" : "金额展示", exact: true }).click()
      await take(page.locator(entry.selector).first())
    } else {
      for (const index of entry.indexes ?? [0]) await take(page.locator(entry.selector).nth(index))
    }
    assert(scenes.length && scenes.every(Boolean), entry.id)
    await canvas.goto(base)
    await canvas.setContent(`<style>
      *{box-sizing:border-box}body{margin:0;font-family:Arial,"Noto Sans CJK SC",sans-serif;color:#18333e;background:linear-gradient(140deg,#edf7f4,#f6f9fc 65%)}
      main{width:1600px;height:1000px;padding:44px 56px 32px;overflow:hidden}.top,.foot{display:flex;justify-content:space-between}.top{font-size:24px;font-weight:700;color:#286b68;letter-spacing:2px}h1{font-size:62px;line-height:1.2;margin:22px 0 0;font-weight:800;letter-spacing:1px}.subtitle{font-size:30px;color:#526575;margin:16px 0 0}.scenes{display:grid;grid-template-columns:repeat(${scenes.length},minmax(0,1fr));gap:28px;margin-top:30px;height:674px}.panel{border:2px solid #cbdedb;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 10px 24px #21433708}h2{font-size:32px;line-height:1.25;height:80px;display:flex;align-items:center;justify-content:center;border-bottom:2px solid #dce8e5;background:#e6f1ee;margin:0;padding:10px}.image{height:590px;padding:18px;display:flex;align-items:center;justify-content:center}img{width:100%;height:100%;object-fit:contain}.foot{font-size:22px;color:#59706f;margin-top:22px}
    </style><main><div class="top"><span>设计资料 · ${entry.article ? "知识图解" : entry.material ? "素材规范" : "界面演示"}</span><span>设计体验</span></div><h1>${entry.title}</h1><p class="subtitle">${entry.subtitle}</p><div class="scenes">${scenes.map((src, i) => `<div class="panel"><h2>${entry.labels[i]}</h2><div class="image"><img src="${src}" alt="${entry.labels[i]}"></div></div>`).join("")}</div><div class="foot"><span>${entry.material ? "现有素材与页面预览节选" : "现有界面图节选 · 示例数据"}</span><span>包网知识库</span></div></main>`)
    await canvas.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((image) => image.decode())) })
    const target = `/images/${entry.article ? "articles" : "design-directory"}/${entry.id}-cover.jpg`
    await canvas.locator("main").screenshot({ path: path.join("public", target), type: "jpeg", quality: 90 })
    const previous = manifest.findIndex((item) => item.path === target)
    if (previous >= 0) manifest.splice(previous, 1)
    manifest.push({ path: target, width: 1600, height: 1000, source: entry.href, capturedFrom, sourceSelector: entry.material ? module === "brand-logo" ? ".brand-logo-asset / .brand-logo-screen" : module === "banner" ? ".spec" : ".spec / .preview" : entry.selector, sourceFrames: entry.indexes?.map((n) => n + 1), sourceStates: entry.labels, materialType: entry.material ? "现有素材规范与页面预览截图" : "现有界面图与交互演示截图；示例数据" })
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
    console.log("Captured", target)
  }
} finally { await browser?.close(); await new Promise((resolve) => server.close(resolve)) }
