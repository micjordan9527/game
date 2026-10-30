import { LongImageGallery } from "./LongImageGallery"
import { CaseRationaleHashNavigation } from "./CaseRationaleHashNavigation"
import { BmLayoutStudy } from "./BmLayoutStudy"
import styles from "./BmCaseStudy.module.css"

const source = "/case-assets/bm-optimization/bm-home-optimization.avif"
const colors = { identity: "#315b91", state: "#9a531e", market: "#17685e" }

export function BmCaseStudy() {
  return <section id="bm-design-rationale" data-case-rationale="bm" className={styles.study} aria-labelledby="bm-study-title">
    <CaseRationaleHashNavigation id="bm-design-rationale" />
    <CaseRationaleHashNavigation id="bm-source-evidence" />
    <CaseRationaleHashNavigation id="bm-layout-study" />
    <header className={styles.intro}>
      <p className={styles.eyebrow}>01 / 原材料观察</p>
      <h2 id="bm-study-title">队名、赛况和盘口，分别在回答什么？</h2>
      <p>先确认双方，再读阶段与比分，最后辨认盘口标题和选项。</p>
    </header>
    <div id="bm-source-evidence" className={styles.evidence}>
      <LongImageGallery label="来源局部 · 图上编号" groupLabel="BM原材料的标注对照" emptyMessage="请查看下方完整原材料。" items={[
        { id: "bm-evidence-original", title: "原界面：日期、队名与盘口", description: "首页材料左侧局部 · 原宽310px", src: source, width: 1600, height: 1160, crop: { x: 110, y: 433, width: 310, height: 181 }, maxPreviewWidth: 340, annotationLegend: "① 双方队名　② 日期与时间　③ 盘口标题与选项", annotations: [
          { x: 116, y: 483, width: 166, height: 83, label: "1", color: colors.identity },
          { x: 111, y: 454, width: 169, height: 26, label: "2", color: colors.state },
          { x: 285, y: 454, width: 134, height: 157, label: "3", color: colors.market },
        ] },
        { id: "bm-evidence-proposal", title: "生成式方案：赛况与盘口分区", description: "首页材料右侧局部 · 原宽295px", src: source, width: 1600, height: 1160, crop: { x: 875, y: 488, width: 295, height: 207 }, maxPreviewWidth: 324, annotationLegend: "① 双方队名　② 中场休息　③ 盘口标题与选项", annotations: [
          { x: 881, y: 554, width: 105, height: 90, label: "1", color: colors.identity },
          { x: 881, y: 524, width: 45, height: 25, label: "2", color: colors.state },
          { x: 991, y: 528, width: 177, height: 134, label: "3", color: colors.market },
        ] },
      ]} />
      <p className={styles.sourceNote}>两侧是不同赛事，只对照信息结构。保留源图字形；放大不会补出原图没有的细节。</p>
      <ol className={styles.findings}>
        <li><span style={{ background: colors.identity }}>1</span><div><h3>先识别双方</h3><p>两张图都有双方队名。方案增加队徽与比分块；新增元素也会占用队名旁的空间。</p></div></li>
        <li><span style={{ background: colors.state }}>2</span><div><h3>时间不等于阶段</h3><p>原局部可确认日期与时间；方案明确写“中场休息”，并出现4－0。原图无法确认比分，不据此断言原比分太突出。</p></div></li>
        <li><span style={{ background: colors.market }}>3</span><div><h3>先读盘口标题，再读数值</h3><p>让球、大小、独赢是不同组。独赢含主／平／客三项，不能把每一格都按双方队名逐行对应。</p></div></li>
      </ol>
    </div>

    <BmLayoutStudy />

    <section id="bm-design-decisions" className={styles.decisions} aria-labelledby="bm-decisions-title">
      <header><p className={styles.eyebrow}>03 / 设计取舍</p><h2 id="bm-decisions-title">分组之后，哪些关系必须保留？</h2></header>
      <div className={styles.decisionRows}>
        <article><span className={styles.rule}>赛事 → 赛况 → 盘口</span><div><h3>阅读有先后，重要状态仍要直接可见</h3><p>把球队与当前阶段放在盘口之前。阶段用“进行中”“中场休息”等文字表达；比分属于赛况，不能用比分大小代替阶段说明。</p></div></article>
        <article><span className={styles.rule}>让球 / 大小 / 独赢</span><div><h3>盘口分组要保留各自的选项含义</h3><p>让球、大小可各有两项，独赢有三项。分组后的图解把标题留在对应选项上方，每项保留自己的标签，避免把视觉上的同一行误读成同一种业务关系。</p></div></article>
        <article><span className={styles.rule}>完整队名 ↔ 可用空间</span><div><h3>保留完整文字，可能让一屏显示更少赛事</h3><p>名称长度超过可用宽度时需要换行。这份分组方案使用更多留白；长队名与18px文字同时出现时，还需要增加文字区高度。不能同时承诺完整显示、字号变大和首屏条数不变。</p></div></article>
      </div>
      <p className={styles.conclusion}>这份示意优先保留赛事身份、阶段和盘口标签的完整表达。对高密度列表是否合适，还要结合实际任务与设备验证；当前没有误读率或效率提升的数据。</p>
    </section>

    <footer className={styles.next}>
      <div><h3>继续看操作关系</h3><p>现有原型可切换球类与状态，打开详情再返回。它说明筛选和返回行为，使用独立演示记录。</p></div>
      <nav aria-label="BM样板相关位置">
        <a href="?focus=status#case-focus">查看状态层级原局部 ↓</a>
        <a href="#bm-mobile-prototype">操作分类、状态与返回原型 ↓</a>
        <a href="#case-materials">查看两张完整原材料 ↓</a>
      </nav>
    </footer>
  </section>
}
