"use client"

import { useId, useReducer, useRef, useState, type KeyboardEvent } from "react"
import { CheckCircle2, ClipboardCheck, FileText, RotateCcw, Send, ShieldCheck } from "lucide-react"
import styles from "./CampaignOperationsCase.module.css"

type Rules = { version: number; title: string; explanation: string }
type Request = { id: string; rules: Rules; status: "待复核" | "需补充" | "审核通过" | "已发放" }
type State = {
  draft: Rules; phase: "草稿" | "待审核" | "已退回" | "已批准" | "已发布"; checked: boolean
  published: Rules[]; profileReady: boolean; memberChecked: boolean; request: Request | null
  issued: boolean; notice: string; events: string[]
}
type Event =
  | { type: "edit"; field: "title" | "explanation"; value: string }
  | { type: "checked" | "profile" | "memberChecked"; value: boolean }
  | { type: "submit" | "approve" | "return" | "publish" | "correct" | "apply" | "requestApprove" | "requestReturn" | "supplement" | "issue" | "reset" }
const campaignId = "DEMO-CAMPAIGN-01"
const requestId = "DEMO-REWARD-01"
const paymentId = "DEMO-REWARD-PAY-01"
const tabs = ["后台配置", "前台规则", "申请审核", "发放记录"]
const startingRules: Rules = { version: 1, title: "资料完善示例活动", explanation: "仅限测试账号。资料项完成并核验通过后可提交申请；每个账号在本活动内只发放一次。" }
function initial(): State {
  return { draft: { ...startingRules }, phase: "草稿", checked: false, published: [], profileReady: false, memberChecked: false, request: null, issued: false, notice: "先核对后台规则并送审。草稿预览尚未对前台生效。", events: [] }
}
function log(s: State, notice: string): State { return { ...s, notice, events: [...s.events, notice] } }
function reducer(s: State, e: Event): State {
  if (e.type === "reset") return initial()
  if (e.type === "checked") return { ...s, checked: e.value }
  if (e.type === "profile") return { ...s, profileReady: e.value }
  if (e.type === "memberChecked") return { ...s, memberChecked: e.value }
  if (e.type === "edit") {
    if (!["草稿", "已退回"].includes(s.phase)) return s
    return { ...s, draft: { ...s.draft, [e.field]: e.value }, checked: false }
  }
  if (e.type === "submit") {
    if (!["草稿", "已退回"].includes(s.phase)) return s
    if (!s.draft.title.trim() || !s.draft.explanation.trim() || !s.checked) return log(s, "请填写活动名称、规则说明，并完成规则核对。当前尚未送审。")
    return log({ ...s, phase: "待审核" }, `v${s.draft.version}已送审；前台仍沿用原生效版本。`)
  }
  if (e.type === "approve" || e.type === "return") {
    if (s.phase !== "待审核") return s
    return e.type === "approve" ? log({ ...s, phase: "已批准" }, `示例审核员批准v${s.draft.version}。批准后仍需执行发布。`) : log({ ...s, phase: "已退回", checked: false }, `v${s.draft.version}已退回：补充规则说明，再次核对后送审。`)
  }
  if (e.type === "publish") {
    if (s.phase !== "已批准") return s
    return log({ ...s, phase: "已发布", published: [...s.published, { ...s.draft }] }, `v${s.draft.version}已在本页示例前台生效；历史版本保留。`)
  }
  if (e.type === "correct") {
    if (s.phase !== "已发布") return s
    return log({ ...s, phase: "草稿", checked: false, draft: { ...s.draft, version: s.draft.version + 1, explanation: "仅限测试账号。资料项完成并核验通过后可提交申请；每个账号在本活动内只发放一次。申请进度在原申请记录中查询。" } }, `建立v${s.draft.version + 1}更正草稿，原生效版本和已受理申请均保留，需重新审核。`)
  }
  if (e.type === "apply") {
    const live = s.published.at(-1)
    if (!live || !s.profileReady || !s.memberChecked) return log(s, "当前尚未满足申请条件，未创建申请。")
    if (s.request) return log(s, `已存在${s.request.id}，沿用原申请与v${s.request.rules.version}规则快照，不创建第二条。`)
    return log({ ...s, request: { id: requestId, rules: { ...live }, status: "待复核" } }, `${requestId}已受理，保存v${live.version}规则快照；奖励尚未发放。`)
  }
  if (e.type === "requestApprove" || e.type === "requestReturn") {
    if (s.request?.status !== "待复核") return s
    return e.type === "requestApprove" ? log({ ...s, request: { ...s.request, status: "审核通过" } }, `${requestId}审核通过，等待发放；已发放仍为0.00 DEMO。`) : log({ ...s, request: { ...s.request, status: "需补充" } }, `${requestId}需补充：请确认资料核验记录。申请编号与规则快照保留。`)
  }
  if (e.type === "supplement") {
    if (s.request?.status !== "需补充" || !s.profileReady) return s
    return log({ ...s, request: { ...s.request, status: "待复核" } }, `已为${requestId}补充示例核验记录，原申请重新进入复核。`)
  }
  if (e.type === "issue") {
    if (s.issued) return log(s, `重复请求命中${paymentId}，仍为1笔、10.00 DEMO，不再次发放。`)
    if (s.request?.status !== "审核通过") return s
    return log({ ...s, issued: true, request: { ...s.request, status: "已发放" } }, `${paymentId}记录示例发放10.00 DEMO；同一活动、账号和奖励类型只保留一笔。`)
  }
  return s
}

function RulePreview({ rules, published }: { rules: Rules; published: boolean }) {
  return <div className={styles.rulePreview} data-campaign-rule-preview>
    <div className={styles.phoneBar}><span />测试账号 · 活动详情</div>
    <span className={published ? styles.goodBadge : styles.badge}>{published ? `生效版本 v${rules.version}` : `草稿预览 v${rules.version} · 未发布`}</span>
    <h4>{rules.title}</h4><p>{rules.explanation}</p>
    <dl className={styles.facts}><div><dt>适用范围</dt><dd>测试账号</dd></div><div><dt>活动时间</dt><dd>10月30日 09:00—18:00<br />UTC+8 · 固定示例时段</dd></div><div><dt>奖励示例</dt><dd>10.00 DEMO / 账号</dd></div></dl>
    <p className={styles.small}>DEMO为演示单位，不代表真实金额或可领取权益。</p>
  </div>
}

export function CampaignOperationsCase() {
  const [s, dispatch] = useReducer(reducer, undefined, initial)
  const [tab, setTab] = useState(0)
  const uid = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const live = s.published.at(-1)
  const editable = ["草稿", "已退回"].includes(s.phase)
  function navigateTab(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length
    if (e.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length
    if (e.key === "Home") next = 0
    if (e.key === "End") next = tabs.length - 1
    if (next === undefined) return
    e.preventDefault(); setTab(next); tabRefs.current[next]?.focus()
  }
  return <section id="campaign-operations-case" aria-labelledby={`${uid}-heading`} className={`container-shell mb-8 max-w-6xl scroll-mt-24 ${styles.case}`} data-campaign-case>
    <header className={styles.heading}><p>可操作案例 · 示例数据</p><h2 id={`${uid}-heading`}>同一个活动，从规则配置到发放记录</h2><p>切换四个界面，观察规则版本、申请编号和发放结果怎样对应。全部操作只改变本页状态，刷新后重置。</p></header>
    <div className={styles.identity}><strong>{campaignId}</strong><span>当前生效：<b data-campaign-live>{live ? `v${live.version}` : "尚未发布"}</b></span><span>申请：<b data-campaign-request-status>{s.request?.status ?? "尚未创建"}</b></span><span>已发放：<b data-campaign-issued>{s.issued ? "1笔 / 10.00 DEMO" : "0笔 / 0.00 DEMO"}</b></span></div>
    <div role="tablist" aria-label="活动案例界面" className={styles.tabs}>{tabs.map((label, index) => <button key={label} ref={(node) => { tabRefs.current[index] = node }} id={`${uid}-tab-${index}`} role="tab" type="button" aria-selected={tab === index} aria-controls={`${uid}-panel-${index}`} tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)} onKeyDown={(e) => navigateTab(e, index)}><span>{index + 1}</span>{label}</button>)}</div>
    <div className={styles.status} role="status" aria-live="polite" data-campaign-notice>{s.notice}</div>
    <div id={`${uid}-panel-${tab}`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} tabIndex={0} className={styles.panel}>
      {tab === 0 ? <div className={styles.columns} data-campaign-screen>
        <div className={styles.screen}><div className={styles.screenBar}><FileText size={17} aria-hidden="true" /><h3>后台 · 编辑活动规则</h3><span data-campaign-phase>v{s.draft.version} · {s.phase}</span></div>
          <fieldset disabled={!editable} className={styles.form}><legend>规则配置</legend><label>活动名称<input value={s.draft.title} maxLength={50} onChange={(e) => dispatch({ type: "edit", field: "title", value: e.target.value })} /></label><label>前台规则说明<textarea rows={4} value={s.draft.explanation} maxLength={300} onChange={(e) => dispatch({ type: "edit", field: "explanation", value: e.target.value })} /></label><div className={styles.fixedFields}><div><span>参与范围</span><strong>测试账号</strong></div><div><span>发放限制</span><strong>同活动、同账号一次</strong></div></div><label className={styles.check}><input type="checkbox" checked={s.checked} onChange={(e) => dispatch({ type: "checked", value: e.target.checked })} />已核对参与范围、规则、时间和一次发放限制</label></fieldset>
          <div className={styles.actions}><button type="button" disabled={!editable} onClick={() => dispatch({ type: "submit" })}><Send size={15} aria-hidden="true" />提交规则审核</button><button type="button" disabled={s.phase !== "待审核"} onClick={() => dispatch({ type: "return" })}>退回修改</button><button type="button" disabled={s.phase !== "待审核"} onClick={() => dispatch({ type: "approve" })}>审核通过</button><button type="button" className={styles.primary} disabled={s.phase !== "已批准"} onClick={() => dispatch({ type: "publish" })}>发布已审核版本</button><button type="button" disabled={s.phase !== "已发布"} onClick={() => dispatch({ type: "correct" })}>建立更正版本</button></div>
          <p className={styles.note}>更正会建立新草稿并重新审核；已生效规则在新版本发布前继续保留。审核按钮代表示例审核员操作。</p>
        </div><div className={styles.side}><RulePreview rules={s.draft} published={false} /><p className={styles.note}>这里是编辑预览。切换“前台规则”，查看实际生效版本。</p></div>
      </div> : null}
      {tab === 1 ? <div className={styles.columns}>
        <div className={styles.screen}><div className={styles.screenBar}><FileText size={17} aria-hidden="true" /><h3>前台 · 会员查看活动</h3></div>{live ? <RulePreview rules={live} published /> : <div className={styles.empty}><FileText size={32} aria-hidden="true" /><strong>当前没有生效活动</strong><p>后台草稿不会直接展示给会员。请先完成规则审核与发布。</p></div>}</div>
        <div className={styles.screen}><div className={styles.screenBar}><ClipboardCheck size={17} aria-hidden="true" /><h3>测试账号 · 申请条件</h3></div><div className={styles.memberForm}><dl className={styles.facts}><div><dt>账号</dt><dd>MEMBER-DEMO-01</dd></div><div><dt>当前条件</dt><dd>{s.profileReady ? "资料核验通过" : "资料尚未核验"}</dd></div></dl><label className={styles.check}><input type="checkbox" checked={s.profileReady} onChange={(e) => dispatch({ type: "profile", value: e.target.checked })} />模拟资料项完成并核验通过</label><label className={styles.check}><input type="checkbox" checked={s.memberChecked} onChange={(e) => dispatch({ type: "memberChecked", value: e.target.checked })} />模拟已查看当前活动规则</label><div className={styles.actions}><button type="button" className={styles.primary} disabled={!live || !s.profileReady || !s.memberChecked} onClick={() => dispatch({ type: "apply" })}>{s.request ? "再次提交同一申请" : "提交申请"}</button></div><p className={styles.note}>固定时段视为有效时段；按钮模拟条件核对，不验证真实身份或资料。</p>{s.request ? <div className={styles.receipt}><CheckCircle2 size={20} aria-hidden="true" /><div><strong>{s.request.id} · {s.request.status}</strong><p>受理规则：v{s.request.rules.version} · 奖励示例10.00 DEMO</p><p>申请受理后保存该版本，后续更正不覆盖这条快照。</p></div></div> : null}</div></div>
      </div> : null}
      {tab === 2 ? <div className={styles.columns}>
        <div className={styles.screen}><div className={styles.screenBar}><ClipboardCheck size={17} aria-hidden="true" /><h3>后台 · 活动申请复核</h3></div>{s.request ? <div className={styles.memberForm}><div className={styles.requestRow}><div><strong>{s.request.id}</strong><p>MEMBER-DEMO-01</p></div><span className={s.request.status === "需补充" ? styles.warnBadge : styles.goodBadge}>{s.request.status}</span></div><dl className={styles.facts}><div><dt>活动</dt><dd>{campaignId}</dd></div><div><dt>受理规则</dt><dd>v{s.request.rules.version}</dd></div><div><dt>申请金额</dt><dd>10.00 DEMO</dd></div><div><dt>已发放</dt><dd>{s.issued ? "10.00 DEMO" : "0.00 DEMO"}</dd></div></dl><div className={styles.snapshot}><strong>受理时的规则说明</strong><p>{s.request.rules.explanation}</p></div><div className={styles.actions}><button type="button" disabled={s.request.status !== "待复核"} onClick={() => dispatch({ type: "requestReturn" })}>要求补充核验记录</button><button type="button" className={styles.primary} disabled={s.request.status !== "待复核"} onClick={() => dispatch({ type: "requestApprove" })}>审核申请通过</button><button type="button" disabled={s.request.status !== "需补充" || !s.profileReady} onClick={() => dispatch({ type: "supplement" })}>补充后重送原申请</button></div><p className={styles.note}>退回补充仍沿用原申请编号。审核通过后，需要在“发放记录”单独确认执行结果。</p></div> : <div className={styles.empty}><ClipboardCheck size={32} aria-hidden="true" /><strong>尚无待复核申请</strong><p>先在“前台规则”核对条件并提交申请。</p></div>}</div>
        <div className={styles.explanation}><h3>审核与发放分别看</h3><div className={styles.stateLine}><span>1</span><div><strong>待复核／需补充</strong><p>申请已经存在，发放金额仍为0.00 DEMO。</p></div></div><div className={styles.stateLine}><span>2</span><div><strong>审核通过</strong><p>允许进入发放环节，不代表已经完成。</p></div></div><div className={styles.stateLine}><span>3</span><div><strong>已发放</strong><p>必须能找到原申请对应的发放记录。</p></div></div><a href="#article-details">查看详细规则说明 ↓</a></div>
      </div> : null}
      {tab === 3 ? <div className={styles.columns}>
        <div className={styles.screen}><div className={styles.screenBar}><ShieldCheck size={17} aria-hidden="true" /><h3>后台 · 发放记录</h3></div><div className={styles.memberForm}><div className={styles.amount}><span>本活动累计发放</span><strong data-campaign-total>{s.issued ? "10.00" : "0.00"}<small>DEMO</small></strong><p data-campaign-ledger-count>{s.issued ? "1笔发放记录" : "0笔发放记录"}</p></div><div className={styles.actions}><button type="button" className={styles.primary} disabled={!s.request || !["审核通过", "已发放"].includes(s.request.status)} onClick={() => dispatch({ type: "issue" })}>{s.issued ? "再次发放同一申请" : "发放已审核申请"}</button></div>{s.issued && s.request ? <div className={styles.ledger} data-campaign-ledger><div><strong>{paymentId}</strong><span className={styles.goodBadge}>已完成</span></div><dl className={styles.facts}><div><dt>关联申请</dt><dd>{s.request.id}</dd></div><div><dt>规则版本</dt><dd>v{s.request.rules.version}</dd></div><div><dt>账号</dt><dd>MEMBER-DEMO-01</dd></div><div><dt>发放金额</dt><dd>10.00 DEMO</dd></div></dl></div> : <p className={styles.note}>尚无发放记录。申请审核通过后才可执行本页示例发放。</p>}</div></div>
        <div className={styles.explanation}><h3>重复点击后，核对这笔记录</h3><div className={styles.uniqueKey}><span>活动</span><strong>{campaignId}</strong><span>账号</span><strong>MEMBER-DEMO-01</strong><span>奖励类型</span><strong>资料完善示例</strong></div><p>本例将这三个条件作为一次发放的业务范围。再次点击返回同一条记录，笔数与累计金额不增加。</p><p className={styles.note}>这是本页状态演示。真实系统仍需服务端唯一约束、权限检查和账务核对，不能仅依赖按钮禁用。</p></div>
      </div> : null}
    </div>
    <div className={styles.bottom}><div><strong>版本记录</strong><p data-campaign-versions>{s.published.length ? s.published.map((item, i) => `v${item.version} ${i === s.published.length - 1 ? "当前生效" : "历史保留"}`).join(" · ") : "尚无已发布版本"}</p></div><button type="button" onClick={() => { dispatch({ type: "reset" }); setTab(0) }}><RotateCcw size={15} aria-hidden="true" />恢复初始示例</button></div>
    {s.events.length ? <ol className={styles.audit} aria-label="本次示例操作记录">{s.events.slice(-5).map((event, index) => <li key={`${s.events.length - 5 + index}-${event}`}><span>{Math.max(1, s.events.length - 4) + index}</span>{event}</li>)}</ol> : null}
    <p className={styles.caption}>界面、账号、审核员和记录均为虚构讲解材料；没有向实际网站发布活动，没有执行真实奖励发放。</p>
  </section>
}
