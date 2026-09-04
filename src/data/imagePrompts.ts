export type ImagePrompt = {
  slug: string
  title: string
  articleSlug: string
  imageSrc: string
  imageSrcWebp?: string
  imageSrcAvif?: string
  kind?: "standard" | "long-infographic"
  width?: number
  height?: number
}

export const imagePrompts: ImagePrompt[] = [
  {
    slug: "platform-ecosystem",
    title: "博彩平台生态结构图",
    articleSlug: "how-gambling-platform-works",
    imageSrc: "/images/articles/platform-ecosystem.png",
    imageSrcWebp: "/images/articles/platform-ecosystem.webp",
    imageSrcAvif: "/images/articles/platform-ecosystem.avif",
    kind: "standard",
    width: 1672,
    height: 941,
  },
  {
    slug: "white-label-structure",
    title: "包网平台结构图",
    articleSlug: "what-is-white-label",
    imageSrc: "/images/articles/white-label-structure.png",
    imageSrcWebp: "/images/articles/white-label-structure.webp",
    imageSrcAvif: "/images/articles/white-label-structure.avif",
    kind: "standard",
    width: 1672,
    height: 941,
  },
  {
    slug: "sportsbook-ticket-flow",
    title: "体育注单生命周期图",
    articleSlug: "sportsbook-basic",
    imageSrc: "/images/articles/sportsbook-ticket-flow.png",
    imageSrcWebp: "/images/articles/sportsbook-ticket-flow.webp",
    imageSrcAvif: "/images/articles/sportsbook-ticket-flow.avif",
    kind: "standard",
    width: 1774,
    height: 887,
  },
  {
    slug: "wallet-comparison",
    title: "中心钱包 vs 免转钱包对比图",
    articleSlug: "wallet-center-vs-seamless",
    imageSrc: "/images/articles/wallet-comparison.png",
    imageSrcWebp: "/images/articles/wallet-comparison.webp",
    imageSrcAvif: "/images/articles/wallet-comparison.avif",
    kind: "standard",
    width: 1672,
    height: 941,
  },
  {
    slug: "launch-checklist-flow",
    title: "上线检查流程图",
    articleSlug: "launch-checklist",
    imageSrc: "/images/articles/launch-checklist-flow.png",
    imageSrcWebp: "/images/articles/launch-checklist-flow.webp",
    imageSrcAvif: "/images/articles/launch-checklist-flow.avif",
    kind: "standard",
    width: 1672,
    height: 941,
  },
  {
    slug: "white-label-pitfall-checklist",
    title: "包网项目避坑清单",
    articleSlug: "launch-checklist",
    imageSrc: "/images/articles/white-label-pitfall-checklist.png",
    imageSrcWebp: "/images/articles/white-label-pitfall-checklist.webp",
    imageSrcAvif: "/images/articles/white-label-pitfall-checklist.avif",
    kind: "long-infographic",
    width: 864,
    height: 1821,
  },
  {
    slug: "admin-modules-apple-sample",
    title: "平台后台功能模块地图：极简科技风总览",
    articleSlug: "admin-modules",
    imageSrc: "/images/articles/admin-modules-apple-sample.png",
    imageSrcWebp: "/images/articles/admin-modules-apple-sample.webp",
    imageSrcAvif: "/images/articles/admin-modules-apple-sample.avif",
    kind: "long-infographic",
    width: 864,
    height: 1821,
  },
  {
    slug: "admin-modules-account-permission",
    title: "平台后台功能模块地图：账号、权限、会员与合作关系",
    articleSlug: "admin-modules",
    imageSrc: "/images/articles/admin-modules-01-account-permission.png",
    imageSrcWebp: "/images/articles/admin-modules-01-account-permission.webp",
    imageSrcAvif: "/images/articles/admin-modules-01-account-permission.avif",
    kind: "long-infographic",
    width: 992,
    height: 1586,
  },
  {
    slug: "admin-modules-wallet-game-order",
    title: "平台后台功能模块地图：钱包、支付、游戏与订单",
    articleSlug: "admin-modules",
    imageSrc: "/images/articles/admin-modules-02-wallet-game-order.png",
    imageSrcWebp: "/images/articles/admin-modules-02-wallet-game-order.webp",
    imageSrcAvif: "/images/articles/admin-modules-02-wallet-game-order.avif",
    kind: "long-infographic",
    width: 992,
    height: 1586,
  },
  {
    slug: "admin-modules-operation-risk",
    title: "平台后台功能模块地图：活动、运营、数据与风险治理",
    articleSlug: "admin-modules",
    imageSrc: "/images/articles/admin-modules-03-operation-risk.png",
    imageSrcWebp: "/images/articles/admin-modules-03-operation-risk.webp",
    imageSrcAvif: "/images/articles/admin-modules-03-operation-risk.avif",
    kind: "long-infographic",
    width: 992,
    height: 1586,
  },
  {
    slug: "payment-channel-review-flow",
    title: "支付通道与提现审核流程",
    articleSlug: "payment-channel-basic",
    imageSrc: "/images/articles/payment-channel-review-flow.png",
    imageSrcWebp: "/images/articles/payment-channel-review-flow.webp",
    imageSrcAvif: "/images/articles/payment-channel-review-flow.avif",
    kind: "long-infographic",
    width: 863,
    height: 1823,
  },
  {
    slug: "risk-rule-review-flow",
    title: "风控规则与人工复核流程",
    articleSlug: "risk-rule-basic",
    imageSrc: "/images/articles/risk-rule-review-flow.png",
    imageSrcWebp: "/images/articles/risk-rule-review-flow.webp",
    imageSrcAvif: "/images/articles/risk-rule-review-flow.avif",
    kind: "long-infographic",
    width: 864,
    height: 1821,
  },
  {
    slug: "community-governance-sop",
    title: "社群运营治理 SOP",
    articleSlug: "community-operations-governance",
    imageSrc: "/images/articles/community-governance-sop.png",
    imageSrcWebp: "/images/articles/community-governance-sop.webp",
    imageSrcAvif: "/images/articles/community-governance-sop.avif",
    kind: "long-infographic",
    width: 864,
    height: 1821,
  },
  {
    slug: "channel-quality-dashboard",
    title: "渠道质量评估看板",
    articleSlug: "channel-quality-review",
    imageSrc: "/images/articles/channel-quality-dashboard.png",
    imageSrcWebp: "/images/articles/channel-quality-dashboard.webp",
    imageSrcAvif: "/images/articles/channel-quality-dashboard.avif",
    kind: "long-infographic",
    width: 864,
    height: 1821,
  },
  {
    slug: "campaign-risk-review-flow",
    title: "活动规则风险评审流程",
    articleSlug: "campaign-risk-review",
    imageSrc: "/images/articles/campaign-risk-review-flow.png",
    imageSrcWebp: "/images/articles/campaign-risk-review-flow.webp",
    imageSrcAvif: "/images/articles/campaign-risk-review-flow.avif",
    kind: "long-infographic",
    width: 864,
    height: 1821,
  },
]

export function getImagePromptForArticle(articleSlug: string) {
  const images = imagePrompts.filter((imagePrompt) => imagePrompt.articleSlug === articleSlug)
  return images.find((imagePrompt) => imagePrompt.kind === "long-infographic") ?? images[0]
}

export function getImagePromptsForArticle(articleSlug: string) {
  const images = imagePrompts.filter((imagePrompt) => imagePrompt.articleSlug === articleSlug)
  const longInfographics = images.filter((imagePrompt) => imagePrompt.kind === "long-infographic")

  if (longInfographics.length > 0) return longInfographics
  return images.slice(0, 1)
}
