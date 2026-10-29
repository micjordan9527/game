import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright-core")

// Recompose existing rendered guide scenes. No generated UI or article-body changes.
const base = (process.env.BASE_URL ?? "http://127.0.0.1:3144").replace(/\/$/, "")
const entries = [
  { slug: "mobile-page-layout", title: "手机页面布局", subtitle: "列表卡片与底部操作", frames: [0, 2], labels: ["列表保留关键字段", "底栏不遮住正文"], phone: true },
  { slug: "admin-bulk-actions", title: "后台批量操作", subtitle: "确认范围，分别查看执行结果", frames: [1, 2], labels: ["确认全部匹配 8 条", "4 成功 · 1 失败 · 3 跳过"], excerpt: true },
  { slug: "admin-filter-list-states", title: "后台筛选与列表状态", subtitle: "点击查询前后，条件与记录怎样变化", frames: [0, 1], labels: ["查询前：仍是原来 8 条", "查询后：已关闭 3 条"] },
  { slug: "form-validation-submit-feedback", title: "表单校验与提交反馈", subtitle: "字段错误与结果未知，处理入口不同", frames: [0, 3], labels: ["填错：在字段旁提示", "超时：先查原申请"] },
]
const output = path.resolve("public/images/articles")
fs.mkdirSync(output, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] })
const manifest = []
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
  await page.route("**/*", (route) => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort())
  for (const entry of entries) {
    await page.goto(`${base}/articles/${entry.slug}`, { waitUntil: "networkidle" })
    await page.locator("#visual-guide [data-guide-frame]").first().waitFor()
    await page.evaluate((entry) => {
      const frames = [...document.querySelectorAll("#visual-guide [data-guide-frame]")]
      const root = document.createElement("div")
      root.id = "article-cover-canvas"
      root.innerHTML = `<div class="cover-top"><span>知识图解 · 界面预览</span><span>设计体验</span></div><h1>${entry.title}</h1><p class="cover-subtitle">${entry.subtitle}</p><div class="cover-scenes"></div><div class="cover-foot">正文界面图节选 · 示例数据<span>包网知识库</span></div>`
      entry.frames.forEach((index, position) => {
        const original = frames[index].children[1]
        const scene = (entry.phone ? original.querySelector('[class*="_phone__"]') : original).cloneNode(true)
        assertScene(scene)
        if (entry.excerpt && position === 1) {
          const records = [...scene.querySelectorAll('[class*="_record__"]')]
          records.slice(3).forEach((node) => node.remove())
          const note = document.createElement("p")
          note.textContent = "结果节选 · 完整 8 条见正文"
          note.style.cssText = "margin-top:14px;color:#526575"
          scene.append(note)
        }
        const panel = document.createElement("div")
        panel.className = "cover-panel"
        const label = document.createElement("h2")
        label.textContent = entry.labels[position]
        const viewport = document.createElement("div")
        viewport.className = "cover-viewport"
        const mount = document.createElement("div")
        mount.className = "cover-mount"
        scene.style.cssText += `;margin:0;width:${entry.phone ? 320 : 440}px;max-width:none;box-sizing:border-box;`
        mount.append(scene)
        viewport.append(mount)
        panel.append(label, viewport)
        root.querySelector(".cover-scenes").append(panel)
      })
      document.body.append(root)
      const style = document.createElement("style")
      style.textContent = `
        body > :not(#article-cover-canvas) { display:none !important; }
        html,body { width:1600px !important;height:1000px !important;min-width:1600px !important;margin:0;overflow:hidden !important; }
        #article-cover-canvas { position:absolute;inset:0;width:1600px;height:1000px;box-sizing:border-box;padding:44px 56px 32px;background:linear-gradient(140deg,#edf7f4,#f6f9fc 65%);color:#18333e;font-family:Arial,"Noto Sans CJK SC",sans-serif; }
        .cover-top { display:flex;justify-content:space-between;color:#286b68;font-size:24px;font-weight:700;letter-spacing:2px; }
        #article-cover-canvas h1 { margin-top:22px;font-size:62px;font-weight:800;line-height:1.2;letter-spacing:1px; }
        .cover-subtitle { margin-top:16px;font-size:30px;color:#526575; }
        .cover-scenes { display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:30px;height:674px; }
        .cover-panel { min-width:0;border:2px solid #cbdedb;border-radius:20px;background:#ffffffd9;overflow:hidden;box-shadow:0 10px 24px #21433708; }
        #article-cover-canvas h2 { height:80px;display:flex;align-items:center;justify-content:center;border-bottom:2px solid #dce8e5;background:#e6f1ee;font-size:32px;font-weight:700; }
        .cover-viewport { height:590px;position:relative;overflow:hidden; }
        .cover-mount { position:absolute;transform-origin:top left; }
        .cover-foot { display:flex;justify-content:space-between;margin-top:22px;font-size:22px;color:#59706f; }
      `
      document.head.append(style)
      for (const mount of root.querySelectorAll(".cover-mount")) {
        const scene = mount.firstElementChild
        const scale = Math.min(660 / scene.offsetWidth, 548 / scene.offsetHeight, entry.phone ? 1.68 : 1.5)
        mount.style.transform = `scale(${scale})`
        mount.style.left = `${(mount.parentElement.clientWidth - scene.offsetWidth * scale) / 2}px`
        mount.style.top = `${(590 - scene.offsetHeight * scale) / 2}px`
      }
      function assertScene(scene) { if (!scene) throw new Error("Missing source scene") }
    }, entry)
    await page.evaluate(() => document.fonts.ready)
    const canvas = page.locator("#article-cover-canvas")
    assert.deepEqual(await canvas.evaluate((node) => [node.offsetWidth, node.offsetHeight]), [1600, 1000])
    const file = `${entry.slug}-cover.jpg`
    await canvas.screenshot({ path: path.join(output, file), type: "jpeg", quality: 90, animations: "disabled" })
    manifest.push({ path: `/images/articles/${file}`, width: 1600, height: 1000, source: `/articles/${entry.slug}#visual-guide`, sourceFrames: entry.frames.map((n) => n + 1), materialType: "现有正文HTML界面图节选", composition: entry.excerpt ? "确认窗口与结果节选；完整记录保留在正文" : "两幅正文界面并列，保留原字段与状态" })
    console.log(`Captured ${file}`)
  }
} finally { await browser.close() }
fs.writeFileSync(path.join(output, "interface-covers-manifest.json"), JSON.stringify(manifest, null, 2) + "\n")
