export const designObjects = [
  {
    slug: "brand", title: "品牌与识别设计",
    description: "建立品牌的标志、色彩、字体和应用规则。",
    directions: [
      { slug: "identity", title: "标志与识别", description: "标志的构成、识别性、尺寸与使用方式。" },
      { slug: "language", title: "色彩与字体", description: "品牌色、字体、图形语言与视觉一致性。" },
      { slug: "application", title: "品牌应用", description: "品牌在网页、社交媒体及其他物料中的应用。" },
    ],
  },
  {
    slug: "digital", title: "数字产品设计",
    description: "设计网站、App、会员端和管理后台的使用体验与界面。",
    directions: [
      { slug: "research", title: "用户研究与体验定义", description: "了解使用者、任务、环境和问题，明确体验目标。" },
      { slug: "architecture", title: "信息架构", description: "组织内容、页面、导航和信息优先级。" },
      { slug: "interaction", title: "交互设计", description: "设计操作流程、系统反馈、异常处理和返回行为。" },
      { slug: "interface", title: "UI界面设计", description: "通过布局、色彩、字体与组件外观表达信息，并适配终端。" },
      { slug: "motion", title: "界面动效", description: "用动画表达转场、加载、状态变化与操作反馈。" },
      { slug: "system", title: "设计系统", description: "统一组件、样式、状态和使用规范。" },
    ],
  },
  {
    slug: "communication", title: "视觉传播设计",
    description: "通过静态物料、视频、插画与信息图表达内容。",
    directions: [
      { slug: "static", title: "静态物料", description: "Banner、海报和活动主视觉中的图文组织。" },
      { slug: "video", title: "动态图形与视频", description: "视频素材、动画及其在消息中的展示。" },
      { slug: "illustration", title: "插画与信息图", description: "通过图形、结构标注与分步演示解释内容。" },
    ],
  },
  {
    slug: "physical", title: "实体产品与设备设计",
    description: "设计设备外观、结构、人机操作和实体控制面板。",
    directions: [
      { slug: "form", title: "外观与结构", description: "实体产品的形态、构造、材料与装配关系。" },
      { slug: "controls", title: "人机操作", description: "控制面板、按键、可达性和操作反馈。" },
      { slug: "environment", title: "使用与维护", description: "设备在实际环境中的使用、检修和维护体验。" },
    ],
  },
] as const

export type DesignObject = (typeof designObjects)[number]
export const designFormats = [
  { slug: "article", title: "图解" }, { slug: "video", title: "视频" },
  { slug: "case", title: "案例" }, { slug: "demo", title: "演示" },
  { slug: "standard", title: "规范" }, { slug: "workflow", title: "AI 工作流" },
] as const
export type DesignFormat = (typeof designFormats)[number]["slug"]

export const designArticleEntries = [
  { slug: "admin-information-hierarchy", object: "digital", direction: "architecture", reference: false },
  { slug: "admin-filter-list-states", object: "digital", direction: "interaction", reference: false },
  { slug: "admin-bulk-actions", object: "digital", direction: "interaction", reference: false },
  { slug: "form-validation-submit-feedback", object: "digital", direction: "interaction", reference: false },
  { slug: "mobile-page-layout", object: "digital", direction: "interface", reference: false },
  { slug: "export-masking-audit", object: "digital", direction: "interaction", reference: true },
  { slug: "content-publication-versions", object: "digital", direction: "interaction", reference: true },
  { slug: "tg-message-media", object: "communication", direction: "video", reference: false },
  { slug: "electronic-gaming-machine", object: "communication", direction: "illustration", reference: true },
] as const

export type DesignResource = { id: string; object: string; direction: string; title: string; description: string; href: string; format: DesignFormat; image: string }
export const interactionDesignEntries = [
  { slug: "admin-filter-list-states", object: "digital", direction: "interaction", reference: false },
  { slug: "admin-bulk-actions", object: "digital", direction: "interaction", reference: false },
  { slug: "form-validation-submit-feedback", object: "digital", direction: "interaction", reference: false },
  { slug: "mobile-page-layout", object: "digital", direction: "interaction", reference: true },
  { slug: "member-account-states", object: "digital", direction: "interaction", reference: true },
  { slug: "export-masking-audit", object: "digital", direction: "interaction", reference: true },
  { slug: "content-publication-versions", object: "digital", direction: "interaction", reference: true },
] as const
export const designResources: DesignResource[] = [
  { id: "brand-logo", object: "brand", direction: "identity", title: "品牌Logo使用规范", description: "查看首页、登录注册、浏览器与PWA的标志尺寸和使用位置。", href: "/design/material-standards?module=brand-logo", format: "standard", image: "/images/design-directory/brand-logo-cover.jpg" },
  { id: "brand-system", object: "brand", direction: "language", title: "品牌视觉系统", description: "查看品牌色、字体、图形语言与多端应用的示意输出。", href: "/ai-workflows/brand-visual-system", format: "workflow", image: "/case-assets/ai-workflows/brand-visual-system/output-01-brand-overview.webp" },
  { id: "information", object: "digital", direction: "architecture", title: "信息层级演示", description: "切换页面结构、信息密度与阅读优先级。", href: "/design/information#hierarchy", format: "demo", image: "/images/design-directory/information-cover.jpg" },
  { id: "prototypes", object: "digital", direction: "interaction", title: "关键页面原型", description: "操作钱包、审核、详情与后台工作台示例。", href: "/design/prototypes", format: "demo", image: "/images/design-directory/prototypes-cover.jpg" },
  { id: "states", object: "digital", direction: "interaction", title: "界面状态对照", description: "查看加载、空结果、失败和受限等状态。", href: "/design/states", format: "demo", image: "/images/design-directory/states-cover.jpg" },
  { id: "bm", object: "digital", direction: "interface", title: "BM界面对照", description: "查看手机首页、分类和详情区的局部对照。", href: "/cases/bm-optimization", format: "case", image: "/case-assets/bm-optimization/bm-home-optimization.webp" },
  { id: "u8", object: "digital", direction: "interface", title: "U8界面对照", description: "查看首页入口、底部导航与个人中心材料。", href: "/cases/competitor-analysis", format: "case", image: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.webp" },
  { id: "review", object: "digital", direction: "interface", title: "界面优化图解", description: "六组改前改后对照中的层级、操作和反馈。", href: "/design/review", format: "demo", image: "/images/design-directory/review-cover.jpg" },
  { id: "components", object: "digital", direction: "system", title: "业务组件演示", description: "查看表格、状态与业务组件的展示方式。", href: "/design/information#component", format: "demo", image: "/images/design-directory/components-cover.jpg" },
  { id: "ui-system", object: "digital", direction: "system", title: "UI设计系统", description: "查看网页、手机界面和组件规范的示意输出。", href: "/ai-workflows/ui-design-system", format: "workflow", image: "/case-assets/ai-workflows/ui-design-system/output-01-overview.webp" },
  { id: "banner", object: "communication", direction: "static", title: "首页Banner素材规范", description: "核对PC与H5的尺寸、格式和导出规格。", href: "/design/material-standards?module=banner", format: "standard", image: "/images/design-directory/banner-cover.jpg" },
  { id: "activity", object: "communication", direction: "static", title: "活动图素材规范", description: "查看活动封面、详情图和实际使用位置。", href: "/design/material-standards?module=activity-list", format: "standard", image: "/images/design-directory/activity-cover.jpg" },
]
