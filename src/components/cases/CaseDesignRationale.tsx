import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { CaseRationaleHashNavigation } from "./CaseRationaleHashNavigation"
import { bmFocus, u8Focus, type ImageFocus } from "@/data/caseEnhancements"
import styles from "./CaseDesignRationale.module.css"

type CaseKind = "bm" | "u8"

const rationale = {
  bm: {
    id: "bm-design-rationale",
    title: "BM：先辨认赛事，再阅读数字",
    task: "查看一场比赛时，先确认双方名称和当前状态，再阅读相应的数据列。",
    focus: bmFocus.find((item) => item.id === "status")!,
    before: "原界面：赛事名称与多列数字",
    after: "生成式方案：名称、比分块与数据列",
    observations: [
      { title: "原界面中可见什么", text: "队名位于左侧，多列数字集中在右侧。每次换一条记录，都需要重新对应队名、时间和数字所属的列。" },
      { title: "方案怎样安排", text: "队名旁增加小比分块，右侧继续按列排列数字。先通过左侧确认赛事，再沿同一行查看对应数字。" },
      { title: "为什么这样取舍", text: "把赛事识别信息与右侧数据分组，保留一行内的对应关系；增加比分块也会占用宽度，长队名和较大的系统字体需要另行检查。" },
      { title: "材料还不能证明什么", text: "静态图没有证明状态实时更新、文字放大后仍能完整显示，或点击目标足够大。颜色和比分也不能代替明确的赛事状态文字。" },
    ],
    compareHref: "?focus=status#case-focus",
    compareLabel: "查看状态层级完整局部",
    secondaryHref: "?focus=categories#case-focus",
    secondaryLabel: "对照首页分类入口",
    demoHref: "#bm-mobile-prototype",
    demoLabel: "在原型切换状态并返回列表",
    boundary: "右侧是生成式视觉方案。手机原型使用独立的虚构记录；它用于查看筛选和返回行为，不代表图中的方案已经上线。",
  },
  u8: {
    id: "u8-design-rationale",
    title: "U8：把余额、资金操作与收益分开",
    task: "进入个人中心后，先确认当前余额，再区分充值／提现入口与今日收益记录。",
    focus: u8Focus.find((item) => item.id === "profile")!,
    before: "材料中的原界面：钱包与今日收益",
    after: "生成式方案：钱包主卡与分组信息",
    observations: [
      { title: "原界面中可见什么", text: "原界面已经有钱包余额、充值／提现和今日收益，并非缺少这些功能。资金操作位于钱包卡下方，收益数据紧接其后。" },
      { title: "方案怎样安排", text: "方案放大钱包主卡，把资金明细放在同组，并将充值与提现做成并列按钮；今日收益保持在下方独立区域。" },
      { title: "为什么这样取舍", text: "用卡片边界和按钮样式区分“余额”“资金操作”“收益”。更大的钱包区会占用首屏高度，服务入口可能需要继续向下查看。" },
      { title: "材料还不能证明什么", text: "图中的0.00只是画面内容，不能证明余额正确或请求成功。资产、订单与账号受限需要分别反馈；布局变化也没有点击率或查询效率的实测结论。" },
    ],
    compareHref: "?focus=profile#case-focus",
    compareLabel: "查看个人中心完整局部",
    secondaryHref: "?focus=home-groups#case-focus",
    secondaryLabel: "对照首页与底部导航分组",
    demoHref: "#u8-profile-prototype",
    demoLabel: "在原型查看资产与异常状态",
    boundary: "两张局部取自现有个人中心分析图，右侧为生成式改版示意。原型展示的是演示状态，不连接真实账户、余额或订单。",
  },
} as const

function comparisonItems(kind: CaseKind, focus: ImageFocus) {
  const pair = focus.comparison!
  return ([pair.before, pair.after] as const).map((side, index) => ({
    id: `${kind}-rationale-${index}`,
    title: index === 0 ? rationale[kind].before : rationale[kind].after,
    description: kind === "u8"
      ? index === 0 ? "已有钱包、资金入口与收益区，按原材料保留。" : "钱包主卡、并列按钮与收益区的布局示意。"
      : side.caption,
    src: focus.src,
    width: focus.width,
    height: focus.height,
    crop: kind === "u8" ? { ...side.crop, height: 400 } : side.crop,
  }))
}

export function CaseDesignRationale({ kind }: { kind: CaseKind }) {
  const data = rationale[kind]
  return (
    <section id={data.id} className={styles.section} aria-labelledby={`${data.id}-title`} data-case-rationale={kind}>
      <CaseRationaleHashNavigation id={data.id} />
      <header className={styles.header}>
        <p className={styles.eyebrow}>设计取舍 · 依据现有材料</p>
        <h2 id={`${data.id}-title`}>{data.title}</h2>
        <p>{data.task}</p>
      </header>
      <LongImageGallery
        items={comparisonItems(kind, data.focus)}
        label="设计取舍局部"
        groupLabel={`${kind === "bm" ? "BM赛事信息" : "U8钱包分组"}设计取舍对照`}
        emptyMessage="局部材料暂时无法显示，请查看上方完整材料。"
      />
      <ol className={styles.observations}>
        {data.observations.map((item, index) => (
          <li key={item.title}>
            <span className={styles.number} aria-hidden="true">{index + 1}</span>
            <div><h3>{item.title}</h3><p>{item.text}</p></div>
          </li>
        ))}
      </ol>
      <p className={styles.boundary}>{data.boundary}</p>
      <nav aria-label={`${kind === "bm" ? "BM" : "U8"}设计取舍相关位置`} className={styles.links}>
        <a href={data.compareHref}>{data.compareLabel} ↑</a>
        <a href={data.secondaryHref}>{data.secondaryLabel} ↑</a>
        <a href={data.demoHref}>{data.demoLabel} ↓</a>
      </nav>
    </section>
  )
}
