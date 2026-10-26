import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'

const args = process.argv.slice(2)
const value = (name, fallback) => args.includes(name) ? args[args.indexOf(name) + 1] : fallback
const project = path.resolve(value('--project', process.cwd()))
const output = path.resolve(value('--output', path.join(project, 'public/images/official-comparison')))
const source = '/case-assets/white-label-official/index.html'
const input = path.join(project, 'public' + source)
assert(fs.existsSync(input), 'Existing official prototype must exist')
fs.mkdirSync(output, { recursive: true })
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright-core')
const executablePath = process.env.CHROMIUM_EXECUTABLE ?? ['/usr/bin/chromium', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'].find(candidate => fs.existsSync(candidate))
assert(executablePath, 'An installed Chromium/Chrome is required')
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname
  if (pathname !== source) return res.writeHead(404).end()
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(fs.readFileSync(input))
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] })
const definitions = [
  { id: 'services', target: 'solution', title: '服务方案', caption: '同一官网演示的服务方案模块：流程图与三类服务卡片。', difference: '桌面并列服务卡片；手机改为单列，依次阅读范围与入口。流程图保留同一套内容。' },
  { id: 'structure', target: 'product', title: '产品能力与结构', caption: '同一官网演示的产品能力模块：平台架构图与能力分组。', difference: '桌面将架构图与能力说明并排；手机按架构、能力说明顺序纵向排列，保留层级标签。' },
  { id: 'contact', target: 'contact', title: '联系我们', caption: '同一官网演示的咨询模块：示例联系方式与需求表单；表单不会发送数据。', difference: '桌面将联系方式与表单分栏；手机先看联系方式，再填写表单，输入字段保持单列。' },
]
function jpegSize(buffer) {
  for (let offset = 2; offset < buffer.length;) {
    const marker = buffer[offset + 1]
    const length = buffer.readUInt16BE(offset + 2)
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) }
    offset += length + 2
  }
  throw new Error('JPEG dimensions not found')
}
const manifest = []
const checks = []
try {
  for (const [device, width] of [['desktop', 1440], ['mobile', 390]]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
    await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort())
    const page = await context.newPage()
    const scriptErrors = []
    page.on('pageerror', error => scriptErrors.push(error.message))
    for (const entry of definitions) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`${base}${source}?case-preview=1#${entry.target}`, { waitUntil: 'networkidle' })
      const section = page.locator('#' + entry.target)
      await section.getByRole('heading', { name: entry.title, exact: true }).waitFor()
      await section.evaluate(node => {
        const root = matchMedia('(max-width: 980px)').matches ? document.scrollingElement : document.body
        root.scrollTo({ top: node.getBoundingClientRect().top + root.scrollTop, behavior: 'instant' })
        node.querySelector('.container')?.scrollTo({ top: 0, behavior: 'instant' })
      })
      await page.evaluate(() => document.fonts.ready)
      if (device === 'mobile') {
        // Capture a real tall viewport so fixed backgrounds render through the whole
        // module; do not stitch, alter DOM/CSS, or recolor screenshots.
        const height = Math.ceil(await section.evaluate(node => node.getBoundingClientRect().height)) + 80
        await page.setViewportSize({ width, height })
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
      }
      const metrics = await section.evaluate(node => ({
        pageWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        viewportWidth: innerWidth,
        sectionWidth: Math.round(node.getBoundingClientRect().width),
        sectionHeight: Math.round(node.getBoundingClientRect().height),
        imageCount: node.querySelectorAll('img').length,
        unloadedImages: [...node.querySelectorAll('img')].filter(image => !image.complete || !image.naturalWidth).map(image => image.getAttribute('src')),
        overflowingElements: [...node.querySelectorAll('*')].filter(element => element.getBoundingClientRect().right > innerWidth + 1 || element.getBoundingClientRect().left < -1).slice(0, 20).map(element => ({ tag: element.tagName, className: typeof element.className === 'string' ? element.className : '', width: Math.round(element.getBoundingClientRect().width) })),
      }))
      assert.equal(metrics.pageWidth > width + 1, false, `${device} ${entry.id}: document overflow`)
      assert.deepEqual(metrics.unloadedImages, [], `${device} ${entry.id}: image loading`)
      assert.deepEqual(scriptErrors, [], `${device} ${entry.id}: script errors`)
      const file = `official-${entry.id}-${device}.jpg`
      const screenshot = await section.screenshot({ path: path.join(output, file), type: 'jpeg', quality: 85, animations: 'disabled' })
      const imageSize = jpegSize(screenshot)
      manifest.push({ id: entry.id, device, file, width: imageSize.width, height: imageSize.height, viewport: page.viewportSize(), captureMethod: device === 'mobile' ? '实际390宽度浏览器视口按模块高度扩展，直接元素截图；不改DOM、不拼接' : '1440×900实际视口直接模块首屏截图；超出容器的内容可在原演示中纵向滚动', source: `${source}?case-preview=1#${entry.target}`, materialType: '现有官网交互演示实际截图', caption: entry.caption, difference: entry.difference, bytes: fs.statSync(path.join(output, file)).size })
      checks.push({ id: entry.id, device, ...metrics })
      console.log(`${file}: ${metrics.sectionWidth}x${metrics.sectionHeight}; no page overflow; ${metrics.imageCount} module images`)
    }
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify(checks, null, 2) + '\n')
console.log('Saved six actual module screenshots and source manifest')
