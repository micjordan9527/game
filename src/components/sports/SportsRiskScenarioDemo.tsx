"use client"

import { useState } from "react"
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Gauge, ShieldAlert, UserRoundX } from "lucide-react"

type RiskScenario = {
  name: string
  icon: typeof CheckCircle2
  score: number
  action: string
  tone: "ok" | "watch" | "review" | "block"
  summary: string
  signals: { label: string; value: string; hit: boolean }[]
  user: string
  system: string
  audit: string
}

const scenarios: RiskScenario[] = [
  {
    name: "普通投注",
    icon: CheckCircle2,
    score: 18,
    action: "放行",
    tone: "ok",
    summary: "用户行为、金额和设备都在常规范围内，系统正常核对余额与报价。",
    signals: [
      { label: "金额", value: "80 / 单笔上限 100", hit: false },
      { label: "设备", value: "常用设备", hit: false },
      { label: "赔率", value: "报价稳定", hit: false },
      { label: "账户", value: "历史行为正常", hit: false },
    ],
    user: "页面继续确认本次提交，用户看到正常处理中或已受理结果。",
    system: "完成常规校验：余额、选项可用性、赔率和请求唯一标识。",
    audit: "记录普通提交日志，便于后续对账和客服查询。",
  },
  {
    name: "金额过高",
    icon: Gauge,
    score: 52,
    action: "限额",
    tone: "watch",
    summary: "金额超过当前配置上限，但没有明显账号或设备异常，先按限额规则处理。",
    signals: [
      { label: "金额", value: "300 / 单笔上限 100", hit: true },
      { label: "设备", value: "常用设备", hit: false },
      { label: "赔率", value: "报价稳定", hit: false },
      { label: "账户", value: "历史行为正常", hit: false },
    ],
    user: "页面提示超过单笔限额，用户可以调整金额后重新确认。",
    system: "阻止本次高额提交，不改变赛事和玩法本身的可用状态。",
    audit: "记录限额命中项、用户、玩法、金额和当时配置。",
  },
  {
    name: "赔率跳动前集中下注",
    icon: AlertTriangle,
    score: 76,
    action: "转复核",
    tone: "review",
    summary: "短时间内多笔集中在同一选项，且接近赔率调整时点，需要人工或更高规则复核。",
    signals: [
      { label: "金额", value: "多笔接近上限", hit: true },
      { label: "设备", value: "同设备多账户", hit: true },
      { label: "赔率", value: "调盘前 20 秒", hit: true },
      { label: "账户", value: "新账户占比高", hit: true },
    ],
    user: "页面显示正在复核，不直接给出成功或失败结论。",
    system: "冻结本次请求的处理结论，查询相关账户、设备、IP 与盘口变化记录。",
    audit: "生成复核任务，关联赔率版本、请求标识、设备指纹和命中规则。",
  },
  {
    name: "多账号同源",
    icon: UserRoundX,
    score: 84,
    action: "拦截",
    tone: "block",
    summary: "多个账号使用相同设备或网络特征，持续提交同一玩法方向，风险等级较高。",
    signals: [
      { label: "金额", value: "多账号拆分下注", hit: true },
      { label: "设备", value: "设备指纹重复", hit: true },
      { label: "赔率", value: "集中同一方向", hit: true },
      { label: "账户", value: "注册时间接近", hit: true },
    ],
    user: "页面提示本次提交未通过校验，必要时引导联系客服。",
    system: "拒绝新提交，并把相关账号与请求加入观察或人工复核队列。",
    audit: "保留命中证据与处理原因，避免客服只能看到一个模糊失败状态。",
  },
  {
    name: "赛果数据冲突",
    icon: ShieldAlert,
    score: 68,
    action: "暂停结算",
    tone: "review",
    summary: "不同数据源返回的比分或状态不一致，先暂停自动结算，避免错误派奖或退款。",
    signals: [
      { label: "金额", value: "已受理注单待结算", hit: false },
      { label: "设备", value: "用户行为无异常", hit: false },
      { label: "赔率", value: "结算依据冲突", hit: true },
      { label: "账户", value: "涉及多张注单", hit: true },
    ],
    user: "注单显示待结算或复核中，不提前展示资金已到账。",
    system: "暂停自动派奖，核对赛果来源、版本和适用玩法规则。",
    audit: "记录冲突数据源、影响注单范围和最终复核结论。",
  },
]

const toneClasses = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-700",
  watch: "border-amber-200 bg-amber-50 text-amber-700",
  review: "border-sky-200 bg-sky-50 text-sky-700",
  block: "border-rose-200 bg-rose-50 text-rose-700",
}

export function SportsRiskScenarioDemo() {
  const [index, setIndex] = useState(0)
  const scenario = scenarios[index]
  const Icon = scenario.icon
  const hits = scenario.signals.filter((signal) => signal.hit).length

  return (
    <section className="mt-6 overflow-hidden rounded-lg border border-line bg-white shadow-sm" aria-labelledby="risk-demo-title">
      <div className="p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="risk-demo-title" className="text-xl font-semibold text-ink">同一张注单，为什么有的放行、有的复核？</h2>
          <span className="rounded-md bg-paper px-2 py-1 text-xs text-muted">虚构风控 · 判断示意</span>
        </div>
        <p className="mt-3 text-sm leading-7 text-muted">选择一个提交场景，看金额、设备、赔率和账户信号如何共同影响处理动作。</p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="选择风控场景">
          {scenarios.map((item, next) => <button key={item.name} type="button" aria-pressed={index === next} onClick={() => setIndex(next)} className={`rounded-md border px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 ${index === next ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item.name}</button>)}
        </div>
      </div>

      <div className="grid border-t border-line lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-paper p-5 md:p-8">
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Icon className="h-4 w-4 text-brand-700" aria-hidden="true" />{scenario.name}</span>
              <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${toneClasses[scenario.tone]}`}>{scenario.action}</span>
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold text-muted">风险分</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-5xl font-semibold tabular-nums text-ink">{scenario.score}</span>
                <span className="pb-2 text-sm text-muted">/ 100</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper">
                <div className={`h-full ${scenario.score >= 80 ? "bg-rose-500" : scenario.score >= 65 ? "bg-sky-500" : scenario.score >= 45 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${scenario.score}%` }} />
              </div>
              <p className="mt-5 text-sm leading-7 text-muted">{scenario.summary}</p>
            </div>
            <div className="border-t border-line p-5">
              <p className="text-sm font-semibold text-ink">命中信号：{hits} / {scenario.signals.length}</p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {scenario.signals.map((signal) => <div key={signal.label} className={`rounded-lg border p-3 ${signal.hit ? "border-brand-100 bg-brand-50" : "border-line bg-white"}`}>
                  <dt className="text-xs font-semibold text-muted">{signal.label}</dt>
                  <dd className={`mt-1 text-sm leading-6 ${signal.hit ? "text-brand-700" : "text-ink"}`}>{signal.value}</dd>
                </div>)}
              </dl>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8" aria-live="polite" aria-atomic="true">
          <p className="text-xs font-semibold text-brand-700">第 {index + 1} / {scenarios.length} 个场景 · {scenario.action}</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">处理动作：{scenario.action}</h3>
          <div className="mt-5 grid gap-4">
            <DecisionBlock title="用户看到" body={scenario.user} />
            <DecisionBlock title="系统处理" body={scenario.system} />
            <DecisionBlock title="后台留痕" body={scenario.audit} />
          </div>
          <p className="mt-6 border-l-2 border-brand-600 pl-4 text-sm leading-7 text-muted">风控不是只看一个字段。金额、设备、账户、赔率和赛事状态组合起来，才形成可解释的处理结果。</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)} className="inline-flex items-center gap-2 rounded-md px-3 py-3 text-sm text-muted hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" aria-hidden="true" />上一个</button>
            <button type="button" onClick={() => setIndex((index + 1) % scenarios.length)} className="inline-flex items-center gap-2 rounded-md bg-brand-700 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600">{index === scenarios.length - 1 ? "重新看场景" : "下一个场景"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-line p-5 md:p-8">
        <ClipboardCheck className="mt-1 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
        <p className="text-sm leading-7 text-muted">本页只用于理解风控产品逻辑，不代表真实平台的拦截标准。实际规则应结合供应商接口、业务政策、合规要求和人工复核流程设计。</p>
      </div>
    </section>
  )
}

function DecisionBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-line p-4">
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      <p className="mt-2 text-sm leading-7 text-muted">{body}</p>
    </div>
  )
}
