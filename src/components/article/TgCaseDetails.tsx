import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { assetPath } from "@/lib/assets"
import styles from "./TgCaseDetails.module.css"

const referenceSrc = "/images/operations/tg-material-message-reference.webp"
const referenceSize = { width: 896, height: 1280 }
const caseImages = [
  {
    id: "tg-material-complete",
    title: "完整推送截图",
    description: "素材中心现有TG群消息截图，非双狮频道截图。",
    src: referenceSrc,
    ...referenceSize,
    sourceHref: referenceSrc,
  },
]

export function TgCaseDetails() {
  return <section id="tg-case-details" className={`not-prose ${styles.caseDetails}`} aria-labelledby="tg-case-details-title">
    <div className={styles.heading}>
      <h2 id="tg-case-details-title">TG推送截图</h2>
    </div>
    <div className={styles.gallery}>
      <LongImageGallery label="素材中心现有截图" groupLabel="TG推送完整截图" emptyMessage="截图暂时无法显示。" items={caseImages} />
    </div>
    <div className={styles.source}>
      <a href={assetPath(referenceSrc)} download="tg-material-message-reference.webp">下载这张案例截图</a>
    </div>
  </section>
}
