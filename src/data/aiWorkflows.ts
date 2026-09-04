export type WorkflowStage = {
  title: string
  description: string
  output: string
}

export type WorkflowScenario = {
  title: string
  description: string
  inputs: string[]
  codexRole: string
  outputs: string[]
  acceptance: string
  tags: string[]
}

export type PromptTemplate = {
  title: string
  scenario: string
  purpose: string
  template: string
  checkpoints: string[]
}

export type ProductionPromptCard = {
  title: string
  category: string
  value: string
  useWhen: string
  flow: string[]
  example: {
    title: string
    description: string
    panels: string[]
  }
  template: string
  checklist: string[]
}

export type WorkflowPlaybook = {
  title: string
  summary: string
  flow: string[]
  reusableLesson: string
}

export type WorkflowTool = {
  name: string
  role: string
  bestFor: string[]
}

export type CodexCaseStudy = {
  title: string
  trigger: string
  materials: string[]
  codexMoves: string[]
  result: string
  reusablePrompt: string
  nextUpgrade: string
  tags: string[]
}

export type WorkflowEntryPoint = {
  title: string
  audience: string
  problem: string
  giveCodex: string[]
  codexSteps: string[]
  result: string
  promptStart: string
  href?: string
}

export const workflowEntryPoints: WorkflowEntryPoint[] = [
  {
    title: "我要搭一个新页面或新板块",
    audience: "适合产品、运营、内容站维护者",
    problem: "需求通常只有一句话，但页面要同时考虑结构、内容、导航、SEO 和验证。",
    giveCodex: ["目标页面一句话", "参考页面或 Figma 链接", "现有项目路径", "不想改变的边界"],
    codexSteps: ["读现有结构", "拆页面模块", "新增数据和页面", "接入导航", "跑检查"],
    result: "一个能打开、能被导航找到、能继续扩展的页面。",
    promptStart: "我想新增一个板块，先读当前项目结构，再给出页面结构和最小实现范围。",
  },
  {
    title: "我要把 Figma 画布变成可讲的方案",
    audience: "适合设计、产品、方案整理",
    problem: "Figma 里信息很多，直接截图或复制文字会很乱，读者看不出主线。",
    giveCodex: ["Figma 节点链接", "目标读者", "想输出的形式", "要保留的原始信息"],
    codexSteps: ["读取节点层级", "抽模块标题", "识别主线", "整理原始信息", "生成页面大纲"],
    result: "一份能放进网站或汇报的流程图、模块地图和说明文案，保留原始材料的业务含义。",
    promptStart: "请读取这个 Figma 节点，只做分析，按原始材料帮我抽出信息架构和展示方案。",
    href: "/ai-workflows/figma-strategy",
  },
  {
    title: "我要做信息图、长图或案例素材",
    audience: "适合内容、设计、知识库维护",
    problem: "图片生成只是第一步，真正难的是文字清晰、文件落地、页面引用和移动端预览。",
    giveCodex: ["文章主题", "图片用途", "已有图片路径", "移动端展示要求"],
    codexSteps: ["确认图片是否存在", "拆分或压缩", "接入 Markdown", "更新图集入口", "预览清晰度"],
    result: "正文能看到、移动端能读、素材路径可维护的信息图内容。",
    promptStart: "请检查这些图片是否真实存在，并把它们接入文章正文和图集入口。",
  },
  {
    title: "我要排查本地或线上显示异常",
    audience: "适合发布、验收、页面 QA",
    problem: "有时构建成功但页面旧、本地端口打不开、样式突然错乱，原因不一定在页面代码。",
    giveCodex: ["现象截图或报错", "访问地址", "最近执行过的命令", "期望看到的版本"],
    codexSteps: ["区分本地服务和线上部署", "检查缓存与构建产物", "验证静态资源路径", "重启或重新发布", "记录原因"],
    result: "知道问题属于 dev server、缓存、构建、部署还是代码，并得到最小修复动作。",
    promptStart: "现在页面显示异常，请先不要改业务代码，帮我判断是缓存、构建还是部署问题。",
  },
]

export const codexCaseStudies: CodexCaseStudy[] = [
  {
    title: "AI 工作流库首版搭建",
    trigger: "用户希望在知识站里新增一个板块，沉淀 Codex、Figma、浏览器验证和内容生产经验。",
    materials: ["现有 W-Gaming 项目结构", "AI 工作流方向说明", "导航和 sitemap 现状", "本地 dev server 状态"],
    codexMoves: ["先读项目数据和页面模式", "新增集中数据文件", "实现总览页面", "接入桌面/移动导航", "跑内容检查和 TypeScript 检查"],
    result: "形成 `/ai-workflows` 总览页，包含入口、流程、场景、提示词模板、案例打法和工具链地图。",
    reusablePrompt:
      "我想新增一个知识库板块。请先读当前项目结构，再按现有风格设计数据模型、页面结构、导航入口和验证步骤。先做最小可访问版本。",
    nextUpgrade: "补详情页、复制按钮、案例库和更明确的学习路径。",
    tags: ["建站", "Next.js", "工作流沉淀"],
  },
  {
    title: "Figma Arrange 策略画布整理",
    trigger: "Figma 画布非常大，直接看截图看不出主线，需要整理成能讲、能落页面的结构。",
    materials: ["Figma 节点链接", "顶层页面结构", "节点截图总览", "关键文本样本"],
    codexMoves: ["先读页面级信息", "抽顶层模块索引", "抓关键 section 文本", "归类为阶段、商业支持、落地页、案例和体系", "转成工作流详情页"],
    result: "形成 `/ai-workflows/figma-strategy`，解释大画布读取顺序、Arrange 模块含义和可复用提示词。",
    reusablePrompt:
      "请读取这个 Figma 节点。先拿顶层结构和截图总览，不要直接实现。按原始材料输出画布主线、模块地图、页面用途和下一步实现范围。",
    nextUpgrade: "继续拆出落地页 V1.0、皮肤案例、设计规范三个专题工作流。",
    tags: ["Figma", "信息架构", "策略整理"],
  },
  {
    title: "网页样式错乱排查",
    trigger: "页面突然看起来错乱，但不确定是 CSS、dev server、构建产物还是缓存问题。",
    materials: ["本地访问地址", "最近执行命令", "页面异常描述", "构建或终端输出"],
    codexMoves: ["先区分代码问题和运行状态问题", "检查 dev server 是否还在", "确认 `.next` 是否被 build 覆盖", "必要时重启服务", "再决定是否改代码"],
    result: "把排查动作沉淀为“先别改业务代码”的调试工作流，减少误修页面样式。",
    reusablePrompt:
      "页面样式异常。请先不要改业务代码，先判断是 dev server、构建产物、缓存、静态资源路径还是代码问题，再给最小修复动作。",
    nextUpgrade: "做成 `/ai-workflows/debugging`，加入端口、静态导出、Netlify、浏览器缓存的检查表。",
    tags: ["排查", "本地服务", "构建"],
  },
  {
    title: "新聊天继续旧任务",
    trigger: "模型上下文满了，需要在新聊天里继续同一个网站任务。",
    materials: ["项目路径", "上一轮完成内容", "当前 dev server 地址", "最新用户偏好", "还没完成的下一步"],
    codexMoves: ["先读取当前文件状态", "不要假设旧上下文完全正确", "用最小检查确认页面和数据", "继续未完成任务", "最后更新验证结果"],
    result: "把断点恢复变成固定交接格式，减少新聊天重新解释成本。",
    reusablePrompt:
      "这是继续旧任务的新聊天。请先读取项目当前状态和已完成页面，不要从零开始。按上一轮未完成事项继续做，并在最后列出修改文件和验证结果。",
    nextUpgrade: "做成接力模板页，专门放“新聊天继续”“Codex 卡住”“服务器重启”等提示词。",
    tags: ["接力", "上下文", "协作"],
  },
]

export const workflowStages: WorkflowStage[] = [
  {
    title: "读取上下文",
    description: "先读交接文档、Figma 节点、现有代码、历史记录和当前页面状态，判断这次任务属于内容、设计、代码还是发布。",
    output: "任务边界、相关文件、受影响页面",
  },
  {
    title: "拆成结构",
    description: "把模糊需求拆成流程、模块、数据、页面和验收项，先确定最小可展示版本。",
    output: "信息架构、场景清单、页面模块",
  },
  {
    title: "生成方案",
    description: "把策略画布、业务目标、参考图和用户反馈转成可执行提示词、内容草稿、组件结构或设计稿还原步骤。",
    output: "提示词模板、内容大纲、实现计划",
  },
  {
    title: "实现与校验",
    description: "按现有项目风格做小步改动，再用内容检查、构建、浏览器或 Figma 视图验证结果。",
    output: "可访问页面、可编辑稿、验证记录",
  },
  {
    title: "沉淀复用",
    description: "把完成的任务复盘成场景库、模板库、检查清单和下次可直接复用的提示词。",
    output: "场景卡片、打法库、可复用资产",
  },
]

export const workflowScenarios: WorkflowScenario[] = [
  {
    title: "基础知识站搭建",
    description: "把交接包、栏目规划、mock 数据和内容边界转成可运行的 Next.js 知识站基础版本。",
    inputs: ["codex-handoff.md", "prompts/*.md", "src/data/*.ts", "content/articles/*.md"],
    codexRole: "读取项目定位，建立路由、组件、数据和 Markdown 展示链路。",
    outputs: ["首页", "栏目页", "文章详情页", "术语库", "模板库"],
    acceptance: "页面能运行，移动端可读，内容像行业知识库，不像推广落地页。",
    tags: ["建站", "内容结构", "Next.js"],
  },
  {
    title: "Figma 策略画布整理",
    description: "从超大 Figma 画布里抽取阶段、模块、案例和设计体系，而不是直接搬运整张截图。",
    inputs: ["Figma 页面/节点", "节点名称", "截图总览", "关键文本样本"],
    codexRole: "把分散设计稿整理成可讲述的信息架构和页面板块。",
    outputs: ["策略摘要", "模块地图", "案例分类", "内容落地建议"],
    acceptance: "保留原始业务目标和材料含义，形成能继续写页面、做汇报或拆任务的结构。",
    tags: ["Figma", "信息架构", "策略整理"],
  },
  {
    title: "移动端落地页还原",
    description: "根据参考截图或 Figma 设计，按目标视口重新搭建移动页面，并用真实宽度验证。",
    inputs: ["参考截图", "Figma 尺寸", "素材图片", "路由/联系方式数据"],
    codexRole: "重建结构、控制宽度、还原视觉层级，并把可变内容做成配置。",
    outputs: ["HTML 页面", "移动端预览", "可配置数据区", "验收记录"],
    acceptance: "目标宽度不横向溢出，核心行从正确序号开始，按钮和联系区可维护。",
    tags: ["移动端", "还原", "QA"],
  },
  {
    title: "信息图与长图入站",
    description: "把生成图、拆分图、压缩图和文章正文串起来，确保读者真的能在页面里看到清晰图解。",
    inputs: ["本地图片", "文章 Markdown", "imagePrompts 数据", "移动端预览"],
    codexRole: "检查真实文件路径，接入正文渲染，验证清晰度和加载策略。",
    outputs: ["正文图解", "图集入口", "版本化图片路径", "阅读页预览"],
    acceptance: "图片不是只在元数据里，正文可见，中文文字在移动端可读。",
    tags: ["图解", "内容生产", "图片资产"],
  },
  {
    title: "发布与缓存排查",
    description: "当本地、构建产物和线上显示不一致时，逐层确认 dev server、out 目录、静态资源和 Netlify 发布路径。",
    inputs: ["build 日志", "out 目录", "Netlify 配置", "线上静态资源路径"],
    codexRole: "区分本地服务问题、构建问题、缓存问题和部署路径问题。",
    outputs: ["检查命令", "问题定位", "修复建议", "发布说明"],
    acceptance: "能说明为什么线上旧、为什么本地打不开，以及下一步该验证哪里。",
    tags: ["部署", "Netlify", "验证"],
  },
  {
    title: "内容改写与来源校验",
    description: "把 Notes、Lark、浏览器来源和 Codex 改写串成一套稳定的中文内容生产流程。",
    inputs: ["草稿", "引用来源", "浏览器搜索结果", "目标语气"],
    codexRole: "保留核心意思，修正语气和结构，提醒需要核验的引用。",
    outputs: ["可发布文案", "来源检查提示", "精简版/正式版"],
    acceptance: "文案适合工作场景，引用不靠记忆硬写，技术片段不误入内容任务。",
    tags: ["文案", "来源校验", "协作"],
  },
]

export const promptTemplates: PromptTemplate[] = [
  {
    title: "网站基础版本搭建",
    scenario: "网站搭建",
    purpose: "让 Codex 先读项目，再搭一个能打开、能导航、能继续扩展的基础版本。",
    template:
      "我想搭建一个网站基础版本。请先读取当前项目结构、数据文件、已有页面和组件风格，再给出最小可实现范围。确认后直接实现：新增必要数据、页面、导航入口和 SEO/sitemap；保持现有设计风格；完成后运行最快相关检查，并告诉我本地访问地址、修改文件和验证结果。",
    checkpoints: ["是否先读项目结构", "是否接入导航", "是否有可访问路由", "是否完成基础验证"],
  },
  {
    title: "Figma 还原设计图",
    scenario: "设计还原",
    purpose: "从 Figma 或截图还原页面，不把宽稿粗暴缩放，而是按真实视口重建。",
    template:
      "请读取这个 Figma 节点/参考截图，先分析页面结构、层级、组件、颜色、间距和目标视口。然后按当前项目技术栈还原页面：优先复用已有组件和样式，图片与文案用可维护数据承载。完成后检查桌面和移动端是否溢出、文字是否遮挡、关键模块是否与参考一致。",
    checkpoints: ["是否拆出页面层级", "是否按目标视口实现", "是否复用现有样式", "是否完成视觉验收"],
  },
  {
    title: "信息图生成",
    scenario: "图文内容",
    purpose: "把复杂概念、流程或案例变成可读的信息图，而不是只生成漂亮背景。",
    template:
      "请基于这个主题生成信息图方案。先把内容拆成 3-5 个信息层级：标题、核心结论、流程/对比/清单、关键数字或案例、结尾提醒。再给出适合生成图片的提示词，要求中文清晰、版式留白、移动端可读、不要堆太多字。最后给出图片落地建议：文件名、放置路径、正文引用位置和验收标准。",
    checkpoints: ["是否先拆信息层级", "是否控制文字密度", "是否说明画面结构", "是否包含落地位置"],
  },
  {
    title: "界面图生成",
    scenario: "产品界面",
    purpose: "为产品说明、方案页或案例页生成可展示的界面视觉，突出真实模块和信息层级。",
    template:
      "请把这个产品场景转成界面图生成方案。先列出页面类型、核心模块、关键数据、状态和视觉重点，再输出图片生成提示词：画面要像真实 SaaS/后台/移动产品界面，信息密度适中，层级清楚，避免纯装饰。最后补充如何把生成图用于网站：适合放在哪个页面、配什么标题、需要检查哪些细节。",
    checkpoints: ["是否有真实界面模块", "是否说明数据状态", "是否避免纯装饰", "是否给出页面用途"],
  },
  {
    title: "Banner 图生成",
    scenario: "视觉资产",
    purpose: "为文章、专题或板块首屏生成能表达主题的横幅图，避免空泛氛围图。",
    template:
      "请为这个主题设计 Banner 图生成提示词。先判断它要表达的主体、使用位置、横幅比例、文字是否需要进图、希望读者第一眼看到什么。再输出图片生成提示词，要求主体明确、留出标题区域、不要过暗或过度虚化、适合网站首屏/文章头图。最后给出 2 个备选风格和验收标准。",
    checkpoints: ["是否有明确主体", "是否说明比例", "是否留标题空间", "是否给出备选风格"],
  },
]

export const productionPromptCards: ProductionPromptCard[] = [
  {
    title: "信息图生成提示词",
    category: "图文内容",
    value: "把复杂知识点、流程、案例复盘变成一张能读懂的图。",
    useWhen: "适合文章核心概念、案例拆解、流程说明、对比清单。",
    flow: ["拆信息层级", "定版式比例", "写图像提示词", "生成并验收文字", "接入页面"],
    example: {
      title: "案例：把 AI 工作流做成长图",
      description: "左侧放流程，右侧放输入/输出，中间用 5 步线串起来。",
      panels: ["标题与一句话结论", "5 步流程", "输入材料", "最终产物"],
    },
    template:
      "请基于【主题】生成一张信息图的完整方案。\n\n目标读者：【谁看】\n图片用途：【文章头图/正文图/长图/汇报图】\n核心内容：【要讲的 3-5 个点】\n尺寸比例：【如 16:9 / 4:5 / 9:16 / 长图】\n\n请输出：\n1. 信息层级：标题、核心结论、流程/对比/清单、关键案例、结尾提醒。\n2. 画面结构：每一块放什么，文字量如何控制。\n3. 图片生成提示词：中文清晰、留白充足、移动端可读、不要堆满文字。\n4. 验收标准：文字是否清楚、层级是否明显、缩小后是否还能读。\n5. 入站建议：文件名、放置路径、正文插入位置。",
    checklist: ["主题清楚", "文字少而准", "移动端可读", "能落到页面"],
  },
  {
    title: "界面图生成提示词",
    category: "产品界面",
    value: "把产品能力、后台流程或移动端体验变成可展示的真实界面图。",
    useWhen: "适合方案页、案例页、产品说明、功能模块展示。",
    flow: ["定义页面类型", "列核心模块", "补数据状态", "生成界面图", "配页面文案"],
    example: {
      title: "案例：后台运营看板图",
      description: "用卡片、表格、趋势、筛选器表达真实管理场景。",
      panels: ["顶部指标", "筛选区", "数据表格", "趋势图"],
    },
    template:
      "请把【产品/功能场景】转成一张界面图生成提示词。\n\n界面类型：【后台看板/移动页/配置页/列表页/详情页】\n核心模块：【模块 1、模块 2、模块 3】\n关键数据：【要出现的数据、状态、标签】\n使用位置：【网站页面/案例配图/方案展示】\n视觉要求：【克制/专业/科技/轻量/移动端】\n\n请输出：\n1. 界面结构：从上到下有哪些区域。\n2. 每个模块显示什么信息。\n3. 图片生成提示词：像真实 SaaS/后台/移动产品界面，信息层级清楚，不要纯装饰。\n4. 负面约束：不要假数据堆满、不要夸张光效、不要过度营销。\n5. 页面搭配建议：配什么标题、适合放在哪个板块。",
    checklist: ["像真实产品", "模块明确", "数据可信", "能直接配页面"],
  },
  {
    title: "Banner 图生成提示词",
    category: "视觉资产",
    value: "为专题、文章或新板块生成第一眼能说明主题的横幅图。",
    useWhen: "适合文章头图、专题首屏、栏目入口、案例封面。",
    flow: ["确定主体", "选比例", "预留文字区", "生成 2 个风格", "检查首屏效果"],
    example: {
      title: "案例：AI 工作流库 Banner",
      description: "主体是流程板、提示词卡和界面缩略图，不做抽象光效。",
      panels: ["主题主体", "留白标题区", "流程元素", "轻量背景"],
    },
    template:
      "请为【主题】设计 Banner 图生成提示词。\n\n使用位置：【首页模块/文章头图/专题页首屏】\n比例尺寸：【如 16:9 / 21:9 / 1200x630】\n画面主体：【必须看到什么】\n文字策略：【图内无字/少量标题/留出网页标题区】\n风格方向：【专业/清爽/设计感/产品感】\n\n请输出：\n1. 主视觉构图：主体、背景、留白、焦点。\n2. 图片生成提示词：主体明确，不要过暗，不要模糊，不要只有抽象背景。\n3. 两个备选风格：稳重版、视觉冲击版。\n4. 验收标准：缩略图能否看出主题，标题是否有位置，是否适合首屏。",
    checklist: ["主体明确", "比例可用", "标题不冲突", "缩略图能识别"],
  },
  {
    title: "Figma 还原设计图提示词",
    category: "设计还原",
    value: "从 Figma 或截图还原出可运行页面，保留布局、层级和真实视口。",
    useWhen: "适合落地页、移动页、后台页、专题页从设计稿进入实现。",
    flow: ["读节点/截图", "拆布局层级", "确认视口", "实现页面", "截图验收"],
    example: {
      title: "案例：移动端页面还原",
      description: "先按 390px 视口重建，再检查横向溢出和按钮位置。",
      panels: ["设计稿层级", "真实视口", "组件复用", "浏览器验收"],
    },
    template:
      "请根据这个【Figma 链接/截图路径】还原设计图。\n\n目标页面：【页面名称】\n目标视口：【桌面/移动端宽度，例如 390px】\n必须保留：【图片、模块顺序、按钮、关键文案】\n项目路径：【本地项目路径】\n\n请先分析，不要马上改：\n1. 页面层级和模块顺序。\n2. 颜色、字体、间距、按钮、图片和卡片规则。\n3. 哪些可以复用现有组件，哪些需要新建。\n\n确认后实现：按真实视口重建，不要把宽稿直接缩放；完成后检查横向溢出、文字遮挡、图片比例和核心按钮位置。",
    checklist: ["先分析层级", "按真实视口", "不粗暴缩放", "有截图验收"],
  },
  {
    title: "网站搭建提示词",
    category: "网站搭建",
    value: "从一句需求开始，搭出有页面、导航、数据和验证的基础网站或新板块。",
    useWhen: "适合新站首版、新栏目、新专题、新资料库。",
    flow: ["读项目结构", "定首版范围", "建数据和页面", "接导航", "跑检查"],
    example: {
      title: "案例：AI 工作流库首版",
      description: "从一个新板块需求，落成总览页、详情页、导航和 sitemap。",
      panels: ["页面入口", "数据模型", "详情页", "验证记录"],
    },
    template:
      "我想做【网站/新板块名称】的基础版本。\n\n目标：【一句话说明这个网站/板块解决什么】\n读者：【谁会看】\n已有材料：【Figma、文案、截图、旧页面、文件路径】\n必须保留：【项目风格、导航结构、数据写法、不能改的文件】\n首版验收：【能打开哪些路由、看到哪些内容、跑哪些检查】\n\n请先读取当前项目结构，再给出最小实现范围。然后直接实现：新增数据、页面、必要组件、导航入口和 sitemap。完成后给出本地访问地址、修改文件和验证结果。",
    checklist: ["首版范围清楚", "路由可访问", "导航接入", "检查通过"],
  },
]

export const workflowPlaybooks: WorkflowPlaybook[] = [
  {
    title: "W-Gaming 基础站",
    summary: "从交接包和 mock 数据出发，逐步补齐首页、栏目、文章、术语和模板，并用内容检查与构建稳定交付。",
    flow: ["读交接包", "搭路由和组件", "接入数据", "补阅读体验", "跑 check:content 和 build"],
    reusableLesson: "内容型站点先把数据和路由跑通，再做视觉和专题增强，返工会少很多。",
  },
  {
    title: "Figma MCP 可编辑稿",
    summary: "当目标是 Figma 设计稿时，直接用 Figma 工具生成可编辑层，HTML/SVG 只作为临时桥接。",
    flow: ["读取节点", "确定目标尺寸", "拆模块", "写入 Figma", "截图/图层验证"],
    reusableLesson: "用户要的是可编辑设计稿时，最终交付物要留在 Figma 里，而不是只给本地预览。",
  },
  {
    title: "390px 移动落地页",
    summary: "从参考图还原移动端页面时，围绕真实视口重建，而不是缩放桌面稿。",
    flow: ["锁定视口", "拆模块", "还原顶部图", "配置数据", "检查 scrollWidth"],
    reusableLesson: "移动页验收要看真实宽度、按钮位置和可维护数据，不只看截图相似。",
  },
  {
    title: "信息图内容生产",
    summary: "生成图不是终点，还要检查文字清晰度、文件落地、正文引用和页面预览。",
    flow: ["确认图像用途", "生成/拆分", "放入 public", "接入 Markdown", "移动端检查"],
    reusableLesson: "图片资产必须以真实本地文件为准，不能只相信聊天里的临时附件。",
  },
]

export const workflowTools: WorkflowTool[] = [
  {
    name: "Codex",
    role: "把需求拆成代码、内容、验证和复盘资产。",
    bestFor: ["读项目结构", "实现页面", "生成模板", "排查构建和部署"],
  },
  {
    name: "Figma",
    role: "承载策略画布、页面结构、可编辑设计稿和设计规范。",
    bestFor: ["节点读取", "模块拆分", "设计还原", "规范沉淀"],
  },
  {
    name: "Chrome / Browser",
    role: "用真实页面状态验证尺寸、交互、图片、链接和线上表现。",
    bestFor: ["移动端 QA", "本地预览", "线上核验", "截图对比"],
  },
  {
    name: "Lark / Notes",
    role: "作为需求、文案、反馈和临时想法的工作缓冲区。",
    bestFor: ["需求记录", "文案暂存", "反馈整理", "来源核验"],
  },
  {
    name: "Netlify",
    role: "发布静态导出产物，并验证线上版本是否与本地构建一致。",
    bestFor: ["生产发布", "静态资源检查", "缓存判断", "CI 验证"],
  },
]
