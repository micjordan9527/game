import Link from "next/link"
import { FileText, LockKeyhole, ShieldAlert } from "lucide-react"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { Frame, Action, Badge, Field } from "./DesignArticleGuide"
import base from "./DesignArticleGuide.module.css"
import styles from "./SupportPermissionGuide.module.css"

const guides: Record<string, { title: string; intro: string }> = {
  "notification-support-tickets": {
    title: "用户问了什么，客服怎样接着处理",
    intro: "同一条提现咨询，从用户消息到客服回复。重点看订单号、负责人，以及哪些内容只供内部查看。",
  },
  "access-approval-audit": {
    title: "同一笔退款，客服和财务各能做什么",
    intro: "客服提交申请，财务独立审核，执行后再查询原退款结果。下图只说明本例的分工，实际权限按岗位和授权配置。",
  },
}

export function hasSupportPermissionGuide(slug: string) { return !!guides[slug] }

function SupportPanels() {
  return <div className={base.grid}>
    <Frame n="1" title="用户看到：咨询记录与当前进度" note="咨询号和订单号一起显示。等待核对时说明下一步，不提前写成付款成功。">
      <div className={base.browserBar}><span />用户端 · 我的咨询</div>
      <div className={styles.ticketHead}><div><strong>SUP-DEMO-001</strong><span>提现订单 WD-DEMO-001</span></div><Badge tone="warn">处理中</Badge></div>
      <div className={styles.messages} data-support-user-thread>
        <div className={`${styles.message} ${styles.mine}`}><strong>我 · 09:10</strong><p>这笔提现还没到账，能帮我查一下吗？</p></div>
        <div className={styles.message}><strong>客服 · 09:12</strong><p>已收到咨询，正在按原订单核对付款结果。请在这条咨询里查看进度。</p></div>
      </div>
      <div className={base.actions}><Action secondary>查看原订单</Action><Action secondary>补充说明</Action></div>
      <p>最近更新：10月28日 09:12 · UTC+8</p>
    </Frame>
    <Frame n="2" title="客服看到：负责人和内部备注" note="内部备注与对外回复分区。等待付款组核对时，仍保留负责跟进的客服。">
      <div className={base.browserBar}><span />客服工作台 · SUP-DEMO-001</div>
      <dl className={base.facts}><div><dt>关联订单</dt><dd>WD-DEMO-001</dd></div><div><dt>负责人</dt><dd>客服A</dd></div><div><dt>协作组</dt><dd>付款核对组</dd></div><div><dt>下次复核</dt><dd>09:30 · UTC+8</dd></div></dl>
      <div className={styles.internal} data-support-internal><strong><LockKeyhole aria-hidden="true" size={17} />内部备注 · 用户不可见</strong><p>09:14：已查原渠道请求，暂未取得最终结果。由付款核对组继续查询，不另建付款。</p></div>
      <Field label="对外回复 · 用户可见" value="正在核对原付款结果，有进展后在此更新。" />
      <div className={base.actions}><Action>发送对外回复</Action><Action secondary>转交协作组</Action></div>
    </Frame>
    <Frame n="3" title="需要补资料时，具体说明缺什么" note="本例只补充未到账的时间说明，不索取密码或完整银行卡。补充后沿用原咨询号。">
      <div className={base.browserBar}><span />用户端 · 同一条咨询</div>
      <Badge tone="warn">待用户补充</Badge>
      <div className={styles.messages}><div className={styles.message}><strong>客服 · 09:18</strong><p>请补充你最后一次查看收款记录的时间。如附截图，请遮住姓名和完整账号。</p></div></div>
      <Field label="补充说明" value="09:20查看，仍未看到该笔收款。" />
      <div className={styles.attachment}><FileText size={18} aria-hidden="true" /><span>收款记录-脱敏.png · 示例附件</span></div>
      <div className={base.actions}><Action>提交补充资料</Action></div>
      <div className={base.applied}>提交后：同一咨询继续处理 · 负责人仍为客服A</div>
    </Frame>
    <Frame n="4" title="回复结果后，分开看工单与送达" note="只有原业务确认付款并核对账务后，才回复完成。通知失败只重试通知，不重做提现。">
      <div className={base.browserBar}><span />客服工作台 · 处理结果</div>
      <div className={styles.timeline}><div><strong>09:30 · 付款核对组</strong><p>按WD-DEMO-001查到渠道付款完成，关联账务已核对。</p></div><div><strong>09:32 · 客服对外回复</strong><p>该笔提现已确认付款完成，请核对收款记录；如仍有问题，可继续补充说明。</p></div></div>
      <div className={styles.split}><div><strong>工单处理</strong><span><Badge tone="good">已解决</Badge></span><span>等待用户确认</span></div><div><strong>结果通知</strong><span><Badge tone="bad">外部通知失败</Badge></span><span>站内回复已保存</span></div></div>
      <div className={base.actions}><Action secondary>重试原通知</Action><Action secondary>查看原付款记录</Action></div>
    </Frame>
  </div>
}

function PermissionPanels() {
  return <div className={base.grid}>
    <Frame n="1" title="客服：查订单，提交退款申请" note="本例客服可以查询站点A和提交申请，不能审批或直接执行退款。查看权限不自动包含导出。">
      <div className={base.browserBar}><span />客服A · 站点A · 订单详情</div>
      <div className={base.orderCard}><div className={base.row}><strong>DP-DEMO-001</strong><Badge tone="good">充值已完成</Badge></div><p className={base.amount}>100.00 <small>DEMO</small></p><p>会员 DEMO-M001 · 已退款 0.00 DEMO</p></div>
      <Field label="退款原因" value="用户申请退回本笔款项，待核对原付款。" />
      <div className={base.actions}><Action>提交退款申请</Action><Action disabled>执行退款 · 无权限</Action></div>
      <div className={styles.scopeDenied}><ShieldAlert size={18} aria-hidden="true" /><p>访问站点B订单：无权查看。请切回已授权站点。</p></div>
    </Frame>
    <Frame n="2" title="财务：看同一笔申请，核对金额" note="本例财务B有站点A的退款审批权，执行由独立服务处理。审核不会直接改变原订单或余额。">
      <div className={base.browserBar}><span />财务B · 站点A · 退款审核</div>
      <dl className={base.facts}><div><dt>申请编号</dt><dd>APR-DEMO-001</dd></div><div><dt>原订单</dt><dd>DP-DEMO-001</dd></div><div><dt>申请人</dt><dd>客服A</dd></div><div><dt>退款金额</dt><dd>100.00 DEMO</dd></div><div><dt>原付款</dt><dd>已完成 · 100.00 DEMO</dd></div><div><dt>历史退款</dt><dd>0.00 DEMO</dd></div></dl>
      <div className={base.actions}><Action>核对后批准</Action><Action secondary>驳回并说明原因</Action></div>
      <p>审核范围：站点A · 此申请 · 此金额</p>
    </Frame>
    <Frame n="3" title="不能自己批准，也不能沿用旧金额" note="本例要求独立审核。客服A不能批准自己的申请；批准后若金额变化，需要重新审核。">
      <div className={base.browserBar}><span />审批提示 · 两种不同情况</div>
      <div className={styles.snapshot}><h4>申请人尝试批准自己的申请</h4><Badge tone="bad">审批被阻止</Badge><p>申请人：客服A · 当前审批人：客服A</p><div className={base.actions}><Action secondary>交由独立审核人处理</Action></div></div>
      <div className={styles.snapshot}><h4>已批准100.00，申请改为80.00</h4><dl className={base.facts}><div><dt>原批准</dt><dd>100.00 DEMO</dd></div><div><dt>修改后</dt><dd>80.00 DEMO</dd></div></dl><Badge tone="warn">原批准失效 · 需重新审核</Badge><div className={base.actions}><Action disabled>执行修改后的退款</Action></div></div>
    </Frame>
    <Frame n="4" title="审批通过后，继续看原退款结果" note="以下是同一退款先未知、后查明的两个时刻。查询沿用原退款号，不新建第二笔退款。">
      <div className={base.browserBar}><span />退款 RF-DEMO-001 · 原金额100.00</div>
      <div className={styles.snapshot}><h4>09:40 · 提交后响应超时</h4><div className={base.row}><Badge tone="good">审批通过</Badge><Badge tone="warn">执行结果未知</Badge></div><p>查询原退款号 RF-DEMO-001</p><div className={base.actions}><Action>查询原退款</Action><Action disabled>重复创建退款</Action></div></div>
      <div className={styles.snapshot}><h4>09:45 · 原请求查明后</h4><Badge tone="good">退款已完成</Badge><p>渠道回执与账务流水已核对 · 100.00 DEMO</p></div>
      <div className={base.log}><FileText size={18} aria-hidden="true" /><span>审核：财务B · 执行：退款服务<br />APR-DEMO-001 → RF-DEMO-001<br />执行结果与审批记录分别保留。</span></div>
    </Frame>
  </div>
}

export function SupportPermissionGuide({ slug }: { slug: string }) {
  const guide = guides[slug]
  if (!guide) return null
  const support = slug === "notification-support-tickets"
  return <section id="visual-guide" aria-labelledby="visual-guide-title" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${base.guide}`}>
    <div className={base.heading}><p>界面图解 · 示例数据</p><h2 id="visual-guide-title">{guide.title}</h2><p>{guide.intro}</p></div>
    <nav aria-label="本文阅读入口" className={base.readingNav}><a href="#visual-guide">看界面对照</a><a href="#interface-reference">看现有后台截图</a><a href="#article-details">查看详细说明 ↓</a></nav>
    <p className={base.legend}>以下四图为静态界面示意，人物、编号、金额及时间均为虚构；图内按钮只说明位置与状态，不执行操作。</p>
    {support ? <SupportPanels /> : <PermissionPanels />}
    <div id="interface-reference" className={`scroll-mt-24 ${styles.references}`}><h3>对照现有后台案例</h3><p>{support ? "现有后台演示中的会员查询页，可对照查询对象和详情入口。上面的工单界面为独立讲解示例，不代表该后台已经提供工单功能。" : "现有后台演示中的充值列表和详情，可对照订单字段与信息分组。截图不证明退款审批、服务端权限或真实资金处理已经实现。"}</p>
      <LongImageGallery label={support ? "客服查询界面参考" : "财务订单界面参考"} groupLabel={support ? "客服查询截图" : "财务订单截图"} emptyMessage="界面参考暂时无法显示。" items={support ? [
        { id: "support-query", title: "客服 · 会员查询", description: "现有本地后台演示的实际截图，内容为示例数据。先定位会员，再按稳定编号查询相关业务。", src: "/images/enrichment/admin-support-02.jpg", width: 1440, height: 900 },
      ] : [
        { id: "finance-list", title: "财务 · 充值记录", description: "现有本地后台演示的实际截图。对照筛选范围、订单字段与详情入口。", src: "/images/enrichment/admin-finance-02.jpg", width: 1440, height: 900 },
        { id: "finance-detail", title: "财务 · 订单详情", description: "现有本地后台演示的实际截图。详情提供信息分组，不据此推断操作权限。", src: "/images/enrichment/admin-finance-03.jpg", width: 1440, height: 900 },
      ]} />
      <div className={styles.links}><Link href="/cases/admin-optimization#admin-role-tour">查看后台角色导览</Link><Link href={support ? "/articles/access-approval-audit#visual-guide" : "/articles/notification-support-tickets#visual-guide"}>{support ? "看客服与财务权限对照" : "看用户消息与客服处理"}</Link>{support ? <Link href="/articles/wallet-payment-reconciliation#withdrawal-case">操作现有提现异常演示</Link> : null}</div>
    </div>
  </section>
}
