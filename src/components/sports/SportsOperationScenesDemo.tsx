"use client"

import { useState } from "react"
import { BellRing, CircleGauge, Gift, ShieldCheck, UsersRound } from "lucide-react"

type Scene = { name: string; tag: string; audience: string; placement: string; benefit: string; boundary: string; measure: string; icon: typeof CircleGauge; tone: "brand" | "amber" | "emerald" }

const scenes: Scene[] = [
  { name: "热门赛事推荐", tag: "赛事曝光", audience: "近期浏览足球赛事的用户", placement: "首页热门赛事 + 体育页首屏", benefit: "突出海港队 vs 山城队，并展示开赛时间与当前可投注状态。", boundary: "赛事封盘或数据异常时，推荐位同步显示不可投注，不继续引导提交。", measure: "曝光、赛事详情进入率、有效投注转化", icon: CircleGauge, tone: "brand" },
  { name: "新用户引导", tag: "首单理解", audience: "首次进入体育模块的用户", placement: "玩法入口 + 投注单说明", benefit: "用简短规则说明帮助用户理解独赢、让球和大小，再进入赛事选择。", boundary: "提示规则与风险说明，不把活动文案伪装成收益承诺。", measure: "玩法页完成率、首张有效注单、客服咨询率", icon: UsersRound, tone: "emerald" },
  { name: "专题活动", tag: "限定触达", audience: "符合活动条件且处于可参与地区的用户", placement: "赛事专题页 + 已登录用户消息中心", benefit: "展示活动时间、参与条件、奖励计算方式和结果查询入口。", boundary: "资格、限额与时间均在提交前校验；不符合条件时给出明确原因。", measure: "参与人数、达标率、奖励发放成功率", icon: Gift, tone: "amber" },
  { name: "赛前提醒", tag: "回访触达", audience: "已关注赛事、且授权接收提醒的用户", placement: "站内消息", benefit: "在开赛前提醒用户赛事即将开始，并链接回赛事详情。", boundary: "只向已授权用户发送；赛事取消、延期或封盘时不发送过期提醒。", measure: "提醒打开率、回访率、赛事详情进入率", icon: BellRing, tone: "brand" },
]

const tone = { brand: "border-brand-100 bg-brand-50 text-brand-700", amber: "border-amber-200 bg-amber-50 text-amber-700", emerald: "border-emerald-200 bg-emerald-50 text-emerald-700" }

export function SportsOperationScenesDemo() {
  const [index, setIndex] = useState(0)
  const scene = scenes[index]
  const Icon = scene.icon
  return <section className="mt-6 overflow-hidden rounded-lg border border-line bg-white shadow-sm" aria-labelledby="operation-demo-title">
    <div className="p-5 md:p-8"><div className="flex flex-wrap items-center gap-3"><h2 id="operation-demo-title" className="text-xl font-semibold text-ink">一场比赛，运营怎样做得清楚又克制？</h2><span className="rounded-md bg-paper px-2 py-1 text-xs text-muted">虚构运营 · 场景示意</span></div><p className="mt-3 text-sm leading-7 text-muted">选择一个运营目标，查看它该展示给谁、放在哪里，以及哪些边界必须同时守住。</p><div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="选择运营场景">{scenes.map((item, next) => <button key={item.name} type="button" aria-pressed={index === next} onClick={() => setIndex(next)} className={`rounded-md border px-3 py-2.5 text-sm font-medium ${index === next ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item.name}</button>)}</div></div>
    <div className="grid border-t border-line lg:grid-cols-[.85fr_1.15fr]">
      <div className="bg-paper p-5 md:p-8"><div className="rounded-lg border border-line bg-white p-5"><p className="text-xs font-semibold text-brand-700">当前触达</p><div className="mt-4 flex items-center gap-3"><div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${tone[scene.tone]}`}><Icon className="h-5 w-5" aria-hidden="true" /></div><div><p className="font-semibold text-ink">{scene.name}</p><p className="mt-1 text-sm text-muted">{scene.tag}</p></div></div><div className="mt-5 space-y-4 text-sm"><Item label="目标用户" value={scene.audience} /><Item label="展示位置" value={scene.placement} /><Item label="用户看到" value={scene.benefit} /></div></div></div>
      <div className="p-5 md:p-8" aria-live="polite" aria-atomic="true"><p className="text-xs font-semibold text-brand-700">第 {index + 1} / {scenes.length} 个场景</p><h3 className="mt-2 text-2xl font-semibold text-ink">运营目标：{scene.tag}</h3><div className="mt-5 grid gap-4"><Block title="合规与产品边界" body={scene.boundary} icon={ShieldCheck} /><Block title="建议观察的指标" body={scene.measure} icon={CircleGauge} /></div><p className="mt-5 border-l-2 border-brand-600 pl-4 text-sm leading-7 text-muted">运营页面应准确表达赛事与活动当前状态，让用户知道可以做什么，也知道为什么暂时不能做。</p></div>
    </div>
  </section>
}
function Item({label,value}:{label:string;value:string}) { return <div><p className="text-xs font-semibold text-muted">{label}</p><p className="mt-1 leading-6 text-ink">{value}</p></div> }
function Block({title,body,icon:Icon}:{title:string;body:string;icon:typeof ShieldCheck}) { return <div className="rounded-lg border border-line p-4"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Icon className="h-4 w-4 text-brand-700" aria-hidden="true" />{title}</p><p className="mt-2 text-sm leading-7 text-muted">{body}</p></div> }
