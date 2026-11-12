import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import http from 'node:http'
import path from 'node:path'

const source = fs.readFileSync('public/case-assets/admin-optimization/pages-data.js', 'utf8')
const context = {}
vm.runInNewContext(source, context)
const member = context.AURORA_PAGES.find(page => page.key === 'management-index')
assert(member)
assert.equal(member.rows.length, 4)
assert.deepEqual(Array.from(member.filters), ['会员ID', '会员账号', '账号状态', '验证状态', '上级代理'])
assert(member.columns.includes('账号状态') && member.columns.includes('验证状态'))
const ids = new Set()
for (const row of member.rows) {
  assert(/^MEM-DEMO-\d{3}$/.test(row['会员ID']), 'Every record is visibly a demonstration member')
  assert(!ids.has(row['会员ID'])); ids.add(row['会员ID'])
  assert.equal(row['账号类型'], '测试账号')
  assert.notEqual(row['账号类型'], row['会员账号'])
  assert(['正常', '受限', '停用'].includes(row['账号状态']))
  assert(['未提交', '审核中', '已通过', '需补充'].includes(row['验证状态']))
  assert(row['上级代理'] === '无代理归属' || /^AGENT-DEMO-\d{2}$/.test(row['上级代理']))
  assert(/^\d+\.\d{2} USDT$/.test(row['钱包余额']))
  for (const field of member.columns) assert(row[field], `Displayed field ${field} belongs to the same member record`)
}
assert(member.rows.some(row => row['账号状态'] === '正常' && row['验证状态'] === '审核中'))
assert(member.rows.some(row => row['账号状态'] === '受限' && row['验证状态'] === '已通过'))
console.log('PASS member data:4 explicitly fictional records, independent account/verification states and meaningful field values')

if (process.env.CHECK_ADMIN_MEMBER_BROWSER !== '1') process.exit(0)
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright-core')
const root = path.resolve('public')
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml' }
const server = http.createServer((request, response) => {
  let filename = path.resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname))
  if (!filename.startsWith(root + path.sep)) return response.writeHead(404).end()
  if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) filename = path.join(filename, 'index.html')
  if (!fs.existsSync(filename)) return response.writeHead(404).end()
  response.writeHead(200, { 'Content-Type': types[path.extname(filename)] ?? 'application/octet-stream' }); response.end(fs.readFileSync(filename))
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE ?? '/usr/bin/chromium', headless:true, args:['--no-sandbox'] })
const errors = []
try {
  for (const width of [1440,390]) {
    const browserContext = await browser.newContext({ viewport:{ width, height:900 }, deviceScaleFactor:1 })
    await browserContext.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort())
    const page = await browserContext.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(base + '/case-assets/admin-optimization/index.html#version=optimized&page=management-index', { waitUntil:'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const filter = key => page.locator(`[data-member-filter="${key}"]`)
    const reset = async () => { await page.locator('#resetBtn').click(); assert.equal(await page.locator('#tableBody tr').count(),4) }
    const visibleIds = () => page.locator('#tableBody tr td:first-child strong').allTextContents()
    assert.equal(await page.locator('#resultCount').innerText(), '共 4 条')
    assert((await page.locator('#pageDesc').innerText()).includes('虚构'))
    assert.deepEqual(await filter('账号状态').locator('option').allTextContents(),['全部','正常','受限','停用'])
    assert.equal(await page.locator('#insightStrip article').first().locator('strong').innerText(),'4')
    await filter('账号状态').selectOption('受限')
    await filter('验证状态').selectOption('已通过')
    assert.deepEqual(await visibleIds(),['MEM-DEMO-002'])
    await page.locator('#tableBody [data-detail]').first().click()
    assert.equal(await page.locator('#drawerTitle').innerText(),'MEM-DEMO-002')
    const actualFields = await page.locator('#drawerBody .detail-item').evaluateAll(nodes => Object.fromEntries(nodes.map(node => [node.querySelector('span').textContent, node.querySelector('strong').textContent])))
    assert.deepEqual(actualFields,JSON.parse(JSON.stringify(member.rows[1])), 'Filtered list and detail use the same complete member object')
    await page.locator('#closeDrawer').click()
    assert.deepEqual(await visibleIds(),['MEM-DEMO-002'])
    assert.equal(await filter('账号状态').inputValue(),'受限')
    await filter('验证状态').selectOption('审核中')
    assert.equal(await page.locator('#tableBody tr').count(),0,'Account and verification conditions intersect without conflating their meanings')
    await reset()
    await filter('会员账号').fill('member_demo_03'); await filter('会员账号').press('Enter')
    await filter('上级代理').fill('AGENT-DEMO-01'); await filter('上级代理').press('Enter')
    assert.deepEqual(await visibleIds(),['MEM-DEMO-003'])
    await filter('上级代理').fill('AGENT-DEMO-02'); await filter('上级代理').press('Enter')
    assert.equal(await page.locator('#tableBody tr').count(),0)
    await reset()
    await page.locator('#statusTabs [data-tab="正常"]').click()
    assert.deepEqual(await visibleIds(),['MEM-DEMO-001','MEM-DEMO-004'])
    assert.equal(await page.locator('#statusTabs [data-tab="正常"]').innerText(),'正常 2')
    await reset()
    if (width === 1440 && process.env.CAPTURE_ADMIN_MEMBER === '1') {
      await page.evaluate(() => scrollTo({ top:0, behavior:'instant' }))
      await page.locator('#toast').waitFor({ state:'hidden' })
      await page.screenshot({ path:'public/images/enrichment/admin-support-02.jpg', type:'jpeg', quality:87 })
      await page.locator('#tableBody [data-detail]').first().click(); await page.locator('#detailDrawer.open').waitFor()
      await page.waitForTimeout(250)
      await page.screenshot({ path:'public/images/enrichment/admin-support-03.jpg', type:'jpeg', quality:87 })
      await page.locator('#closeDrawer').click()
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `No page overflow at${width}px; wide table stays in its own scroll region`)
    console.log(`PASS member UI${width}px: field-specific combined filtering, independent states, tabs/counts, detail identity and retained filters`)
    await browserContext.close()
  }
  assert.deepEqual(errors, [])
  if (process.env.CAPTURE_ADMIN_MEMBER === '1') {
    const manifestPath = 'public/images/enrichment/provenance.json'
    const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'))
    for (const index of [2,3]) {
      const entry = manifest.find(entry => entry.path === `/images/enrichment/admin-support-0${index}.jpg`)
      assert(entry)
      entry.materialType = '本地会员界面演示截图；4条虚构测试会员记录'
      entry.action = index === 2 ? '查看会员身份、账号状态、验证状态和代理归属；条件筛选使用对应字段。' : '打开MEM-DEMO-001详情，与列表核对同一账号、余额、代理归属及两种独立状态。'
      entry.recordId = 'MEM-DEMO-001'
    }
    fs.writeFileSync(manifestPath, JSON.stringify(manifest,null,2)+'\n')
    console.log('Captured only admin-support-02/03 and updated their source records')
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
