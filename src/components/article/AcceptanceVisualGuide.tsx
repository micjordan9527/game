import { ArrowDown } from "lucide-react"
import { Frame, Field, Action, Badge } from "./DesignArticleGuide"
import { historicalChecks } from "@/data/acceptanceEvidence"
import base from "./DesignArticleGuide.module.css"
import styles from "./EvidenceWorkflow.module.css"

export function AcceptanceVisualGuide() {
  return <section id="visual-guide" aria-labelledby="visual-guide-title" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${base.guide}`}>
    <div className={base.heading}><p>验收信息图 · 示例与历史证据分别标明</p><h2 id="visual-guide-title">从一句“检查过了”，找到可复核的证据</h2><p>把版本、环境、预期、实际和记录连接起来。截图、演示与自动检查各有能支持的范围。</p></div>
    <nav aria-label="本文阅读入口" className={base.readingNav}><a href="#visual-guide">看证据图解</a><a href="#acceptance-evidence">切换证据记录 ↓</a><a href="#article-details">查看详细规则 ↓</a></nav><p className={base.legend}>图1–3为讲解示例；图4引用本知识库v26已完成的真实历史工作流。</p>
    <div className={base.grid}>
      <Frame n="1" title="先写清楚，验的是哪一份" note="版本、环境和范围不同，原来的通过记录不能直接沿用。下面是待填写的记录结构。"><div className={base.browserBar}><span />验收记录 · 待实测</div><Field label="需求编号" value="PUB-SCOPE-01" /><Field label="版本与环境" value="待填写提交号、站点与环境" /><Field label="角色与设备" value="待填写授权角色、视口与时区" /><Badge tone="warn">没有执行记录，结论仍为未验证</Badge></Frame>
      <Frame n="2" title="预期结果和实际结果分开写" note="用同一条需求记录比较预期与实际。没有结果时写未执行，失败与待复核也分别保留。"><div className={base.browserBar}><span />PUB-SCOPE-01 · 虚构填写示例</div><div className={styles.record}><strong>预期</strong><p>站点A中文v4生效，英文和站点B不自动变化。</p></div><ArrowDown className={base.sceneArrow} aria-hidden="true" /><div className={styles.record}><strong>实际</strong><p>待执行；待保存目标页面版本与请求记录。</p></div><div className={base.actions}><Action disabled>标记通过</Action><Badge tone="warn">缺少实际证据</Badge></div></Frame>
      <Frame n="3" title="按钮截图只能证明入口可见" note="验证导出权限，还需要角色、数据范围、允许与拒绝请求、实际下载结果。不能从截图补出这些结论。"><div className={base.browserBar}><span />后台截图中的一个入口</div><div className={base.actions}><Action>导出记录</Action></div><div className={styles.record}><strong>可见事实</strong><p>页面显示了导出按钮。</p></div><div className={styles.record}><strong>待验证</strong><p>谁能导出、包含哪些数据、拒绝时是否仍产生文件。</p></div><Badge tone="warn">服务端权限：不能判断</Badge></Frame>
      <Frame n="4" title="真实历史检查也要绑定提交号" note="这些成功结论属于v26的指定提交。新版本必须独立检查，不能用历史成功代替当前验收。"><div className={base.browserBar}><span />v26 · 历史GitHub记录</div><p className={styles.break}>提交：aa1370b68a3944fcadd5cbc138746a5c3a667890</p>{historicalChecks.map((run) => <div key={run.id} className={styles.record}><strong>{run.name}</strong><p><Badge tone="good">completed / success</Badge></p><a className={styles.link} href={run.href}>打开原始run {run.id} →</a></div>)}</Frame>
    </div>
  </section>
}
