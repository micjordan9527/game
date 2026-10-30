import fs from 'node:fs'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright-core')
const base=process.env.CAPTURE_BASE_URL ?? 'http://127.0.0.1:3000'
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE ?? '/usr/bin/chromium',headless:true,args:['--no-sandbox']})
try {
 const page=await browser.newPage({viewport:{width:1600,height:1100},deviceScaleFactor:1})
 await page.goto(base+'/cases/bm-optimization',{waitUntil:'networkidle'})
 await page.evaluate(()=>document.fonts.ready)
 await page.evaluate(()=>{
  const source=document.querySelector('[data-bm-study-cover]')
  if(!source)throw Error('Missing BM structure illustration')
  const stage=document.createElement('div');stage.id='bm-cover-canvas'
  stage.style.cssText='position:absolute;z-index:200;inset:0 auto auto 0;width:1600px;height:1000px;padding:96px 100px;box-sizing:border-box;display:grid;grid-template-columns:1fr 580px;align-items:center;gap:80px;background:#edf1f4;color:#172a40;font-family:Arial,"Microsoft YaHei",sans-serif'
  const caption=document.createElement('div')
  caption.innerHTML='<p style="font-size:24px;letter-spacing:.12em;color:#6c7887">案例 · BM手机端</p><h1 style="font-size:64px;line-height:1.35;font-weight:750;margin:28px 0 40px">赛事列表<br>信息怎样分组</h1><div style="display:grid;gap:22px;font-size:34px;font-weight:650"><p>① 赛事身份</p><p>② 当前赛况</p><p>③ 盘口与选项</p></div><p style="font-size:22px;color:#637285;margin-top:48px">原材料标注 · 同内容结构示意</p>'
  const container=document.createElement('div');container.style.cssText='--study-text:20px;min-width:0'
  const clone=source.cloneNode(true);clone.removeAttribute('aria-labelledby');clone.style.cssText='width:580px;max-width:none;margin:0;box-shadow:0 16px 40px #172a4017'
  clone.querySelector('h4').style.fontSize='26px'
  clone.querySelector('[class*="figureLabel"]').style.fontSize='17px'
  clone.querySelectorAll('[class*="recordId"], [class*="cardCaption"]').forEach(n=>n.remove())
  container.append(clone);stage.append(caption,container);document.body.append(stage)
 })
 const target=page.locator('#bm-cover-canvas');const box=await target.boundingBox()
 if(box.width!==1600||box.height!==1000)throw Error('Cover canvas must remain16:10')
 fs.mkdirSync('public/images/cases',{recursive:true})
 await target.screenshot({path:'public/images/cases/bm-reading-cover.jpg',type:'jpeg',quality:91,animations:'disabled'})
 fs.writeFileSync('public/images/cases/bm-reading-cover.source.json',JSON.stringify({path:'images/cases/bm-reading-cover.jpg',width:1600,height:1000,sourcePage:'/cases/bm-optimization#bm-layout-study',sourceSelector:'[data-bm-study-cover]',type:'本页同内容结构示意的页面截图',record:'MATCH-DEMO-001',note:'封面为本页解释图；不属于原产品截图或已上线方案。',script:'scripts/capture-bm-case-cover.mjs'},null,2)+'\n')
 console.log('Captured BM cover1600x1000 from the labeled layout illustration.')
} finally { await browser.close() }
