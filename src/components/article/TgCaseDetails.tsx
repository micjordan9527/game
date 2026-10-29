import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { assetPath } from "@/lib/assets"
import styles from "./TgCaseDetails.module.css"

const referenceSrc = "/images/operations/tg-material-message-reference.webp"
const referenceSize = { width: 896, height: 1280 }
const caseImages = [
  {
    id: "tg-material-complete",
    title: "完整截图：上条按钮与22:00消息",
    description: "Ugame飞机投注群，19名成员。上方是20:00上一条消息的按钮，下方22:00消息包含白蓝海报与图外正文。",
    src: referenceSrc,
    ...referenceSize,
    sourceHref: referenceSrc,
  },
  {
    id: "tg-material-previous-buttons",
    title: "上条20:00消息：1＋2＋2按钮",
    description: "进入游戏占整行；账号充值／快捷提款一行；我的钱包／官方客服一行。这组按钮属于上一条消息，不是下方22:00消息的按钮。",
    src: referenceSrc,
    ...referenceSize,
    crop: { x: 68, y: 151, width: 674, height: 176 },
    sourceHref: referenceSrc,
  },
  {
    id: "tg-material-poster",
    title: "22:00海报：图内“立即体验”",
    description: "“立即体验”位于白蓝海报内部，和人物、标题一起组成图片；不能把图里的按钮外观当成TG独立按钮。",
    src: referenceSrc,
    ...referenceSize,
    crop: { x: 68, y: 338, width: 674, height: 506 },
    sourceHref: referenceSrc,
  },
  {
    id: "tg-material-message-text",
    title: "22:00消息：图外正文与时间",
    description: "正文从海报下方的黑色消息区开始，22:00位于右下角。更下方按钮被输入框遮挡，不能据此补造本条消息的按钮。",
    src: referenceSrc,
    ...referenceSize,
    crop: { x: 68, y: 844, width: 674, height: 334 },
    sourceHref: referenceSrc,
  },
]

export function TgCaseDetails() {
  return <section id="tg-case-details" className={`not-prose ${styles.caseDetails}`} aria-labelledby="tg-case-details-title">
    <div className={styles.heading}>
      <h2 id="tg-case-details-title">TG推送截图</h2>
      <p>素材中心的另一个群消息案例，不是双狮主题官方频道截图。原图和局部可分别放大。</p>
    </div>
    <div className={styles.gallery}>
      <LongImageGallery label="素材中心现有TG群消息案例" groupLabel="TG群消息案例原图与局部" emptyMessage="案例截图暂时无法显示。" items={caseImages} />
    </div>
    <div className={styles.source}>
      <p>原图与三个局部均取自同一张896×1280截图。局部只改变查看区域，原文件保持不变。</p>
      <a href={assetPath(referenceSrc)} download="tg-material-message-reference.webp">下载这张案例截图</a>
    </div>
  </section>
}
