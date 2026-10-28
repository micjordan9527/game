import type { ReactNode } from "react"
import { ArrowDown, ArrowRight, Check, CircleAlert, FileSearch, LoaderCircle } from "lucide-react"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { adminDemoRecords } from "@/data/adminDemoRecords"
import styles from "./DesignArticleGuide.module.css"

export const designArticleGuides: Record<string, { title: string; intro: string; demo: string }> = {
  "admin-information-hierarchy": { title: "同一笔订单，列表和详情各放什么", intro: "先找到订单，再看依据，最后决定操作。下面两种排法使用同一组虚构信息。", demo: "#scenario" },
  "admin-filter-list-states": { title: "改了条件，列表什么时候变化", intro: "沿着同一组8条虚构工单，看查询前后、异常提示和详情返回。", demo: "#list-demo" },
  "form-validation-submit-feedback": { title: "点击提交后，页面怎样告诉你结果", intro: "同一份公告申请的六种状态对照，并非每次都要经历六步。重点看错误位置、按钮是否可用，以及下一步。", demo: "#form-demo" },
  "admin-bulk-actions": { title: "选中8条，为什么只有4条成功", intro: "按下方演示的默认设置：全部8条，模拟一条失败，不额外模拟状态变化。", demo: "#bulk-action-demo" },
}

function Frame({ n, title, note, children }: { n: string; title: string; note: string; children: ReactNode }) {
  return <figure className={styles.frame} data-guide-frame>
    <figcaption className={styles.frameTitle}><span className={styles.number}>{n}</span><h3>{title}</h3></figcaption>
    <div className={styles.screen}>{children}</div>
    <p className={styles.note}><ArrowRight aria-hidden="true" size={18} /><span>{note}</span></p>
  </figure>
}
function Action({ children, disabled = false, secondary = false }: { children: ReactNode; disabled?: boolean; secondary?: boolean }) {
  return <span className={`${styles.action} ${disabled ? styles.disabled : ""} ${secondary ? styles.secondary : ""}`}>{children}</span>
}
function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
}
function Field({ label, value, error }: { label: string; value: string; error?: string }) {
  return <div className={styles.field}><span>{label}</span><div className={error ? styles.invalid : ""}>{value || "未填写"}</div>{error ? <strong className={styles.error}>{error}</strong> : null}</div>
}
function RecordRow({ id, selected = false, result }: { id: string; selected?: boolean; result?: string }) {
  const row = adminDemoRecords.find((item) => item.id === id)!
  return <div className={styles.record}>
    {selected ? <span className={styles.checked} aria-label="已选中"><Check size={14} aria-hidden="true" /></span> : null}
    <div><strong>{row.id}</strong><span>{row.title}</span></div>
    <Badge tone={result === "成功" ? "good" : result === "失败" ? "bad" : "neutral"}>{result ?? row.status}</Badge>
  </div>
}
const allIds = adminDemoRecords.map((item) => item.id)

function HierarchyGuide() {
  return <>
    <div className={styles.grid}>
      <Frame n="1" title="所有信息挤在同一层" note="状态、金额和动作没有重点，读者要逐项寻找。">
        <div className={styles.browserBar}><span />充值记录 · 示意排法A</div>
        <div className={styles.clutter}>{["外部号 EXT-001", "日志 09:20", "备注 待核对", "编号 DEMO-001", "来源 有效通知", "金额 100.00 DEMO", "会员 DEMO-M001", "状态 确认中", "流水 待核对"].map((text) => <span key={text}>{text}</span>)}</div>
        <div className={styles.actions}><Action secondary>日志</Action><Action secondary>备注</Action><Action secondary>查看</Action></div>
      </Frame>
      <Frame n="2" title="列表先回答：是哪笔、什么状态" note="编号、文字状态、金额和时间放在前面，详情入口紧跟这笔订单。">
        <div className={styles.browserBar}><span />充值记录 · 示意排法B</div>
        <div className={styles.filterStrip}>会员 DEMO-M001 · 状态 确认中</div>
        <div className={styles.orderCard}><div className={styles.row}><strong>DEMO-001</strong><Badge tone="warn">确认中</Badge></div><p className={styles.amount}>100.00 <small>DEMO</small></p><p>更新时间 09:20 · UTC+8</p><Action>查看这笔订单详情 →</Action></div>
      </Frame>
      <Frame n="3" title="详情补充：为什么、接下来做什么" note="同一个订单号贯穿详情与记录。查询入口和资金调整权限分别判断。">
        <div className={styles.browserBar}><span />DEMO-001 · 订单详情</div>
        <dl className={styles.facts}><div><dt>外部编号</dt><dd>EXT-001</dd></div><div><dt>状态来源</dt><dd>最近一次有效通知</dd></div><div><dt>关联流水</dt><dd>待核对</dd></div></dl>
        <div className={styles.notice}><CircleAlert size={18} aria-hidden="true" /><p>原交易仍在确认，暂未找到最终结果。</p></div>
        <div className={styles.actions}><Action>查询原请求</Action><Action disabled>资金调整：需独立授权</Action></div>
        <div className={styles.log}><FileSearch size={18} aria-hidden="true" /><span>09:20 · 示例操作员 · 查询 DEMO-001<br />查询记录不改变订单与余额。</span></div>
      </Frame>
    </div>
    <div className={styles.reference}><h3>对照实际界面：筛选区、列表区与详情入口</h3><LongImageGallery label="充值记录界面参考" groupLabel="界面参考组" emptyMessage="界面参考暂时无法显示。" items={[{ id: "hierarchy-reference", title: "后台案例 · 充值记录", description: "现有本地演示页面截图。筛选在列表上方，每条记录右侧提供详情入口；上面的DEMO订单是独立的讲解示例。", src: "/images/enrichment/admin-finance-02.jpg", width: 1440, height: 900 }]} /></div>
  </>
}

function ListGuide() {
  return <div className={styles.grid}>
    <Frame n="1" title="改了下拉框，还没点击查询" note="输入框是准备查询的条件。下面仍是上次成功查询的8条记录。">
      <div className={styles.browserBar}><span />工单列表 · 点击查询前</div><Field label="记录状态" value="已关闭 ▾" />
      <div className={styles.actions}><Action>查询 ← 需要点击</Action></div>
      <div className={styles.applied}>已应用：全部 · 共8条</div>
      {["DEMO-T008", "DEMO-T007", "DEMO-T006"].map((id) => <RecordRow key={id} id={id} />)}
      <div className={styles.pagination}>第1 / 3页</div>
    </Frame>
    <Frame n="2" title="点击查询，成功后才替换列表" note="条件、数量和记录一起更新；本例新的查询结果回到第一页。">
      <div className={styles.browserBar}><span />工单列表 · 查询成功后</div><Field label="记录状态" value="已关闭 ▾" />
      <div className={styles.applied}>已应用：已关闭 · 共3条</div>
      {["DEMO-T007", "DEMO-T004", "DEMO-T001"].map((id) => <RecordRow key={id} id={id} />)}
      <div className={styles.pagination}>第1 / 1页</div>
    </Frame>
    <Frame n="3" title="查不到记录，与查询失败分别提示" note="0条是一次成功查询的结果。查询失败时，不能把旧结果改写为0条。">
      <div className={styles.comparison}><div><Badge tone="neutral">无匹配记录</Badge><p>查询 DEMO-NOT-FOUND</p><strong className={styles.bigCount}>0<span>条</span></strong><p>查询成功，当前条件没有记录。</p><Action secondary>修改或清空条件</Action></div><div><Badge tone="warn">查询失败</Badge><p>本次没有取得新结果。</p><strong className={styles.bigCount}>8<span>条旧结果</span></strong><p>上次成功：全部状态。</p><Action>重试当前条件</Action></div></div>
    </Frame>
    <Frame n="4" title="看完详情，返回原来的那一条" note="保持全部状态、默认倒序：第二页的T005，返回后仍在第二页和原记录位置。">
      <div className={styles.returnScene}><div className={styles.returnList}><div className={styles.applied}>全部 · 8条 · 第2 / 3页</div><RecordRow id="DEMO-T005" /><Action secondary>查看 T005 详情</Action></div><ArrowDown className={styles.sceneArrow} aria-hidden="true" /><div className={styles.detailMini}><strong>DEMO-T005 · 详情</strong><p>核对账号资料 · 待处理</p><Action>← 返回原列表</Action></div><div className={styles.returnRibbon}>↩ 回到上方T005：保留条件、排序、页码、位置和焦点</div></div>
    </Frame>
  </div>
}

const formStates = [
  { title: "填错：指出具体位置", phase: "字段错误", value: "更", error: "标题至少4个字符", action: "修改后提交", note: "尚未发送申请。错误贴着字段显示，其他输入保留。", tone: "bad" },
  { title: "提交中：等待这次响应", phase: "提交中", action: "提交中… · 暂不可再次提交", note: "输入和提交按钮暂停，防止同一申请被重复发送。", tone: "neutral" },
  { title: "明确未受理：可以修改", phase: "明确未受理", action: "补充内容后提交", note: "已有可信结果说明未受理。本例恢复编辑，按原因补充内容。", tone: "bad" },
  { title: "超时：先查原申请", phase: "结果未知", action: "查询原申请结果", note: "不能确定是否受理。保留原申请号，先查询；不直接重发。", tone: "warn" },
  { title: "查询中：没有新建申请", phase: "查询原申请", action: "查询中…", note: "继续查DEMO-ANN-001，提交次数仍为1。", tone: "neutral" },
  { title: "已受理：仍然没有发布", phase: "已受理 · 等待审核", action: "提交申请 · 暂不可再次提交", note: "申请已经建立。审核通过、公告发布是后面的独立状态。", tone: "good" },
] as const

function FormGuide() {
  return <div className={styles.grid}>
    {formStates.map((state, index) => <Frame key={state.title} n={String(index + 1)} title={state.title} note={state.note}>
      <div className={styles.browserBar}><span />公告申请 · 状态对照</div>
      <Field label="公告标题" value={"value" in state ? state.value : "帮助中心内容更新"} error={"error" in state ? state.error : undefined} />
      <Field label="内容摘要" value="调整订单说明与常见问题分类。" />
      <div className={styles.stateBanner}><Badge tone={state.tone}>{state.phase}</Badge>{[1, 3, 4, 5].includes(index) ? <p>原申请：DEMO-ANN-001</p> : null}{index === 4 ? <p>提交次数：1 → 仍为1</p> : null}</div>
      <div className={styles.actions}>{[1, 4].includes(index) ? <LoaderCircle size={18} aria-hidden="true" /> : null}<Action disabled={[1, 4, 5].includes(index)}>{state.action}</Action></div>
      {index === 3 ? <Action disabled>再次提交 · 暂不可用</Action> : null}
    </Frame>)}
  </div>
}

function BulkGuide() {
  return <div className={styles.grid}>
    <Frame n="1" title="当前页3条，不等于全部8条" note="本例批量列表按编号正序。当前页是T001–T003；全部匹配还包括后两页的5条。">
      <div className={styles.browserBar}><span />全部状态 · 匹配8条</div>
      <div className={styles.pageScope}><Badge>第一页 · 3条</Badge>{allIds.slice(0, 3).map((id) => <RecordRow key={id} id={id} selected />)}</div>
      <div className={styles.otherPages}>第二、三页 · 另外5条<div className={styles.idGrid}>{allIds.slice(3).map((id) => <span key={id}>{id}</span>)}</div></div>
      <div className={styles.actions}><Action secondary>选当前页：3条</Action><Action>选全部匹配：8条</Action></div>
    </Frame>
    <Frame n="2" title="确认窗口把范围和影响摆出来" note="确认时固定这8个编号。执行时还会逐条检查当前状态；取消不会提交批次。">
      <div className={styles.modalBackdrop}><div className={styles.modal}><h4>确认批量关闭范围</h4><dl className={styles.facts}><div><dt>动作</dt><dd>关闭工单</dd></div><div><dt>范围</dt><dd>全部匹配 · 全部状态 · 8条</dd></div></dl><div className={styles.idGrid}>{allIds.map((id) => <span key={id}>{id}</span>)}</div><div className={styles.notice}><CircleAlert size={18} aria-hidden="true" /><p>仅关闭仍为待处理的工单，已关闭记录跳过。</p></div><div className={styles.actions}><Action secondary>取消</Action><Action>确认执行</Action></div></div></div>
    </Frame>
    <Frame n="3" title="完成后，分开交代每条结果" note="默认一条模拟失败：4条成功、1条失败、3条已关闭而跳过。合计仍是原来的8条。">
      <div className={styles.browserBar}><span />BULK-DEMO-01 · 结果</div>
      <div className={styles.resultBar} aria-label="8条中4条成功、1条失败、3条跳过"><span>4 成功</span><span>1 失败</span><span>3 跳过</span></div>
      {allIds.map((id, index) => <RecordRow key={id} id={id} result={index % 3 === 0 ? "跳过" : index === 1 ? "失败" : "成功"} />)}
    </Frame>
    <Frame n="4" title="只处理失败的那一条" note="重试范围只有T002。成功和跳过的7条不加入；结果未知时先查原批次。">
      <div className={styles.browserBar}><span />从原批次选择失败项</div><RecordRow id="DEMO-T002" result="失败" />
      <div className={styles.actions}><Action>仅选择失败项：1条</Action></div><ArrowDown className={styles.sceneArrow} aria-hidden="true" />
      <div className={styles.retry}><Badge tone="good">新批次：成功1条</Badge><p>BULK-DEMO-02 · 对象 DEMO-T002</p><p>本例失败只模拟一次，重新核对后关闭。</p></div>
      <div className={styles.excluded}>其余7条保持原结果，不重复关闭。</div>
    </Frame>
  </div>
}

export function DesignArticleGuide({ slug }: { slug: string }) {
  const guide = designArticleGuides[slug]
  if (!guide) return null
  return <section id="visual-guide" aria-labelledby="visual-guide-title" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${styles.guide}`}>
    <div className={styles.heading}><p>界面信息图 · 示例数据</p><h2 id="visual-guide-title">{guide.title}</h2><p>{guide.intro}</p></div>
    <nav aria-label="本文阅读入口" className={styles.readingNav}><a href="#visual-guide">看界面对照</a><a href={guide.demo}>操作演示 ↓</a><a href="#article-details">查看详细规则 ↓</a></nav>
    <p className={styles.legend}>以下是静态讲解图，按钮用于展示状态；实际操作请进入演示。</p>
    {slug === "admin-information-hierarchy" ? <HierarchyGuide /> : slug === "admin-filter-list-states" ? <ListGuide /> : slug === "form-validation-submit-feedback" ? <FormGuide /> : <BulkGuide />}
    <a href={guide.demo} className={styles.demoLink}>按图中的场景操作演示 <ArrowRight size={18} aria-hidden="true" /></a>
  </section>
}
