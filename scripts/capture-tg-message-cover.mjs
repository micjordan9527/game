import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright-core")

// Capture a cover using the posters of the two videos shown in the article.
const base = (process.env.BASE_URL ?? "http://127.0.0.1:3145").replace(/\/$/, "")
const output = path.resolve("public/images/operations/tg-message-cover.jpg")
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE ?? "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] })
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })
  await page.route("**/*", (route) => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort())
  await page.goto(base + "/articles/tg-message-media", { waitUntil: "networkidle" })
  const posters = await page.evaluate(() => {
    const source = document.querySelector("[data-tg-source-video] video")
    const channel = document.querySelector("[data-tg-channel-preview] video")
    if (!(source instanceof HTMLVideoElement) || !(channel instanceof HTMLVideoElement)) throw new Error("Missing article videos")
    return { source: source.poster, channel: channel.poster }
  })
  await page.evaluate(({ source, channel }) => {
    const root = document.createElement("div")
    root.id = "tg-cover-canvas"
    root.innerHTML = '<div class="cover-top"><span>知识图解 · 运营场景</span><span>视频与消息预览</span></div><h1>TG频道推送：图片与视频</h1><p class="cover-subtitle">素材视频与TG消息展示</p><div class="cover-layout"><section class="cover-source"><h2>素材视频 <span>▶</span></h2><img alt="素材视频首帧"></section><section class="cover-channel"><h2>TG推送预览 <span>▶</span></h2><img alt="TG消息预览首帧"></section></div><div class="cover-foot"><span>查看素材与消息预览</span><span>包网知识库</span></div>'
    root.querySelector(".cover-source img").src = source
    root.querySelector(".cover-channel img").src = channel
    document.body.append(root)
    const style = document.createElement("style")
    style.textContent = `
      body > :not(#tg-cover-canvas) { display:none !important; }
      html, body { width:1600px !important;height:1000px !important;min-width:1600px !important;margin:0;overflow:hidden !important; }
      #tg-cover-canvas { position:absolute;inset:0;width:1600px;height:1000px;box-sizing:border-box;padding:44px 56px 32px;background:linear-gradient(140deg,#edf7f4,#f3f7fc 65%);color:#18333e;font-family:Arial,"Noto Sans CJK SC",sans-serif; }
      .cover-top { display:flex;justify-content:space-between;color:#286b68;font-size:24px;font-weight:700; }
      #tg-cover-canvas h1 { margin:18px 0 0;font-size:62px;font-weight:800;line-height:1.2; }
      .cover-subtitle { margin:10px 0 0;font-size:29px;color:#526575; }
      .cover-layout { display:grid;grid-template-columns:1fr 390px;gap:26px;margin-top:26px;height:650px; }
      .cover-layout section { overflow:hidden;border:2px solid #c5dad5;border-radius:18px;background:#fff; }
      .cover-layout h2 { display:flex;justify-content:space-between;align-items:center;margin:0;padding:14px 22px;background:#e6f1ee;color:#285e56;font-size:29px;line-height:1.25; }
      .cover-layout h2 span { font-size:24px; }
      .cover-source img { display:block;width:100%;height:auto; }
      .cover-channel { text-align:center; }
      .cover-channel img { display:block;max-width:100%;height:574px;width:auto;margin:0 auto;object-fit:contain; }
      .cover-foot { display:flex;justify-content:space-between;margin-top:16px;font-size:22px;color:#59706f; }
    `
    document.head.append(style)
  }, posters)
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.querySelectorAll("#tg-cover-canvas img")].map((image) => image.decode()))
  })
  const canvas = page.locator("#tg-cover-canvas")
  assert.deepEqual(await canvas.evaluate((node) => [node.offsetWidth, node.offsetHeight]), [1600, 1000])
  assert.equal(await canvas.locator("img").count(), 2)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  await canvas.screenshot({ path: output, type: "jpeg", quality: 90, animations: "disabled" })
  console.log(`Captured ${output} (1600×1000, two article video posters)`)
} finally { await browser.close() }
