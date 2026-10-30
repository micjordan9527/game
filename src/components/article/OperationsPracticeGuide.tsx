"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Check, ClipboardList, FileText, MessageSquare, RotateCcw, ShieldCheck } from "lucide-react"
import styles from "./OperationsPracticeGuide.module.css"

const channelId = "CH-DEMO-021"
const inquiryId = "COM-DEMO-008"
const ticketId = "SUP-DEMO-030"
const guideSlugs = ["channel-quality-review", "community-operations-governance"]

export function hasOperationsPracticeGuide(slug: string) { return guideSlugs.includes(slug) }

function Status({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" }) {
  return <span className={`${styles.status} ${styles[tone]}`}>{children}</span>
}
function Facts({ rows }: { rows: [string, ReactNode][] }) {
  return <dl className={styles.facts}>{rows.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>
}
function Action({ children, onClick, secondary = false, disabled = false }: { children: ReactNode; onClick: () => void; secondary?: boolean; disabled?: boolean }) {
  return <button type="button" className={`${styles.action} ${secondary ? styles.secondary : ""}`} onClick={onClick} disabled={disabled}>{children}</button>
}
function Steps({ labels, step, onChange }: { labels: string[]; step: number; onChange: (next: number) => void }) {
  return <nav className={styles.steps} aria-label="切换案例界面">{labels.map((label, i) => <button type="button" key={label} aria-current={step === i ? "step" : undefined} onClick={() => onChange(i)}><span>{i + 1}</span>{label}</button>)}</nav>
}
function Note({ children }: { children: ReactNode }) { return <div className={styles.note}><ShieldCheck size={18} aria-hidden="true" /><p>{children}</p></div> }

const channelStages = [
  { title: "先看这一个渠道的资料", note: "渠道编号固定。联系人、合作范围和来源附件分开记录，资料不足的位置直接显示。" },
  { title: "把问题挂到原渠道", note: "异常记录保留发生对象、缺少的材料和负责跟进的人，不用聊天记录代替处理状态。" },
  { title: "核对依据，再保存处理结论", note: "先核对补充资料。暂停与继续观察需要不同依据，复核结果不会改写原异常记录。" },
  { title: "归档结论，历史记录仍可查", note: "归档保存这次复核的结果和关联编号，不删除渠道资料、异常记录或原附件说明。" },
]

function ChannelCase() {
  const [step, setStep] = useState(0)
  const [supplemented, setSupplemented] = useState(false)
  const [decision, setDecision] = useState<"pause" | "observe">("pause")
  const [savedDecision, setSavedDecision] = useState<"pause" | "observe">("pause")
  const stage = channelStages[step]
  const reset = () => { setStep(0); setSupplemented(false); setDecision("pause"); setSavedDecision("pause") }
  const archive = () => { if (decision === "observe" && !supplemented) return; setSavedDecision(decision); setStep(3) }

  return <section id="channel-quality-case" data-operations-practice="channel" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${styles.guide}`} aria-labelledby="channel-case-title">
    <header className={styles.heading}><p>渠道资料与复核 · 界面示例</p><h2 id="channel-case-title">同一个渠道，从资料到复核结论</h2><p>沿着 {channelId} 看资料页、异常记录、复核和归档。点击界面中的按钮，也可直接切换四个时刻。</p></header>
    <p className={styles.example}>以下人物、编号、材料和时间均为虚构。操作只改变本页示例，不提交真实渠道资料。</p>
    <div className={styles.explorer}>
      <Steps labels={["渠道资料", "异常记录", "复核处理", "归档结果"]} step={step} onChange={setStep} />
      <div className={styles.sceneHeading}><h3>{stage.title}</h3><span>{step + 1} / 4</span></div>
      <div className={styles.workspace}>
        <div className={styles.screen} data-operations-screen data-operation-screen>
          <div className={styles.browser}><ClipboardList size={16} aria-hidden="true" />运营工作台 <span>{channelId}</span></div>
          {step === 0 ? <>
            <div className={styles.screenTitle}><h4>渠道资料 · 示例渠道21</h4><Status tone="warn">资料待补</Status></div>
            <Facts rows={[["渠道编号", channelId], ["联系人", "商务A · 示例联系人"], ["合作范围", "素材展示与咨询反馈"], ["来源说明", "展示页面位置已登记"], ["授权附件", <span className={styles.warning} key="missing">未提供 · 需补充</span>], ["复核负责人", "运营B"]]} />
            <div className={styles.file}><FileText size={18} aria-hidden="true" /><div><strong>页面位置说明.pdf</strong><span>示例附件记录 · 不提供真实文件</span></div><Status>已登记</Status></div>
            <div className={styles.actions}><Action onClick={() => setStep(1)}>记录缺少的材料 <ArrowRight size={16} aria-hidden="true" /></Action></div>
          </> : step === 1 ? <>
            <div className={styles.screenTitle}><h4>异常 CH-ISS-007</h4><Status tone="warn">待复核</Status></div>
            <Facts rows={[["关联渠道", channelId], ["关联素材", "DEMO-MAT-03"], ["发现时间", "10月30日 09:10 · UTC+8"], ["问题类型", "素材授权依据缺失"], ["当前处理", "暂停新增该素材，等待核对"], ["跟进人", "运营B"]]} />
            <div className={styles.field}><span>补充要求</span><div>补充素材授权依据及对应展示位置；不以口头承诺替代附件记录。</div></div>
            <div className={styles.actions}><Action onClick={() => setStep(2)}>打开这条异常的复核</Action></div>
          </> : step === 2 ? <>
            <div className={styles.screenTitle}><h4>复核 REV-DEMO-007</h4><Status tone={supplemented ? "good" : "warn"}>{supplemented ? "补充材料已核对" : "依据仍不完整"}</Status></div>
            <Facts rows={[["原异常", "CH-ISS-007"], ["关联渠道", channelId], ["复核人", "运营B"], ["授权依据", supplemented ? "授权说明与素材编号一致" : "尚未提供授权附件"]]} />
            <div className={styles.actions}><Action secondary onClick={() => { setSupplemented(!supplemented); if (supplemented) setDecision("pause") }}>{supplemented ? "重看未补齐的情况" : "模拟收到并核对补充资料"}</Action></div>
            <label className={styles.field}>处理结论<select aria-label="处理结论" value={decision} onChange={(event) => setDecision(event.target.value as "pause" | "observe")}><option value="pause">暂停合作，保留历史记录</option><option value="observe" disabled={!supplemented}>材料补齐，继续观察</option></select></label>
            <p className={styles.inlineHint}>{decision === "pause" ? "本例原因：授权依据不完整时暂停；即使本次材料补齐，也可按独立复核结论维持暂停。" : "本例依据：补充授权与原素材对应；继续观察不等于所有资料永久有效。"}</p>
            <div className={styles.actions}><Action onClick={archive}>保存复核并归档</Action></div>
          </> : <>
            <div className={styles.screenTitle}><h4>归档 ARC-DEMO-007</h4><Status tone={savedDecision === "pause" ? "warn" : "good"}>{savedDecision === "pause" ? "暂停合作" : "继续观察"}</Status></div>
            <div className={styles.result}><Check size={24} aria-hidden="true" /><div><strong>复核结论已保存到示例记录</strong><p>{savedDecision === "pause" ? "暂停新增合作内容。重新评估时建立新的复核记录。" : "授权附件已核对，本次异常结束；按约定周期继续复核。"}</p></div></div>
            <Facts rows={[["渠道", channelId], ["异常", "CH-ISS-007"], ["复核", "REV-DEMO-007"], ["归档人", "运营B"], ["原资料", "保留 · 不删除"], ["素材状态", savedDecision === "pause" ? "保持暂停" : "可按本次批准范围使用"]]} />
            <div className={styles.actions}><Action secondary onClick={() => setStep(1)}>返回原异常记录</Action></div>
          </>}
        </div>
        <aside className={styles.context} aria-label="渠道关联记录">
          <h4>这几处始终关联同一渠道</h4>
          <ol className={styles.recordLinks}>{[channelId, "CH-ISS-007", "REV-DEMO-007", "ARC-DEMO-007"].map((id, i) => <li key={id} data-active={step === i}><span>{["渠道资料", "异常记录", "复核记录", "归档记录"][i]}</span><strong>{id}</strong></li>)}</ol>
          <Note>{stage.note}</Note>
        </aside>
      </div>
      <footer className={styles.controls}><Action secondary disabled={step === 0} onClick={() => setStep(step - 1)}>上一个界面</Action><Action secondary disabled={step === 3} onClick={() => setStep(step + 1)}>下一个界面</Action><button type="button" className={styles.reset} onClick={reset}><RotateCcw size={15} aria-hidden="true" />重看案例</button></footer>
    </div>
    <div className={styles.related}><Link href="/articles/access-approval-audit#visual-guide">查看角色权限与复核分工 →</Link><Link href="/articles/tg-message-media">查看推送素材与消息预览 →</Link></div>
  </section>
}

const communityStages = [
  { title: "群里只说明问题，不公开账号资料", note: "管理员先确认问题类型。账号与资金问题转入私密工单，群内不索取密码或完整身份资料。" },
  { title: "工单里补齐对象和负责人", note: "咨询号、工单号和账号申请号互相关联。创建工单不会直接恢复账号，也不会改变资金状态。" },
  { title: "核对原记录，再给用户明确回复", note: "本例账号已恢复，但旧会话被撤销。客服解释重新登录方法，不把工单回复当成账号操作。" },
  { title: "用户确认后关闭，原处理记录保留", note: "工单关闭说明本次咨询结束。账号状态、通知状态和工单状态分别记录，不互相替代。" },
]

function CommunityCase() {
  const [step, setStep] = useState(0)
  const [replySent, setReplySent] = useState(false)
  const stage = communityStages[step]
  const choose = (next: number) => { setStep(next); if (next === 2) setReplySent(false) }
  const reset = () => { setStep(0); setReplySent(false) }

  return <section id="community-support-case" data-operations-practice="community" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${styles.guide}`} aria-labelledby="community-case-title">
    <header className={styles.heading}><p>社群咨询与客服协作 · 界面示例</p><h2 id="community-case-title">一条群内咨询，怎样转交并回复</h2><p>成员反馈“账号恢复后仍进不去”。从群内消息进入私密工单，再查看核对结果和用户确认。</p></header>
    <p className={styles.example}>以下消息、人物、编号和状态均为虚构。按钮演示处理顺序，不发送消息或操作真实账号。</p>
    <div className={styles.explorer}>
      <Steps labels={["群内咨询", "建立工单", "核对与回复", "确认与关闭"]} step={step} onChange={choose} />
      <div className={styles.sceneHeading}><h3>{stage.title}</h3><span>{step + 1} / 4</span></div>
      <div className={styles.workspace}>
        <div className={styles.screen} data-operations-screen data-operation-screen>
          <div className={styles.browser}><MessageSquare size={16} aria-hidden="true" />{step === 0 ? "社群消息预览" : "客服工作台"}<span>{step === 0 ? inquiryId : ticketId}</span></div>
          {step === 0 ? <>
            <div className={styles.screenTitle}><h4>咨询 {inquiryId}</h4><Status tone="warn">待转交</Status></div>
            <div className={styles.messages}><div className={`${styles.message} ${styles.mine}`}><strong>成员08 · 10:05</strong><p>提示账号已恢复，但我还停在原来的登录页面，现在该怎么处理？</p></div><div className={styles.message}><strong>管理员A · 10:06</strong><p>请从站内客服入口继续咨询，不要在群里发送账号、密码或验证资料。我会把这条问题转给账号支持。</p></div></div>
            <div className={styles.actions}><Action onClick={() => choose(1)}>按原咨询建立私密工单</Action></div>
          </> : step === 1 ? <>
            <div className={styles.screenTitle}><h4>工单 {ticketId}</h4><Status tone="warn">待账号支持核对</Status></div>
            <Facts rows={[["来源咨询", inquiryId], ["问题类型", "账号访问"], ["成员标识", "成员08 · 脱敏示例"], ["原恢复申请", "ACC-DEMO-008"], ["负责人", "客服A"], ["协作组", "账号支持组"]]} />
            <div className={styles.internal}><strong>内部备注 · 仅工作人员可见</strong><p>查询原恢复申请与会话状态。不要要求用户提供密码，不新建第二份恢复申请。</p></div>
            <div className={styles.actions}><Action onClick={() => choose(2)}>转交账号支持并查看核对结果</Action></div>
          </> : step === 2 ? <>
            <div className={styles.screenTitle}><h4>原申请 ACC-DEMO-008</h4><Status tone="good">账号已恢复</Status></div>
            <div className={styles.checks}><div><span>账号状态</span><strong>已恢复</strong></div><div><span>旧会话</span><strong>已撤销</strong></div><div><span>资金限制</span><strong>按原状态保留</strong></div></div>
            <div className={styles.internal}><strong>账号支持 · 10:10</strong><p>原恢复申请已完成。旧会话仍不可用，需要重新登录；本次核对没有解除其他限制。</p></div>
            <div className={styles.field}><span>对外回复 · 私密工单中展示</span><div>账号已恢复，原登录会话已失效。请退出原页面后重新登录；如仍提示异常，请在此工单补充脱敏后的提示内容。</div></div>
            <div className={styles.actions}><Action disabled={replySent} onClick={() => setReplySent(true)}>{replySent ? "回复已保存" : "发送这条示例回复"}</Action><Action secondary disabled={!replySent} onClick={() => setStep(3)}>模拟用户确认并关闭</Action></div>
            <p className={styles.inlineHint} role="status">{replySent ? "回复已展示在原工单；收到用户确认后再关闭。" : "先保存回复，再查看用户确认与关闭结果。"}</p>
          </> : <>
            <div className={styles.screenTitle}><h4>工单 {ticketId}</h4><Status tone="good">已关闭</Status></div>
            <div className={styles.messages}><div className={styles.message}><strong>客服A · 10:12</strong><p>账号已恢复，请退出原页面后重新登录。其他限制以账号页面的独立状态为准。</p></div><div className={`${styles.message} ${styles.mine}`}><strong>成员08 · 10:15</strong><p>重新登录后可以正常进入，这个问题已解决。</p></div></div>
            <Facts rows={[["关闭依据", "用户已确认本次登录问题解决"], ["工单状态", "已关闭 · 10:16"], ["回复状态", "已展示 · 保留原文"], ["账号申请", "ACC-DEMO-008 · 未重复提交"]]} />
            <div className={styles.actions}><Action secondary onClick={() => choose(1)}>回看工单关联记录</Action></div>
          </>}
        </div>
        <aside className={styles.context} aria-label="咨询和工单关联记录">
          <h4>群消息和私密记录分开</h4>
          <ol className={styles.recordLinks}>{[["群内咨询", inquiryId], ["私密工单", ticketId], ["原账号申请", "ACC-DEMO-008"]].map(([label, id], i) => <li key={id} data-active={step === 0 ? i === 0 : i === 1}><span>{label}</span><strong>{id}</strong></li>)}</ol>
          <Note>{stage.note}</Note>
        </aside>
      </div>
      <footer className={styles.controls}><Action secondary disabled={step === 0} onClick={() => choose(step - 1)}>上一个界面</Action><Action secondary disabled={step === 3} onClick={() => choose(step + 1)}>下一个界面</Action><button type="button" className={styles.reset} onClick={reset}><RotateCcw size={15} aria-hidden="true" />重看案例</button></footer>
    </div>
    <div className={styles.related}><Link href="/articles/notification-support-tickets#visual-guide">查看用户消息与内部备注对照 →</Link><Link href="/articles/member-account-states#account-recovery-case">查看账号受限与恢复案例 →</Link></div>
  </section>
}

export function OperationsPracticeGuide({ slug }: { slug: string }) {
  if (!hasOperationsPracticeGuide(slug)) return null
  return slug === "channel-quality-review" ? <ChannelCase /> : <CommunityCase />
}
