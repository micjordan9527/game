export type AiWorkflowOutput = {
  title: string
  image: string
  alt: string
}

export type AiWorkflowVisualKind = "brief" | "directions" | "assets" | "figma" | "handoff"

export type AiWorkflow = {
  slug: string
  title: string
  summary: string
  scenario: string
  tags: string[]
  prompt: string
  referenceNote: string
  extensionNote?: string
  caseImage: string
  caseAlt: string
  outputs: AiWorkflowOutput[]
}

export const aiWorkflows: AiWorkflow[] = [
  {
    slug: "brand-visual-system",
    title: "品牌视觉系统",
    summary: "基于 Logo 延展完整的品牌视觉系统，覆盖主色、辅助色、字体、版式、图形语言与多端应用场景。",
    scenario: "品牌设计",
    tags: ["Logo", "品牌规范", "网页视觉", "移动端界面", "应用物料"],
    prompt:
      "基于这个logo，生成一整套完整的品牌视觉系统。\n行业：博彩体育游戏\n风格：整体要求高级感、冷静、克制、现代、简洁，突出品牌质感与统一性。\n范围：请延展品牌主色、辅助色、字体风格、版式规范、图形语言、品牌海报、网页视觉、移动端界面、名片、包装或社交媒体物料等应用场景，确保整体视觉统一、精致，并具有国际化审美。",
    referenceNote: "LOGO",
    caseImage: "/case-assets/ai-workflows/brand-visual-system/case-screenshot.webp",
    caseAlt: "品牌视觉系统案例截图",
    outputs: [
      {
        title: "输出 1：品牌基础规范",
        image: "/case-assets/ai-workflows/brand-visual-system/output-01-brand-overview.webp",
        alt: "品牌视觉系统的基础规范图，包含主色、辅助色、字体和排版结构",
      },
      {
        title: "输出 2：图形语言与品牌海报",
        image: "/case-assets/ai-workflows/brand-visual-system/output-02-brand-poster.webp",
        alt: "品牌图形语言延展与品牌海报样式应用",
      },
      {
        title: "输出 3：网页视觉设计",
        image: "/case-assets/ai-workflows/brand-visual-system/output-03-web-visual.webp",
        alt: "品牌网页视觉设计输出图，展示首页与核心页面风格",
      },
      {
        title: "输出 4：移动端界面",
        image: "/case-assets/ai-workflows/brand-visual-system/output-04-mobile-visual.webp",
        alt: "品牌移动端界面输出图，展示移动端信息排版与视觉延展",
      },
      {
        title: "输出 5：应用物料",
        image: "/case-assets/ai-workflows/brand-visual-system/output-05-materials-and-application.webp",
        alt: "品牌物料与名片、社交媒体等应用场景的延展输出",
      },
    ],
  },
  {
    slug: "ui-design-system",
    title: "UI 设计系统",
    summary: "用一张参考风格截图生成一套包含网页端、移动端、卡片、控件和按钮的 UI 设计系统图。",
    scenario: "UI 设计",
    tags: ["参考图", "设计系统", "网页端", "移动端界面", "组件规范"],
    prompt: "用这种风格帮我生成一套UI设计系统的图，包含网页、移动端、卡片、控件、按钮以及其它",
    referenceNote: "提供几个主页面图片。一般做一个新的项目，先尝试几个主页面，确认整体风格和页面结构后，再提取组件、控件和设计系统规范。",
    extensionNote: "使用 Figma MCP 可以把图片还原成可编辑设计图，并进一步整理自动布局、组件库和可复用规范。",
    caseImage: "/case-assets/ai-workflows/ui-design-system/case-screenshot.webp",
    caseAlt: "UI 设计系统案例截图",
    outputs: [
      {
        title: "输出 1：UI 设计系统总览",
        image: "/case-assets/ai-workflows/ui-design-system/output-01-overview.webp",
        alt: "UI 设计系统总览，包含色彩、字体、页面示例和核心组件",
      },
      {
        title: "输出 2：网页端设计系统",
        image: "/case-assets/ai-workflows/ui-design-system/output-02-web.webp",
        alt: "网页端设计系统，包含导航、首页、列表、账户中心和布局规范",
      },
      {
        title: "输出 3：卡片与内容组件",
        image: "/case-assets/ai-workflows/ui-design-system/output-03-cards.webp",
        alt: "卡片与内容组件规范，包含赛事卡、钱包卡、公告卡和状态变化",
      },
      {
        title: "输出 4：控件、按钮与其它规范",
        image: "/case-assets/ai-workflows/ui-design-system/output-04-controls.webp",
        alt: "控件、按钮、表单、反馈和其它组件规范",
      },
    ],
  },
]

export const aiWorkflowScenarios = ["全部", ...Array.from(new Set(aiWorkflows.map((workflow) => workflow.scenario)))]
export const aiWorkflowTags = ["全部", ...Array.from(new Set(aiWorkflows.flatMap((workflow) => workflow.tags)))]

export function getAiWorkflow(slug: string) {
  return aiWorkflows.find((workflow) => workflow.slug === slug)
}
