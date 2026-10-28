import Link from "next/link"
import { CircleHelp, Gamepad2, LockKeyhole, Wrench } from "lucide-react"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { reportExampleFor, reportExampleOrders, reportExampleTime } from "@/data/reportVisualExample"
import { Frame, Action, Badge, Field } from "./DesignArticleGuide"
import base from "./DesignArticleGuide.module.css"
import styles from "./ReportCatalogGuide.module.css"

const guides: Record<string, { title: string; intro: string }> = {
  "data-report-metrics": { title: "350 USD是怎样从三笔订单加出来的", intro: "先固定日期、币种和成功入账状态，再逐笔核对人数、笔数与金额。四组界面使用同一组虚构订单。" },
  "game-catalog-availability": { title: "同一个游戏，为什么有时能进入、有时不能", intro: "分别看正常、维护、账号受限与查询失败时的页面提示。四图是不同条件下的独立示例，不是一次操作的连续四步。" },
}
export function hasReportCatalogGuide(slug: string) { return !!guides[slug] }

function ReportNumbers({ day, currency }: { day: string; currency: "USD" | "EUR" }) {
  const report = reportExampleFor(day, currency)
  return <dl className={styles.metrics} data-report-summary={`${day}-${currency}`}>
    <div><dt>成功充值会员</dt><dd>{report.members}<small>人</small></dd></div>
    <div><dt>成功充值订单</dt><dd>{report.count}<small>笔</small></dd></div>
    <div><dt>成功入账金额</dt><dd>{(report.amountMinor / 100).toFixed(2)}<small>{currency}</small></dd></div>
  </dl>
}

function ReportPanels() {
  const current = reportExampleFor("2026-10-28", "USD")
  const unknown = reportExampleOrders.find((row) => row.id === "DEMO-R004")!
  return <div className={base.grid}>
    <Frame n="1" title="先看报表用了哪些条件" note="人数按会员去重，笔数按订单去重；两笔都属于会员A，人数仍只计一人。">
      <div className={base.browserBar}><span />充值日报 · 示例站点A</div>
      <Field label="业务日期 · 成功入账时间" value="2026-10-28 · UTC+8" />
      <div className={base.filterStrip}>币种 USD · 状态 已入账</div>
      <ReportNumbers day="2026-10-28" currency="USD" />
      <div className={base.actions}><Action>查看这3笔明细</Action></div>
      <p>数据截止：10月28日 10:00 · UTC+8<br />本例不含手续费、退款和冲正。</p>
    </Frame>
    <Frame n="2" title="打开明细，三个金额逐项相加" note="报表与明细沿用相同条件。R001按UTC+8在28日00:03入账，计入28日。">
      <div className={base.browserBar}><span />明细 · 10月28日 / USD / 已入账</div>
      <div data-report-rows>{current.rows.map((row) => <div key={row.id} className={styles.order}><div><strong>{row.id} · {row.member}</strong><Badge tone="good">已入账</Badge></div><p>入账：{reportExampleTime(row.creditedAt!)} · UTC+8</p><b>{(row.amountMinor / 100).toFixed(2)} {row.currency}</b></div>)}</div>
      <div className={styles.equation}>100.00 + 200.00 + 50.00<br />= 350.00 USD</div>
      <p>会员A两笔 · 会员B一笔 → 2人、3笔。</p>
    </Frame>
    <Frame n="3" title="重复通知和未知结果怎样显示" note="重复通知属于原订单；未知订单保留在异常列表，暂不加入成功金额。">
      <div className={base.browserBar}><span />核对成功金额之外的记录</div>
      <div className={`${styles.order} ${styles.excluded}`}><div><strong>DEMO-R003 · 重复通知</strong><Badge>不新增订单</Badge></div><p>同一业务号的50.00 USD通知再次到达。原订单已计入一次。</p><div className={base.applied}>仍为3笔 · 350.00 USD</div></div>
      <div className={`${styles.order} ${styles.excluded}`}><div><strong>{unknown.id} · {unknown.member}</strong><Badge tone="warn">{unknown.status}</Badge></div><p>{(unknown.amountMinor / 100).toFixed(2)} USD · 没有成功入账时间</p><div className={base.actions}><Action secondary>查询原订单结果</Action></div><p>暂不计入成功金额，不能直接加成430.00。</p></div>
    </Frame>
    <Frame n="4" title="换币种或日期，明细也要一起换" note="USD和EUR分别展示，不直接相加。跨日按入账时间换算到同一时区后归属。">
      <div className={base.browserBar}><span />不同筛选 · 不同结果</div>
      <div className={styles.sample}><h4>10月28日 · EUR · 已入账</h4><p>DEMO-R005 · 会员C</p><ReportNumbers day="2026-10-28" currency="EUR" /></div>
      <div className={styles.sample}><h4>10月27日 · USD · 已入账</h4><p>DEMO-R006 · 会员D<br />入账：10月27日 23:58 · UTC+8</p><ReportNumbers day="2026-10-27" currency="USD" /></div>
    </Frame>
  </div>
}

function GamePanels() {
  return <div className={base.grid}>
    <Frame n="1" title="正常：目录、厂商和账号条件都满足" note="这是可进入的讲解示例。真实可用性还需核对当前账号、区域、币种与登录结果。">
      <div className={base.browserBar}><span />游戏目录 · 示例站点A</div>
      <div className={styles.game} data-game-scene="available"><div className={styles.cover}><Gamepad2 size={36} aria-hidden="true" /><div><strong>示例游戏21</strong><span>独立界面示意</span></div></div><div className={styles.gameBody}><Badge tone="good">可进入</Badge><p>GAME-DEMO-21 · 会员A</p><dl className={base.facts}><div><dt>厂商状态</dt><dd>可用</dd></div><div><dt>账号条件</dt><dd>满足</dd></div><div><dt>区域 / 币种</dt><dd>本例均支持</dd></div></dl><div className={base.actions}><Action>进入游戏</Action></div><p>示例响应：登录成功<br />LOGIN-DEMO-001</p></div></div>
    </Frame>
    <Frame n="2" title="维护：说明维护原因，暂停进入" note="维护提示针对当前游戏和厂商状态；本例没有可靠结束时间，所以不显示恢复倒计时。">
      <div className={base.browserBar}><span />同一游戏 · 厂商维护示例</div>
      <div className={styles.game} data-game-scene="maintenance"><div className={`${styles.cover} ${styles.maintenance}`}><Wrench size={36} aria-hidden="true" /><div><strong>示例游戏21</strong><span>目录仍可见</span></div></div><div className={styles.gameBody}><Badge tone="warn">维护中</Badge><p>GAME-DEMO-21 · 会员A</p><p>厂商正在维护，暂时无法进入。可稍后重新查看状态。</p><div className={base.actions}><Action disabled>维护中 · 暂不可进入</Action></div><div className={styles.reason}><strong>本例原因码</strong><code>PROVIDER_MAINTENANCE</code></div></div></div>
    </Frame>
    <Frame n="3" title="账号受限：给当前用户处理入口" note="厂商可用，但会员B受限。这个账号的限制不等于所有用户都不能进入。">
      <div className={base.browserBar}><span />同一游戏 · 不同账号条件</div>
      <div className={styles.game} data-game-scene="restricted"><div className={`${styles.cover} ${styles.restricted}`}><LockKeyhole size={36} aria-hidden="true" /><div><strong>示例游戏21</strong><span>厂商可用 · 当前账号受限</span></div></div><div className={styles.gameBody}><Badge tone="bad">账号受限</Badge><p>GAME-DEMO-21 · 会员B</p><p>当前账号暂不满足进入条件。请查看限制说明或联系支持。</p><div className={base.actions}><Action disabled>暂不可进入</Action><Action secondary>查看受限说明</Action></div><div className={styles.reason}><strong>本例原因码</strong><code>ACCOUNT_RESTRICTED</code></div></div></div>
    </Frame>
    <Frame n="4" title="查询失败：保留未知，提供重试" note="本次状态查询超时，不能据此改成维护或下架。重试的是状态查询，不涉及资金操作。">
      <div className={base.browserBar}><span />同一游戏 · 状态查询未完成</div>
      <div className={styles.game} data-game-scene="query-failed"><div className={`${styles.cover} ${styles.unknown}`}><CircleHelp size={36} aria-hidden="true" /><div><strong>示例游戏21</strong><span>当前状态待确认</span></div></div><div className={styles.gameBody}><Badge>查询失败 · 状态未知</Badge><p>GAME-DEMO-21 · 会员A</p><p>本次查询未完成，暂时不能确认是否可进入。</p><div className={base.actions}><Action>重试状态查询</Action><Action disabled>进入游戏</Action></div><div className={styles.reason}><strong>本例查询记录</strong><code>CHECK-DEMO-004<br />STATUS_QUERY_TIMEOUT</code></div></div></div>
    </Frame>
  </div>
}

export function ReportCatalogGuide({ slug }: { slug: string }) {
  const guide = guides[slug]
  if (!guide) return null
  const report = slug === "data-report-metrics"
  return <section id="visual-guide" aria-labelledby="visual-guide-title" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${base.guide}`}>
    <div className={base.heading}><p>界面图解 · 示例数据</p><h2 id="visual-guide-title">{guide.title}</h2><p>{guide.intro}</p></div>
    <nav aria-label="本文阅读入口" className={base.readingNav}><a href="#visual-guide">看界面对照</a>{report ? <a href="#report-interface-reference">看现有后台截图</a> : <a href="#game-related-examples">看相关状态示例</a>}<a href="#article-details">查看详细说明 ↓</a></nav>
    <p className={base.legend}>以下四图是静态讲解界面，记录与结果均为虚构；图内按钮仅说明位置与状态，不发起查询或登录。{report ? "金额按原币分别统计。" : "游戏、账号和原因码不对应真实厂商协议。"}</p>
    {report ? <ReportPanels /> : <GamePanels />}
    {report ? <div id="report-interface-reference" className={`scroll-mt-24 ${styles.reference}`}><h3>对照现有后台：资金概览与充值记录</h3><p>以下是现有后台演示的实际截图，使用示例数据。上方350.00 USD为独立讲解数据，不对应截图中的金额；对照的是汇总、筛选与明细的位置。</p><LongImageGallery label="报表界面参考" groupLabel="报表界面截图" emptyMessage="参考截图暂时无法显示。" items={[
      { id: "report-overview", title: "财务 · 资金概览", description: "现有后台演示截图。查看汇总区域与统计范围提示，不能只凭总额判断逐笔一致。", src: "/images/enrichment/admin-finance-01.jpg", width: 1440, height: 900 },
      { id: "report-detail", title: "财务 · 充值记录", description: "现有后台演示截图。对照筛选、订单状态、金额和详情入口。", src: "/images/enrichment/admin-finance-02.jpg", width: 1440, height: 900 },
    ]} /><div className={styles.links}><Link href="/articles/currency-timezone-reporting">查看币种与跨日统计</Link><Link href="/articles/wallet-payment-reconciliation#reconciliation-case">操作现有对账演示</Link></div></div> : <div id="game-related-examples" className={`scroll-mt-24 ${styles.reference}`}><h3>继续对照账号与页面状态</h3><p>下面是知识库已有的账号和个人中心示例，可帮助理解受限、空结果与查询失败；它们与上方游戏目录示意分别展示。</p><div className={styles.links}><Link href="/articles/member-account-states#account-recovery-case">操作账号受限与恢复演示</Link><Link href="/cases/competitor-analysis#u8-profile-prototype">对照U8个人中心五种状态</Link><Link href="/articles/game-provider-api#先确认钱包模式再分配接口责任">查看登录与钱包接口职责</Link></div></div>}
  </section>
}
