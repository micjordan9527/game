"use client"

import { useId, useState, type KeyboardEvent } from "react"

const demoId = "DP-DEMO-20261025-001"

const scenarios = [
  {
    label: "核对一致",
    order: "已支付",
    channel: "成功 · 1 条终态通知",
    ledger: "LEDGER-DEMO-001 · 入账 100.00",
    difference: "无差异 · 已复核",
    action: "核对编号、金额、币种与时间口径后关闭本次复核。",
  },
  {
    label: "缺账",
    order: "已支付，入账待确认",
    channel: "成功 · 1 条终态通知",
    ledger: "未找到关联入账",
    difference: "DIFF-DEMO-001 · 缺少账本流水",
    action: "先查既有流水和补偿记录；取得授权后按原业务编号补偿一次。",
  },
  {
    label: "重复通知",
    order: "已支付",
    channel: "成功 · 同一通知到达 2 次",
    ledger: "LEDGER-DEMO-001 · 仅入账 1 次",
    difference: "DIFF-DEMO-002 · 重复通知待复核",
    action: "保留两条接收日志，核对幂等键；不能生成第二笔有效入账。",
  },
  {
    label: "结果未知",
    order: "支付结果确认中",
    channel: "原请求超时 · 尚无终态",
    ledger: "无入账，不自动补偿",
    difference: "DIFF-DEMO-003 · 通道结果未知",
    action: "查询原通道请求并保留处理中；不能按失败重建订单或直接加款。",
  },
] as const

const screens = ["订单列表", "订单详情", "通道记录", "账本流水", "差异单"] as const

export function ReconciliationCase() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [screenIndex, setScreenIndex] = useState(0)
  const uid = useId()
  const scenario = scenarios[scenarioIndex]
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number, group: "result" | "screen") => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    const count = group === "result" ? scenarios.length : screens.length
    const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + count) % count
    if (group === "result") setScenarioIndex(next)
    else setScreenIndex(next)
    document.getElementById(`${uid}-${group}-${next}`)?.focus()
  }

  const screenRows: Record<(typeof screens)[number], [string, string][]> = {
    订单列表: [
      ["平台订单号", demoId],
      ["会员", "MEM-DEMO-018"],
      ["金额 / 币种", "100.00 / DEMO"],
      ["当前状态", scenario.order],
    ],
    订单详情: [
      ["平台订单号", demoId],
      ["创建时间", "2026-10-25 20:15:06 +08:00"],
      ["支付通道", "CHANNEL-DEMO-A"],
      ["关联检查", `${scenario.channel}；${scenario.ledger}`],
    ],
    通道记录: [
      ["关联平台订单", demoId],
      ["通道请求号", "CH-DEMO-001"],
      ["通道状态", scenario.channel],
      ["核对依据", "请求、查询与通知日志均保留；演示数据"],
    ],
    账本流水: [
      ["关联平台订单", demoId],
      ["账本结果", scenario.ledger],
      ["入账前余额", "1,260.00 DEMO"],
      ["预期入账后余额", scenario.label === "核对一致" || scenario.label === "重复通知" ? "1,360.00 DEMO" : "尚未确认"],
    ],
    差异单: [
      ["关联平台订单", demoId],
      ["差异记录", scenario.difference],
      ["处理状态", scenario.label === "核对一致" ? "已复核关闭" : "待核实"],
      ["处理要求", scenario.action],
    ],
  }

  return (
    <section id="reconciliation-case" className="container-shell mb-8 max-w-6xl scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6" aria-label="充值与对账完整案例">
      <p className="text-xs font-semibold text-brand-700">完整案例 · 演示数据</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">充值与对账：五个界面怎样串成一条证据链</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
        全部界面使用平台订单号 <strong className="text-ink">{demoId}</strong> 关联。金额、会员、时间、通道、流水与差异编号均为演示数据，不连接真实支付或会员资料。
      </p>

      <ol className="mt-5 grid gap-2 md:grid-cols-5" aria-label="对账流程图">
        {screens.map((screen, index) => (
          <li key={screen} className="relative rounded-lg border border-brand-100 bg-brand-50 p-3 text-sm text-ink">
            <span className="block text-xs font-semibold text-brand-700">{index + 1}</span>
            <span className="mt-1 block font-semibold">{screen}</span>
            {index < screens.length - 1 ? <span aria-hidden="true" className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-brand-500 md:block">→</span> : null}
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs leading-6 text-muted">流程图：从订单列表定位记录，在详情核对关联编号，再查通道与账本；不一致时登记差异单并复核关闭。</p>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="选择对账结果">
        {scenarios.map((item, index) => (
          <button key={item.label} id={`${uid}-result-${index}`} type="button" role="tab" aria-selected={scenarioIndex === index} aria-controls={`${uid}-screen-panel`} tabIndex={scenarioIndex === index ? 0 : -1} onClick={() => setScenarioIndex(index)} onKeyDown={(event) => onTabKey(event, index, "result")} className={`rounded-md border px-3 py-2 text-sm font-semibold ${scenarioIndex === index ? "border-ink bg-ink text-white" : "border-line text-muted hover:text-brand-700"}`}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto" role="tablist" aria-label="选择案例界面">
        <div className="flex min-w-max gap-2">
          {screens.map((screen, index) => (
            <button key={screen} id={`${uid}-screen-${index}`} type="button" role="tab" aria-selected={screenIndex === index} aria-controls={`${uid}-screen-panel`} tabIndex={screenIndex === index ? 0 : -1} onClick={() => setScreenIndex(index)} onKeyDown={(event) => onTabKey(event, index, "screen")} className={`rounded-md px-3 py-2 text-sm font-medium ${screenIndex === index ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200" : "text-muted hover:bg-paper"}`}>
              {index + 1}. {screen}
            </button>
          ))}
        </div>
      </div>

      <div id={`${uid}-screen-panel`} role="tabpanel" aria-labelledby={`${uid}-result-${scenarioIndex} ${uid}-screen-${screenIndex}`} tabIndex={0} className="mt-3 rounded-xl border border-line bg-paper p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="text-xs text-muted">当前界面</p><h3 className="mt-1 text-lg font-semibold text-ink">{screens[screenIndex]}</h3></div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-line">{scenario.label}</span>
        </div>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {screenRows[screens[screenIndex]].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-lg bg-white p-3 ring-1 ring-line">
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="mt-1 break-words text-sm font-semibold leading-6 text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm leading-7 text-muted"><strong className="text-ink">复核动作：</strong>{scenario.action}</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {scenarios.map((item) => <div key={item.label} className="rounded-lg border border-line p-3"><p className="text-sm font-semibold text-ink">{item.label}</p><p className="mt-2 text-xs leading-6 text-muted">{item.difference}</p></div>)}
      </div>
    </section>
  )
}
