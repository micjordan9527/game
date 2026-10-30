import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import http from "node:http"
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright-core")

let server
let base = process.env.CAPTURE_BASE_URL
if (!base) {
  const root = path.resolve("out")
  const types = { ".html": "text/html", ".txt": "text/x-component", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".mp4": "video/mp4" }
  server = http.createServer((req, res) => {
    const name = path.resolve(root, "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname))
    if (name !== root && !name.startsWith(root + path.sep)) return res.writeHead(404).end()
    const file = [name, name + ".html", path.join(name, "index.html")].find((f) => fs.existsSync(f) && fs.statSync(f).isFile())
    if (!file) return res.writeHead(404).end()
    res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" }); res.end(fs.readFileSync(file))
  })
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
  base = `http://127.0.0.1:${server.address().port}`
}
const entries = [
  { slug: "campaign-risk-review", title: "活动配置与发放记录", subtitle: "后台规则、前台展示与原申请版本对应", selector: "[data-campaign-screen]", labels: ["后台规则与草稿预览"] },
  { slug: "channel-quality-review", title: "渠道资料与复核", subtitle: "同一渠道的资料、异常与处理结论", selector: "[data-operation-screen]", labels: ["渠道资料", "异常复核"], second: "channel" },
  { slug: "community-operations-governance", title: "社群咨询与工单", subtitle: "咨询编号连接私密工单、回复与关闭记录", selector: "[data-operation-screen]", labels: ["群内咨询", "私密工单"], second: "community" },
  { slug: "interface-motion-feedback", title: "界面动效与操作反馈", subtitle: "提交、等待和确认结果，支持播放与逐步查看", selector: "[data-motion-screen=submit]", labels: ["等待响应", "明确已受理"], second: "motion" },
  { slug: "device-controls-feedback", title: "设备控制面板与反馈", subtitle: "查看操作位置，对照禁用、确认与缺纸恢复", selector: "#device-controls-view", labels: ["操作区域", "缺纸时保留原票据"], second: "device" },
]
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] })
const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1 })
const page = await context.newPage(), canvas = await context.newPage(), manifest = []
try {
  for (const entry of entries) {
    await page.setViewportSize({ width: entry.second === "motion" ? 600 : 1600, height: 1100 })
    await page.goto(base + "/articles/" + entry.slug, { waitUntil: "networkidle" })
    await page.addStyleTag({ content: "body > header{visibility:hidden!important}nextjs-portal{display:none!important}" })
    assert.equal(await page.locator("body > header").isVisible(), false, "Global navigation must not overlap captured UI")
    await page.evaluate(() => document.fonts.ready)
    const target = page.locator(entry.selector)
    await target.waitFor()
    const take = async (locator = target) => {
      await locator.scrollIntoViewIfNeeded()
      const buffer = await locator.screenshot({ type: "png", animations: "disabled", caret: "hide" })
      return "data:image/png;base64," + buffer.toString("base64")
    }
    if (entry.second === "motion") await page.getByRole("button", { name: "查看下一步", exact: true }).click()
    const scenes = [await take(entry.second === "device" ? target.locator("figure") : target)]
    if (entry.second === "channel") await page.locator("#channel-quality-case nav").getByRole("button", { name: /复核处理/ }).click()
    if (entry.second === "community") await page.locator("#community-support-case nav").first().getByRole("button").nth(1).click()
    if (entry.second === "motion") await page.getByRole("button", { name: "查看下一步", exact: true }).click()
    if (entry.second === "device") await page.locator("#device-controls-view").getByRole("button", { name: "出票缺纸", exact: true }).click()
    if (entry.second) scenes.push(await take(entry.second === "device" ? target.locator('[aria-label="可操作的设备面板示意"]') : target))
    assert(scenes.length === entry.labels.length)
    await canvas.setViewportSize({ width: 1600, height: 1000 })
    await canvas.setContent(`<style>*{box-sizing:border-box}body{margin:0;font-family:Arial,"Noto Sans CJK SC",sans-serif;color:#18333e;background:linear-gradient(140deg,#edf7f4,#f6f9fc 65%)}main{width:1600px;height:1000px;padding:40px 52px 28px;overflow:hidden}.top,.foot{display:flex;justify-content:space-between;color:#286b68;font-size:23px;font-weight:600}h1{font-size:60px;line-height:1.2;margin:20px 0 0;letter-spacing:1px}.subtitle{font-size:29px;color:#526575;margin:14px 0 0}.scenes{display:grid;grid-template-columns:repeat(${scenes.length},minmax(0,1fr));gap:24px;margin-top:28px;height:690px}.panel{border:2px solid #cbdedb;border-radius:18px;overflow:hidden;background:white}h2{font-size:29px;height:66px;display:flex;align-items:center;justify-content:center;border-bottom:2px solid #dce8e5;background:#e6f1ee;margin:0}.image{height:620px;padding:14px;display:flex;align-items:center;justify-content:center}img{width:100%;height:100%;object-fit:contain}.foot{font-size:21px;margin-top:20px;color:#59706f}</style><main><div class="top"><span>知识图解 · 可操作示例</span><span>包网知识库</span></div><h1>${entry.title}</h1><p class="subtitle">${entry.subtitle}</p><div class="scenes">${scenes.map((src,i)=>`<section class="panel"><h2>${entry.labels[i]}</h2><div class="image"><img src="${src}" alt="${entry.labels[i]}"></div></section>`).join("")}</div><div class="foot"><span>正文界面节选 · 示例数据${entry.second === "device" ? " · 通用设备示意" : ""}</span><span>打开图解查看完整过程</span></div></main>`)
    await canvas.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((image) => image.decode())) })
    const targetPath = "/images/articles/" + entry.slug + "-cover.jpg"
    await canvas.locator("main").screenshot({ path: path.join("public",targetPath), type: "jpeg", quality: 90 })
    manifest.push({ path: targetPath, width: 1600, height: 1000, source: "/articles/"+entry.slug, sourceSelector: entry.selector, sourceStates: entry.labels, materialType: "本页可操作界面截图；示例数据" + (entry.second === "device" ? "；通用设备示意" : "") })
    console.log("Captured",targetPath)
  }
  fs.writeFileSync("public/images/articles/practice-cover-manifest.json",JSON.stringify(manifest,null,2)+"\n")
} finally { await context.close(); await browser.close(); if (server) await new Promise((resolve) => server.close(resolve)) }
