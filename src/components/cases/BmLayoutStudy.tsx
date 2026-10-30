"use client"

import { useId, useState } from "react"
import styles from "./BmLayoutStudy.module.css"

export const bmLayoutFixture = {
  id: "MATCH-DEMO-001",
  league: "足球 · 示例联赛",
  home: "示例 A 队",
  away: "示例 B 队",
  longHome: "示例北方城市联合足球俱乐部青年竞技队",
  longAway: "示例海岸联合竞技足球俱乐部城市代表队",
  status: "进行中",
  time: "65:00",
  score: "1 : 0",
  markets: [
    { title: "让球", options: [{ label: "-0.5", value: "1.80" }, { label: "+0.5", value: "2.05" }] },
    { title: "大小", options: [{ label: "大 2.5", value: "1.90" }, { label: "小 2.5", value: "1.95" }] },
    { title: "独赢", options: [{ label: "主", value: "1.80" }, { label: "平", value: "3.20" }, { label: "客", value: "4.10" }] },
  ],
} as const

function Marker({ children }: { children: string }) {
  return <span className={styles.marker} aria-hidden="true">{children}</span>
}

function MarketGrid() {
  return <div className={styles.markets} aria-label="同一组盘口示例">
    {bmLayoutFixture.markets.map((market) => <div className={styles.market} key={market.title}>
      <h5>{market.title}</h5>
      <ul>{market.options.map((option) => <li key={option.label}>
        <span className={styles.optionLabel}>{option.label}</span>
        <strong>{option.value}</strong>
      </li>)}</ul>
    </div>)}
  </div>
}

export function BmLayoutStudy() {
  const [expanded, setExpanded] = useState(false)
  const checkboxId = useId()
  const home = expanded ? bmLayoutFixture.longHome : bmLayoutFixture.home
  const away = expanded ? bmLayoutFixture.longAway : bmLayoutFixture.away

  return <section id="bm-layout-study" className={styles.section} aria-labelledby="bm-layout-study-title">
    <header className={styles.header}>
      <p className={styles.eyebrow}>02 / 同内容结构示意</p>
      <h3 id="bm-layout-study-title">同一组业务内容，两种排列</h3>
      <p>两图的球队、赛况与盘口数据相同。B使用分区、标题与留白区分三层信息；这是布局说明，不是效果测试。</p>
    </header>
    <label className={styles.sizeControl} htmlFor={checkboxId}>
      <input id={checkboxId} type="checkbox" checked={expanded} onChange={(event) => setExpanded(event.target.checked)} />
      查看长队名与放大文字
    </label>
    <div className={`${styles.comparison} ${expanded ? styles.expanded : ""}`} data-bm-expanded={expanded}>
      <article className={styles.card} data-layout="continuous" data-fixture={bmLayoutFixture.id} aria-labelledby="bm-continuous-title">
        <div className={styles.cardHeading}>
          <span className={styles.figureLabel}>A · 结构示意</span>
          <h4 id="bm-continuous-title">信息连续排列</h4>
        </div>
        <div className={styles.continuousContent}>
          <div className={styles.continuousMeta}><span>{bmLayoutFixture.league}</span><span>{bmLayoutFixture.status} · {bmLayoutFixture.time}</span></div>
          <div className={styles.continuousIdentity}>
            <div className={styles.teamNames}><span data-field="home">{home}</span><span data-field="away">{away}</span></div>
            <strong data-field="score">{bmLayoutFixture.score}</strong>
          </div>
          <MarketGrid />
          <p className={styles.recordId}>{bmLayoutFixture.id}</p>
        </div>
        <p className={styles.cardCaption}>队名、赛况和数据连续出现；阅读时需要自行划分信息范围。</p>
      </article>
      <article className={`${styles.card} ${styles.groupedCard}`} data-layout="grouped" data-fixture={bmLayoutFixture.id} data-bm-study-cover aria-labelledby="bm-grouped-title">
        <div className={styles.cardHeading}>
          <span className={styles.figureLabel}>B · 结构示意</span>
          <h4 id="bm-grouped-title">赛事、赛况与盘口分组</h4>
        </div>
        <div className={styles.groupedContent}>
          <div className={styles.eventHeader}>
            <div className={styles.identityHeading}><Marker>1</Marker><span>{bmLayoutFixture.league}</span></div>
            <div className={styles.teamNames}><span data-field="home">{home}</span><span data-field="away">{away}</span></div>
          </div>
          <div className={styles.scoreSection}>
            <div className={styles.scoreHeading}><Marker>2</Marker><span className={styles.status}>{bmLayoutFixture.status}</span><span>{bmLayoutFixture.time}</span></div>
            <div className={styles.score}><strong data-field="score">{bmLayoutFixture.score}</strong><span>主队 : 客队</span></div>
          </div>
          <div className={styles.marketSection}>
            <p className={styles.marketHeading}><Marker>3</Marker><span>盘口数据</span></p>
            <MarketGrid />
          </div>
          <p className={styles.recordId}>{bmLayoutFixture.id}</p>
        </div>
        <p className={styles.cardCaption}>边界和标题区分三层信息，盘口组内保留各自的选项关系。</p>
      </article>
    </div>
    <div className={styles.legend}>
      <p><Marker>1</Marker><span><strong>赛事身份</strong>确认双方球队，长名称保留完整文字。</span></p>
      <p><Marker>2</Marker><span><strong>当前赛况</strong>阶段、时间与比分放在同组，比分不会充当阶段说明。</span></p>
      <p><Marker>3</Marker><span><strong>盘口数据</strong>让球、大小、独赢各有标题；独赢有主、平、客三项，不能与两支球队逐行一一对应。</span></p>
    </div>
    <p className={styles.tradeoff} role="status">{expanded
      ? "两图已同时切换长队名与18px文字。名称按可用宽度换行，保留完整内容；这组条件下不能保证首屏条数不变。"
      : "这份分组方案使用了更多纵向空间。切换长队名与18px文字，可同时查看这组条件下的换行和高度变化。"}</p>
    <p className={styles.sourceNote}>结构示意中的球队、赛况和数值均为固定演示内容，非实时数据，不提供交易。</p>
  </section>
}
