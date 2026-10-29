import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright-core")

// Recompose the article's actual message, poster and buttons into its card cover.
const base = (process.env.BASE_URL ?? "http://127.0.0.1:3145").replace(/\/$/, "")
const output = path.resolve("public/images/operations/tg-message-cover.jpg")
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] })
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
  await page.route("**/*", (route) => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort())
  await page.goto(base + "/articles/tg-message-media", { waitUntil: "networkidle" })
  await page.locator("#tg-message-demo").waitFor()
  await page.getByRole("button", { name: "静态封面", exact: true }).click()
  await page.evaluate(() => {
    const demo = document.querySelector("#tg-message-demo")
    if (!demo) throw new Error("Missing TG message scene")
    const clone = (className) => {
      const node = demo.querySelector(`[class*="_${className}__"]`)
      if (!node) throw new Error(`Missing source: ${className}`)
      return node.cloneNode(true)
    }
    const channel = clone("channel")
    const media = clone("media")
    const note = document.createElement("div")
    note.className = "cover-preview-note"
    note.innerHTML = '<strong>2＋2＋1 排列</strong><p>频道名与按钮依据参考截图。视频只演示顶部媒体位的替换。</p>'
    const buttons = clone("messageButtons")
    const root = document.createElement("div")
    root.id = "tg-cover-canvas"
    root.innerHTML = '<div class="cover-top"><span>知识图解 · 运营场景</span><span>视频示例</span></div><h1>TG频道推送：图片与视频</h1><p class="cover-subtitle">默认展示视频 · 顶部媒体替换预览</p><div class="cover-layout"><div class="cover-media-panel"></div><div class="cover-copy-panel"><h2>原帖的五个按钮</h2></div></div><div class="cover-foot"><span>视频替换预览 · 与原帖活动主题不同</span><span>包网知识库</span></div>'
    const mediaPanel = root.querySelector(".cover-media-panel")
    const copyPanel = root.querySelector(".cover-copy-panel")
    const mediaFooter = document.createElement("div")
    mediaFooter.className = "cover-media-footer"
    mediaFooter.innerHTML = '<strong>1 · 媒体位</strong><span>16:9完整画面 · 约9秒</span>'
    const play = document.createElement("span")
    play.className = "cover-play"
    play.setAttribute("aria-hidden", "true")
    play.textContent = "▶"
    media.append(play)
    mediaPanel.append(channel, media, mediaFooter)
    copyPanel.append(buttons, note)
    document.body.append(root)
    const style = document.createElement("style")
    style.textContent = `
      body > :not(#tg-cover-canvas) { display:none !important; }
      html, body { width:1600px !important;height:1000px !important;min-width:1600px !important;margin:0;overflow:hidden !important; }
      #tg-cover-canvas { position:absolute;inset:0;width:1600px;height:1000px;box-sizing:border-box;padding:44px 56px 32px;background:linear-gradient(140deg,#edf7f4,#f3f7fc 65%);color:#18333e;font-family:Arial,"Noto Sans CJK SC",sans-serif; }
      .cover-top { display:flex;justify-content:space-between;color:#286b68;font-size:24px;font-weight:700;letter-spacing:2px; }
      #tg-cover-canvas h1 { margin-top:20px;font-size:64px;font-weight:800;line-height:1.2;letter-spacing:1px; }
      .cover-subtitle { margin-top:14px;font-size:30px;line-height:1.2;color:#526575; }
      .cover-layout { display:grid;grid-template-columns:940px 520px;gap:28px;margin-top:26px;height:650px; }
      .cover-media-panel { overflow:hidden;border:2px solid #29434e;border-radius:18px;color:#edf5f9;background:#172b36; }
      .cover-media-panel [class*="_channel__"] { height:64px;padding:9px 20px;gap:12px;box-sizing:border-box; }
      .cover-media-panel [class*="_channel__"] > span { width:42px;height:42px; }
      .cover-media-panel [class*="_channel__"] strong { font-size:23px; }
      .cover-media-panel [class*="_channel__"] small { display:none; }
      .cover-media-panel [class*="_media__"] { position:relative;aspect-ratio:16/9; }
      .cover-play { position:absolute;display:grid;place-items:center;right:26px;bottom:24px;width:76px;height:76px;border:2px solid #effbff;border-radius:50%;background:#11364dba;color:#fff;font-size:34px;text-indent:5px;box-shadow:0 4px 18px #00273b50; }
      .cover-media-footer { display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 20px;font-size:22px;line-height:1.2; }
      .cover-media-footer strong { font-weight:700; }
      .cover-media-footer span { color:#bcd8e1; }
      .cover-copy-panel { overflow:hidden;border:2px solid #c5dad5;border-radius:18px;background:#fff; }
      #tg-cover-canvas h2 { margin:0;padding:16px 24px;border-bottom:2px solid #dce9e6;background:#e6f1ee;color:#285e56;font-size:30px;font-weight:700;line-height:1.2; }
      .cover-copy-panel [class*="_messageBody__"] { padding:22px 24px 20px;min-height:322px;color:#243e48;font-size:22px;line-height:1.65; }
      .cover-copy-panel [class*="_messageBody__"] > strong { font-size:30px;line-height:1.4; }
      .cover-copy-panel [class*="_messageBody__"] p { margin-top:12px; }
      .cover-copy-panel [class*="_messageButtons__"] { gap:10px;padding:20px 22px; }
      .cover-copy-panel [class*="_messageButtons__"] button { min-height:58px;padding:12px 14px;color:#f4f8fa;background:#2e4859;font-size:22px;line-height:1.4; }
      .cover-copy-panel [class*="_messageButtons__"] svg { width:22px;height:22px; }
      .cover-preview-note { padding:18px 24px;color:#36575a;font-size:25px;line-height:1.65; }
      .cover-preview-note strong { display:block;font-size:34px;font-weight:700; }
      .cover-preview-note p { margin-top:12px; }
      .cover-foot { display:flex;justify-content:space-between;margin-top:18px;font-size:22px;line-height:1.3;color:#59706f; }
    `
    document.head.append(style)
  })
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.querySelectorAll("#tg-cover-canvas img")].map((image) => image.decode()))
  })
  const canvas = page.locator("#tg-cover-canvas")
  assert.deepEqual(await canvas.evaluate((node) => [node.offsetWidth, node.offsetHeight]), [1600, 1000])
  assert.equal(await canvas.locator("img").count(), 1)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  await canvas.screenshot({ path: output, type: "jpeg", quality: 90, animations: "disabled" })
  console.log(`Captured ${output} (1600×1000, actual message HTML and video poster)`)
} finally { await browser.close() }
