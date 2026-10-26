import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright-core');
const project=process.cwd();
const root=path.join(project,'public');
const output=path.join(root,'images/enrichment');
fs.mkdirSync(output,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let file=path.resolve(root,'.'+pathname);
 if(!file.startsWith(root+path.sep)){res.writeHead(404).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){res.writeHead(404).end();return;}
 res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream'});res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const executablePath=process.env.CHROMIUM_EXECUTABLE ?? ['/usr/bin/chromium','/usr/bin/google-chrome','/usr/bin/google-chrome-stable'].find(file=>fs.existsSync(file));
assert(executablePath,'Set CHROMIUM_EXECUTABLE to an installed Chromium/Chrome');
const browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox']});
const manifest=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
 await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
 const page=await context.newPage();
 async function shot(name,meta,clip){
  const file=path.join(output,name+'.jpg');
  await page.screenshot({path:file,type:'jpeg',quality:83,clip});
  manifest.push({file:'/images/enrichment/'+name+'.jpg',...meta,width:clip?.width??1440,height:clip?.height??900,bytes:fs.statSync(file).size,materialType:meta.materialType??'现有交互演示截图；示例数据',capturedFrom:page.url().replace(base,'')});
  console.log(name,fs.statSync(file).size);
 }
 const flows=[
  {id:'operation',role:'运营',key:'promotion-activity-record-activityRecord',list:'活动记录',step2:'在页面选择器选择活动记录，查看记录状态与关联账号。',step3:'打开活动记录详情，核对活动ID、当前状态及处理建议；部分示例字段未填。'},
  {id:'finance',role:'财务',key:'finance-fundsRecords-depositRecord',list:'充值记录',step2:'在页面选择器选择充值记录，核对订单、金额和状态。',step3:'打开充值记录详情，交叉核对会员编号、平台订单号、渠道订单号及币种。'},
  {id:'support',role:'客服',key:'management-index',list:'会员列表',step2:'在页面选择器选择会员列表，定位账号和当前状态。',step3:'打开会员详情，核对账号字段、钱包余额、上级代理和账号状态。'},
 ];
 for(const flow of flows){
  await page.goto(base+'/case-assets/admin-optimization/index.html#version=optimized&page=dataCenter-overview',{waitUntil:'networkidle'});
  await page.locator(`.role-tab[data-role="${flow.role}"]`).click();
  assert.equal(await page.locator('#currentRole').innerText(),flow.role);
  await page.evaluate(()=>scrollTo({top:320,behavior:'instant'}));
  await shot('admin-'+flow.id+'-01',{role:flow.role,pageKey:'dataCenter-overview',title:`${flow.role}角色看板`,action:`切换至${flow.role}角色，查看核心指标、风险报警和待处理事项。`});
  await page.locator('#pageSelect').selectOption(flow.key);
  await page.locator('#pageTitle').getByText(flow.list,{exact:true}).waitFor();
  await page.waitForTimeout(2000);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await shot('admin-'+flow.id+'-02',{role:flow.role,pageKey:flow.key,title:flow.list,action:flow.step2});
  await page.locator('#tableBody [data-detail]').first().click();
  await page.locator('#detailDrawer.open').waitFor();
  await page.waitForTimeout(600);
  assert.equal(await page.locator('#detailDrawer header small').innerText(),flow.list+'详情');
  const detail=await page.locator('#drawerBody').innerText();
  await shot('admin-'+flow.id+'-03',{role:flow.role,pageKey:flow.key,title:flow.list+'详情',action:flow.step3,recordTitle:await page.locator('#drawerTitle').innerText(),visibleFields:detail.slice(0,1400)});
 }
 for(const entry of [{id:'services',target:'solution',title:'服务方案流程与服务卡片'},{id:'structure',target:'product',title:'产品能力架构图与能力说明'},{id:'contact',target:'contact',title:'联系方式与需求咨询表单'}]){
  await page.goto(base+'/case-assets/white-label-official/index.html?case-preview=1#'+entry.target,{waitUntil:'networkidle'});
  await page.locator('#'+entry.target).evaluate(node=>{
   document.body.scrollTo({top:node.getBoundingClientRect().top+document.body.scrollTop-76,behavior:'instant'});
   node.querySelector('.container')?.scrollTo({top:0,behavior:'instant'});
  });
  await page.waitForTimeout(100);
  await shot('official-'+entry.id,{pageKey:entry.target,title:entry.title,action:`定位官网原型 #${entry.target} 模块，截取标题与可见内容。`,materialType:'现有官网页面演示截图'}, {x:60,y:76,width:1320,height:800});
 }
 await context.close();
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
const provenancePath=path.join(output,'provenance.json');
const retained=fs.existsSync(provenancePath)?JSON.parse(fs.readFileSync(provenancePath,'utf8')):[];
const paths=new Set(manifest.map(item=>item.file));
const captures=manifest.map(item=>({path:item.file,role:item.role,pageKey:item.pageKey,title:item.title,materialType:item.materialType,width:item.width,height:item.height,source:item.capturedFrom,action:item.action}));
fs.writeFileSync(provenancePath,JSON.stringify([...retained.filter(item=>!paths.has(item.path)),...captures],null,2));
console.log('Saved',manifest.length,'actual screenshots');
