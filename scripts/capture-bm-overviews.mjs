import fs from 'node:fs'
import { createHash } from 'node:crypto'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright-core')
const entries=[
 {id:'home',title:'首页：入口、赛事与盘口',source:'bm-home-optimization.png',before:['时间入口与球类','赛事与盘口列表','底部导航'],after:['专题、时间入口与球类','带赛况的赛事卡','底部导航与摘要入口']},
 {id:'detail',title:'详情页：头区、分类与内容',source:'bm-detail-optimization.png',before:['赛事头区','横向盘口分类','盘口内容列表'],after:['赛事信息区','分类、筛选与内容','底部摘要与操作区']},
]
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE ?? '/usr/bin/chromium',headless:true,args:['--no-sandbox']})
const manifest=[]
const crop=(image,x)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} 264 345 714" width="345" height="714" role="img" aria-label="既有材料中的界面局部"><image href="${image}" width="1600" height="1160"/></svg>`
try{
 const page=await browser.newPage({viewport:{width:1600,height:1160},deviceScaleFactor:1})
 for(const item of entries){
  const sourcePath='public/case-assets/bm-optimization/'+item.source,bytes=fs.readFileSync(sourcePath),image='data:image/png;base64,'+bytes.toString('base64')
  const panel=(label,caption,x)=>`<section><h2>${label}</h2><div class="body">${crop(image,x)}<ol>${caption.map((s,i)=>`<li><b>0${i+1}</b><p>${s}</p></li>`).join('')}</ol></div></section>`
  await page.setContent(`<html lang="zh-CN"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;color:#182c40;background:#f3f5f6;font-family:Arial,"Microsoft YaHei",sans-serif}main{width:1600px;height:1160px;padding:48px}header{margin-bottom:28px}header p{margin:0 0 12px;color:#59717b;font-size:21px}h1{font-size:38px;line-height:1.4;margin:0;font-weight:700}.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px}section{min-width:0;background:white;border:1px solid #d5dfe4;border-radius:16px;padding:24px}h2{font-size:27px;line-height:1.5;margin:0 0 20px;padding-bottom:18px;border-bottom:1px solid #e0e7eb}.body{display:grid;grid-template-columns:345px minmax(0,1fr);gap:20px;align-items:center}svg{display:block;width:345px;height:714px}ol{display:grid;gap:46px;list-style:none;margin:0;padding:0}li{border-top:1px solid #dce4e8;padding-top:14px}li b{font-size:18px;letter-spacing:.08em;color:#7c694f}li p{margin:10px 0 0;font-size:23px;line-height:1.65;font-weight:600}footer{margin-top:24px;font-size:21px;line-height:1.7;color:#657583}</style><main><header><p>BM 手机端界面对照</p><h1>${item.title}</h1></header><div class="grid">${panel('材料中的旧界面',item.before,91)}${panel('视觉提案',item.after,846)}</div><footer>两侧为不同赛事，仅对照可见结构；界面局部取自既有材料。</footer></main></html>`,{waitUntil:'load'})
  await page.evaluate(()=>document.fonts.ready)
  await page.locator('svg image').evaluateAll(nodes=>Promise.all(nodes.map(n=>new Promise((resolve,reject)=>{const i=new Image();i.onload=resolve;i.onerror=reject;i.src=n.getAttribute('href')}))))
  const output=`public/images/cases/bm-${item.id}-overview.jpg`
  fs.mkdirSync('public/images/cases',{recursive:true})
  await page.locator('main').screenshot({path:output,type:'jpeg',quality:94,animations:'disabled'})
  manifest.push({path:output.replace(/^public\//,''),width:1600,height:1160,type:'既有界面局部与中性位置图注的图文编排',source:'/case-assets/bm-optimization/'+item.source,sourceSha256:createHash('sha256').update(bytes).digest('hex'),crops:[{x:91,y:264,width:345,height:714},{x:846,y:264,width:345,height:714}],note:'源文件未更改；右侧为原材料中的视觉提案，不作上线结果。',script:'scripts/capture-bm-overviews.mjs'})
  console.log('Captured',item.id,'overview1600x1160')
 }
 fs.writeFileSync('public/images/cases/bm-overview-sources.json',JSON.stringify(manifest,null,2)+'\n')
}finally{await browser.close()}
