import { ArrowDown, ArrowRight, Clock3 } from "lucide-react"
import { Frame, Action, Badge, Field } from "./DesignArticleGuide"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { bmFocus, u8Focus } from "@/data/caseEnhancements"
import base from "./DesignArticleGuide.module.css"
import styles from "./PlatformVisualGuide.module.css"

const guides: Record<string, { title: string; intro: string; demo: string }> = {
  "content-publication-versions": { title: "公告从草稿到生效，哪里需要再次确认", intro: "用CNT-DEMO-001说明审核、版本、站点和语言。计划时间到了，还需要检查实际发布与前台可见版本。", demo: "#publication-demo" },
  "mobile-page-layout": { title: "手机页面怎样排，内容和动作才看得清", intro: "沿着同一条记录和一份表单，观察列表、详情、输入和返回。图中均为静态界面示意。", demo: "#mobile-layout-demo" },
}
export function hasPlatformGuide(slug: string) { return !!guides[slug] }

function PublicationPanels() {
  return <div className={base.grid}>
    <Frame n="1" title="先固定发布范围" note="一次审核对应确定的版本、站点和语言，中文发布不会自动更新英文。">
      <div className={base.browserBar}><span />CNT-DEMO-001 · 编辑</div><Field label="目标站点" value="站点A" /><Field label="目标语言" value="中文" /><Field label="内容与规则" value="草稿v4 · 规则R7" />
      <div className={styles.scopeGrid}><div>中文当前生效<strong>v3</strong></div><div>英文当前生效<strong>v3</strong></div></div><div className={base.actions}><Action>提交v4审核</Action></div>
    </Frame>
    <Frame n="2" title="审核通过后改稿，要重新审核" note="审核的是v4的具体内容。改成v5后，不能沿用v4的批准，也不能让原定时任务发布新稿。">
      <div className={base.browserBar}><span />审核与改稿</div><div className={styles.versionRail}><span><strong>v4</strong><small>审核通过</small></span><ArrowRight aria-hidden="true" /><span><strong>v5</strong><small>修改后的新草稿</small></span></div><Badge tone="warn">原审核与待执行任务失效</Badge><div className={base.actions}><Action>重新提交审核</Action><Action disabled>直接发布v5</Action></div>
    </Frame>
    <Frame n="3" title="计划时间到了，不等于发布成功" note="执行时核对审核版本与范围。失败就保留旧的生效版本，并明确说明失败原因。">
      <div className={base.browserBar}><span /><Clock3 size={16} aria-hidden="true" />手动演示时间 · T+10分钟</div><div className={styles.timeline}><div><strong>T：安排v4</strong>站点A · 中文 · 审核有效</div><div><strong>T+10：尝试发布</strong>重新检查版本、审核与范围</div><div><Badge tone="bad">本次发布失败</Badge><p>后台继续使用v3，不显示v4已生效。</p></div></div><Action secondary>核对后重新安排</Action>
    </Frame>
    <Frame n="4" title="后台生效与前台可见分别核对" note="本例刻意保留旧前台快照。刷新后再核对目标站点和语言，避免把后台状态当作前台证据。">
      <div className={base.browserBar}><span />站点A · 中文 · 版本对照</div><div className={styles.scopeGrid}><div>后台生效<strong>v4</strong><Badge tone="good">发布完成</Badge></div><div>前台快照<strong>v3</strong><Badge tone="warn">待刷新核对</Badge></div></div><div className={base.actions}><Action>刷新前台快照 → v4</Action></div><div className={styles.trace}><span>英文</span><strong>仍为v3，未被中文发布覆盖</strong></div>
    </Frame>
    <Frame n="5" title="更正、撤回和到期都保留历史" note="更正创建v5并引用v4。撤回或到期停止展示，旧版本和已记录的阅读事件仍指向原版本。">
      <div className={base.browserBar}><span />CNT-DEMO-001 · 历史依据</div><div className={styles.timeline}><div><strong>v4 · 已生效</strong>阅读事件示例：站点A／中文／v4</div><div><strong>v5 · 更正草稿</strong>更正v4 · 原因：修正帮助链接</div><div><strong>v5 · 撤回或到期</strong>前台不再展示，历史记录保留</div></div><Badge>记录展示不等于用户理解或同意</Badge>
    </Frame>
  </div>
}

function MobilePanels() {
  return <>
    <div className={base.grid}>
      <Frame n="1" title="宽列表变卡片，关键字段留下" note="同一条DEMO-T005始终显示编号、状态、时间和详情入口。手机不缩小整张桌面宽表。">
        <div className={base.browserBar}><span />同一条记录 · 两种布局</div><div className={styles.compactTable}>{["编号", "状态", "时间", "T005", "待处理", "09:14"].map((text) => <span key={text}>{text}</span>)}</div><ArrowDown className={base.sceneArrow} aria-hidden="true" /><div className={styles.phone}><div className={styles.phoneHeader}>工单列表</div><div className={styles.phoneBody}><div className={base.row}><strong>DEMO-T005</strong><Badge tone="warn">待处理</Badge></div><p>核对账号资料</p><p>10-27 09:14 · UTC+8</p><Action>查看这条记录详情</Action></div></div>
      </Frame>
      <Frame n="2" title="长表单分组，错误放在字段旁" note="先填写联系方式，再写问题。校验失败保留其他内容，并把焦点移到第一个错误字段。">
        <div className={styles.phone}><div className={styles.phoneHeader}>问题说明 · 示例表单</div><div className={styles.phoneBody}><Badge>1 · 联系方式</Badge><Field label="联系邮箱" value="demo@example.invalid" /><Badge>2 · 问题内容</Badge><Field label="问题标题" value="" error="请填写问题标题" /><Field label="问题说明" value="返回列表时找不到原来的记录。" /></div></div>
      </Frame>
      <Frame n="3" title="底部操作固定，正文留出空间" note="底栏关联当前记录；正文底部留白及设备安全区需要实际验证，不能遮住最后一项说明。">
        <div className={styles.phone}><div className={styles.phoneHeader}>DEMO-T005 · 详情</div><div className={styles.phoneBody}><p>状态：待处理</p><p>处理说明：先核对原申请记录。</p><div className={base.notice}>最后一项说明仍可完整阅读。</div><div className={styles.safeSpace}>为底部操作与安全区预留空间</div></div><div className={styles.bottomAction}><Action>核对当前记录</Action></div></div>
      </Frame>
      <Frame n="4" title="键盘出现后，输入与下一步仍可见" note="这是键盘区域示意。真实手机需验证视口变化、焦点滚动和底栏位置，不能仅靠桌面缩放判断。">
        <div className={styles.phone}><div className={styles.phoneHeader}>正在填写问题标题</div><div className={styles.phoneBody}><Field label="问题标题 · 当前焦点" value="详情返回位置" /><p>可见区域随键盘变化。</p></div><div className={styles.bottomAction}><Action>下一项</Action></div><div className={styles.keyboard}>键盘区域示意<div className={styles.keys}><span>A</span><span>B</span><span>C</span></div></div></div>
      </Frame>
      <Frame n="5" title="从详情返回，保留分类和状态" note="对照BM手机原型：足球和进行中分别筛选，返回后仍定位到原记录。阅读位置与焦点还需单独检查。">
        <div className={styles.phone}><div className={styles.phoneHeader}>BM · 界面结构示意</div><div className={styles.phoneBody}><div className={base.actions}><Badge>足球</Badge><Badge tone="good">进行中</Badge></div><div className={base.applied}>MATCH-DEMO-001</div><p>示例A队 / 示例B队 · 1:0</p><Action secondary>打开详情</Action><ArrowDown className={base.sceneArrow} aria-hidden="true" /><Action>返回原分类与记录</Action></div></div>
      </Frame>
      <Frame n="6" title="账号、资产和订单分别说明" note="对照U8个人中心：账号正常不能替代订单结果，余额数字不能说明某笔申请已经完成。">
        <div className={styles.phone}><div className={styles.phoneHeader}>U8 · 信息分组示意</div><div className={styles.phoneBody}><div className={styles.trace}><span>账号</span><Badge tone="good">正常</Badge></div><div className={styles.trace}><span>资产</span><span>可用与冻结分别查看</span></div><div className={styles.trace}><span>订单</span><span>按原编号查询当前状态</span></div><div className={base.actions}><Action secondary>查看订单</Action><Action secondary>帮助与服务</Action></div></div></div>
      </Frame>
    </div>
    <div id="mobile-case-materials" className={`scroll-mt-24 ${styles.references}`}><h3>对照BM、U8现有材料</h3><p>BM材料包含原截图与生成式方案对照；U8为分析信息图。它们用于观察布局，与上方静态示例和可操作原型分别判断。</p><LongImageGallery label="手机布局参考" groupLabel="手机布局参考组" emptyMessage="参考材料暂时无法显示。" items={[{ id: "bm-layout", title: "BM · 详情操作区材料", description: "查看详情下部的信息与操作关系；生成式方案中的文字和间距仍需核对。", src: bmFocus[2].src, width: bmFocus[2].width, height: bmFocus[2].height, sourceHref: "/cases/bm-optimization#case-focus" }, { id: "u8-layout", title: "U8 · 个人中心材料", description: "查看账号、资产、订单与服务的分组，不据此推断真实上线功能或效果。", src: u8Focus[2].src, width: u8Focus[2].width, height: u8Focus[2].height, sourceHref: "/cases/competitor-analysis#case-focus" }]} /></div>
  </>
}

export function PlatformVisualGuide({ slug }: { slug: string }) {
  const guide = guides[slug]
  if (!guide) return null
  return <section id="visual-guide" aria-labelledby="visual-guide-title" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${base.guide}`}>
    <div className={base.heading}><p>界面信息图 · 示例数据</p><h2 id="visual-guide-title">{guide.title}</h2><p>{guide.intro}</p></div>
    <nav aria-label="本文阅读入口" className={base.readingNav}><a href="#visual-guide">看界面对照</a><a href={guide.demo}>操作演示 ↓</a><a href="#article-details">查看详细规则 ↓</a></nav>
    <p className={base.legend}>以下为静态讲解图，图内按钮仅说明位置与状态；实际操作请进入演示。</p>
    {slug === "content-publication-versions" ? <PublicationPanels /> : <MobilePanels />}
    <a href={guide.demo} className={base.demoLink}>按图中的场景操作演示 <ArrowRight size={18} aria-hidden="true" /></a>
  </section>
}
