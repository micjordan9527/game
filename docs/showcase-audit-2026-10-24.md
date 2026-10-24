# 全站展示方向审查：作品先出现，图解讲清楚

审查日期：2026-10-24。此文保留改版前基线；执行结果见 [展示改版记录](showcase-release-2026-10-24.md)。最新方向：不安排作业、答题、打卡或课程完成任务；作品优先展示；功能做法通过信息图、对照图和短流程快速解释。旧的课程化扩展计划应按这一方向调整。

本报告逐页覆盖当前静态构建的81个站内页面（含旧版本页面），另检查3个嵌入预览和404页；以1440×900、390×844两种宽度查看，共170次页面检查。检查默认布局、内容顺序和重点展示入口，不等同于逐一验收全部业务动作。页面内容、功能和线上部署本轮未修改。

## 1. 整体判断

现有作品、信息图、原型与素材足以支撑展示站。主要问题是它们被课程入口、解释文字、阅读路径、练习和重复卡片包裹。改版应围绕看见成果、看懂功能、可选体验组织内容。

- 30个页面直接显示理解检查、应用练习或课程模块；另一个设计评审页面包含六道题、正确率和下一题，共31页有明确的课程或答题式展示。业务演示中的“处理中”“未完成”等真实状态标签不纳入这一计数。
- 首页首屏没有作品图片，当前突出文章数量、资料数量和从基础开始；手机完整页面约8707px。
- BM与后台优化的第一张作品/原型在桌面约3913/3935px、手机约6791/7087px才出现。
- 品牌与UI工作流拥有五张/四张输出成果，但详情先展示提示词、参考说明和聊天截图。
- 新增的会员、钱包、代理文章手机页面约12427/13084/13703px；有状态表、流程图等资料，但完整图解没有成为首屏。
- 体育专题已普遍使用演示在前、长解释折叠的结构，适合局部调整；素材规范也具备直观预览与使用价值。

## 2. 全站内容结构建议

主导航优先：作品案例、功能图解、AI成果、素材规范。搜索作为常用工具；术语、模板、长文作为辅助资料。角色保留为筛选维度，减少独立课程路径与重复总览。

| 内容任务 | 建议打开后先看到 | 补充操作 |
| --- | --- | --- |
| 展示作品 | 大图、可操作页面或实际成果 | 放大、切换作品、全屏体验 |
| 说明功能 | 一张关系/流程/对照信息图和一句结论 | 切换场景、查看简短标注 |
| 展示AI做法 | 最终成果，随后是输入→处理→输出图 | 复制提示词、查看输入参考 |
| 提供工具资料 | 成品预览、尺寸或使用结果 | 查询、复制、下载，自愿填写 |

公开页面移除：理解检查、应用练习、题库、正确率、下一题、学习完成度、课程打卡、建议学习时长、读完后交作业式要求。将有价值的解释改写为图解；单纯折叠旧练习不能完成方向调整。

## 3. 81个站内页面逐页清单

优先级分布：P0 9页，P1 52页，P2 20页。P0优先纠正展示方向；P1重排内容并补图解；P2保留现有能力、轻量改善或处理历史入口。移除共用练习组件可同时影响多个页面，不代表逐页重复开发。

### 首页、作品入口与查询（5页）

| 页面 | 当前问题 | 建议呈现 | 优先级 |
| --- | --- | --- | --- |
| [首页](https://knowledge001.netlify.app/)<br>`/` | 首屏是介绍、资源数量和学习入口，没有作品图片；下方仍以阅读路径和文章为主。 | 首屏用真实作品拼图或精选作品大卡，主入口为看作品/体验演示；数量、角色筛选和资料入口后置。 | P0 |
| [案例模块](https://knowledge001.netlify.app/cases)<br>`/cases` | 四张卡片只有两张有封面，还展示学习目标、难度、时长和接入状态。 | 四个案例统一真实封面、一个亮点、一种明确动作；区分交互演示、对照图和网站预览。 | P0 |
| [文章资料库](https://knowledge001.netlify.app/articles)<br>`/articles` | 列表以文字卡片和难度筛选为主，难以快速识别文章能展示什么。 | 改成图解目录，展示图解缩略图、主题和一句结论；按关系图/流程图/对照图/功能地图筛选。 | P1 |
| [术语库](https://knowledge001.netlify.app/glossary)<br>`/glossary` | 27个术语默认铺开，手机页高约1.6万px，查一个概念时视觉负担较大。 | 保留搜索，默认只呈现术语和一句话解释；场景与关联概念按需展开，复杂关系提供小图。 | P2 |
| [全站搜索](https://knowledge001.netlify.app/search)<br>`/search` | 能够检索资源，但结果主要是文字，作品与图解缺少直观区分。 | 作品/图解结果显示缩略图，标出可体验或可放大；工具类保留紧凑文字结果。 | P2 |

### 八个知识栏目（8页）

| 页面 | 当前问题 | 建议呈现 | 优先级 |
| --- | --- | --- | --- |
| [行业入门](https://knowledge001.netlify.app/industry)<br>`/industry` | 理解检查和课程路径先于具体内容，入口像课程目录。 | 用一张平台全景关系图开场，再提供会员、代理、钱包、游戏等图解入口。 | P1 |
| [体育博彩](https://knowledge001.netlify.app/sportsbook)<br>`/sportsbook` | 与体育模块页重复组织入口，问答、角色路径和筛选叠加，并有整页横向溢出。 | 以体育业务全景图连接赛事、盘口、注单、结算；与/sports统一入口逻辑并修复横向溢出。 | P1 |
| [包网科普](https://knowledge001.netlify.app/white-label)<br>`/white-label` | 课程目标和文章入口多于可直接理解的交付示意。 | 展示前台、后台、游戏、支付、运维的模块地图和交付示意，移除理解检查与完成度。 | P1 |
| [产品设计](https://knowledge001.netlify.app/product)<br>`/product` | 主题路径有价值，但课程、检查、文章和模板多层重复。 | 改成会员、钱包、代理、活动、报表的功能地图；每个模块直接打开图解或现有原型。 | P1 |
| [运营治理](https://knowledge001.netlify.app/operation)<br>`/operation` | 已有协作模型，仍叠加课程目标、理解检查、学习路径。 | 以活动规则、渠道质量、数据复盘的成果示例和闭环图组织内容，减少重复解释。 | P1 |
| [设计体验](https://knowledge001.netlify.app/design)<br>`/design` | 原型、素材和组件被课程入口及评审练习包装，案例感偏弱。 | 首屏展示原型截图与可体验入口，按组件/页面/移动端/素材归类；移除答题与课程完成度。 | P1 |
| [技术开发](https://knowledge001.netlify.app/development)<br>`/development` | 架构与接口主题被讲义、课程目标和阅读顺序包裹。 | 用接口链路图、系统架构图和状态时序图做入口，技术细节作为可选参考。 | P1 |
| [运维风控](https://knowledge001.netlify.app/devops-risk)<br>`/devops-risk` | 以课程目标和检查项介绍概念，缺少直观异常处理场景。 | 用告警发现、定位、处置、恢复的流程图与权限对照图展示能力。 | P1 |

### 四个案例详情（4页）

| 页面 | 当前问题 | 建议呈现 | 优先级 |
| --- | --- | --- | --- |
| [BM优化](https://knowledge001.netlify.app/cases/bm-optimization)<br>`/cases/bm-optimization` | 作品前有约2000字符的分析、学习引导和练习；手机首张图位于约6791px。 | 短标题后直接展示首页/详情对照图；在图上用三处标注说明差异，移出答题、练习和长评审清单。 | P0 |
| [后台优化](https://knowledge001.netlify.app/cases/admin-optimization)<br>`/cases/admin-optimization` | 交互原型被多层说明、版本面板、分析和练习挡住；手机原型位于约7087px。 | 原型直接进入首屏，突出全屏体验和角色切换；功能说明用角色看板与模块关系信息图。 | P0 |
| [包网官网](https://knowledge001.netlify.app/cases/white-label-official)<br>`/cases/white-label-official` | 学习目标、进度和理解检查在预览前；手机预览约1406px才出现。 | 优先显示官网预览与全屏打开；用缩略图标注首屏、服务、联系入口三处设计亮点。 | P0 |
| [竞品分析](https://knowledge001.netlify.app/cases/competitor-analysis)<br>`/cases/competitor-analysis` | 已有U8信息图，仍要先经过学习引导和问答；手机首图约1687px。 | 先展示U8首页与个人中心对照图，图片导航和放大操作前置；每张图只留一句核心变化。 | P0 |

### AI成果与工作流（8页）

| 页面 | 当前问题 | 建议呈现 | 优先级 |
| --- | --- | --- | --- |
| [AI工作流库](https://knowledge001.netlify.app/ai-workflows)<br>`/ai-workflows` | 当前只有两条资源，筛选区较复杂；封面是聊天/案例截图，未直接突出最好的一张成果。 | 以最好的一张输出成果做封面；保留轻量筛选，卡片直达成果；聊天截图放在过程说明中。 | P1 |
| [品牌视觉系统](https://knowledge001.netlify.app/ai-workflows/brand-visual-system)<br>`/ai-workflows/brand-visual-system` | 提示词、参考说明、聊天截图先于五张输出成果；手机首张输出主图约2157px才出现。 | 成果大图和五张缩略图先展示；下方用Logo输入→视觉延展→应用成果三步信息图解释，提示词可复制。 | P0 |
| [UI设计系统](https://knowledge001.netlify.app/ai-workflows/ui-design-system)<br>`/ai-workflows/ui-design-system` | 大段提示和参考截图抢在组件与页面成果之前；手机首张输出主图约2103px才出现。 | 先展示页面与组件系统成果；用参考风格→页面方向→组件提取的信息图解释做法。 | P0 |
| [Codex实战案例库](https://knowledge001.netlify.app/ai-workflows/codex-cases)<br>`/ai-workflows/codex-cases` | 主体是场景、过程文字和开场提示词，缺少实际结果截图；还显示如何继续扩展案例库的维护话术。 | 每个案例用结果截图/预览做封面，配输入→处理→成果简图；提示词按需复制，移除维护说明。 | P1 |
| [Figma策略画布](https://knowledge001.netlify.app/ai-workflows/figma-strategy)<br>`/ai-workflows/figma-strategy` | 页面讲输入材料、读取顺序和输出要求，但没有实际画布与整理结果图。 | 用整理前画布→模块归类→整理后结构的对照图说明，辅以三步流程；有真实素材再展示成果。 | P1 |
| [AI提示词模板库](https://knowledge001.netlify.app/ai-workflows/prompt-library)<br>`/ai-workflows/prompt-library` | 提示词可用，但卡片及流程多数仍是文字，访客不易判断复制后能得到什么。 | 每条提示词先展示一张结果示例或明确标注的结构示意，再给简短输入要求和复制按钮。 | P2 |
| [工作流旧V1](https://knowledge001.netlify.app/ai-workflows/v1)<br>`/ai-workflows/v1` | 旧版长页约4900字符，手机约1.8万px，与新版入口并存，含封版/归档维护说明。 | 作为历史兼容入口简化或引导到对应新版资源，退出主要导航，不再扩充长页。 | P2 |
| [工作流旧V2](https://knowledge001.netlify.app/ai-workflows/v2)<br>`/ai-workflows/v2` | 独立归档说明页继续解释网站结构调整，增加无效中转。 | 保留旧链接兼容，直接引导到新版成果库；不让访客理解版本演变。 | P2 |

### 设计专题与素材（5页）

| 页面 | 当前问题 | 建议呈现 | 优先级 |
| --- | --- | --- | --- |
| [信息层级与组件](https://knowledge001.netlify.app/design/information)<br>`/design/information` | 有组件、密度、响应式等可用演示，但多个工具连续堆叠，说明偏多。 | 先给差/优布局对照图，再用页签展示组件、表格密度和响应变化；每块只解释一个取舍。 | P1 |
| [关键页面原型](https://knowledge001.netlify.app/design/prototypes)<br>`/design/prototypes` | 钱包、风控、注单、工作台四个完整原型纵向排列，手机浏览路径较长。 | 用四张截图做原型切换导航，默认打开一个代表页面，说明以界面标注和短流程图呈现。 | P1 |
| [移动端与状态反馈](https://knowledge001.netlify.app/design/mobile)<br>`/design/mobile` | 已有手机原型和状态演示，但同页包含多个相近工具与检查式说明，原型还关联课程完成事件。 | 展示完整手机流程图与状态对照，保留自愿体验；移除课程完成联动，业务状态标签照常表达。 | P1 |
| [评审与交付](https://knowledge001.netlify.app/design/review)<br>`/design/review` | 首屏就是六道题、正确率和下一题，后面还有八项勾选与完成度，明显偏离展示目的。 | 重做为六组改前/改后界面图及一张产品→交互→设计→开发交付图，直接给结论与依据，不设题目和得分。 | P0 |
| [代理素材规范](https://knowledge001.netlify.app/design/material-standards)<br>`/design/material-standards` | 规范、预览和源稿实用，桌面存在全站侧栏与内嵌侧栏并列，外层标题说明占一定空间。 | 保留规范查询与源稿入口，外层头部压缩；增加直达常用素材的缩略图，优化手机和完整窗口体验。 | P2 |

### 体育模块与专题（15页）

| 页面 | 当前问题 | 建议呈现 | 优先级 |
| --- | --- | --- | --- |
| [体育模块总览](https://knowledge001.netlify.app/sports)<br>`/sports` | 角色路径和14个文字模块卡较长，与/sportsbook形成两套相近入口。 | 用一张体育产品全景图和代表演示截图导航；角色只做筛选，统一两个总览的分工。 | P1 |
| [玩法解读](https://knowledge001.netlify.app/sports/betting-explanation)<br>`/sports/betting-explanation` | 大表格适合查规则，初次打开不易快速理解玩法差异。 | 各玩法先放一张比分/条件判定示意卡，规则表继续作为查询工具。 | P1 |
| [体育产品结构](https://knowledge001.netlify.app/sports/sports-product)<br>`/sports/sports-product` | 演示在前的方向较好，但完整链路要逐步点击才看完。 | 默认给出赛事列表→详情→确认→记录四屏缩略图，点击再看每一步的动态反馈。 | P2 |
| [盘口与赔率基础](https://knowledge001.netlify.app/sports/sports-odds-basics)<br>`/sports/sports-odds-basics` | 已有条件切换示例，概念仍依赖旁边文字解释。 | 用同一比分的判定对照图解释条件与数字，保留参数切换作为补充体验。 | P2 |
| [注单生命周期](https://knowledge001.netlify.app/sports/bet-ticket-lifecycle)<br>`/sports/bet-ticket-lifecycle` | 已有时间线演示，异常路径仍需要逐场景浏览。 | 正常路径一条时间线，超时/退款/更正用分支图；点选状态展示关联页面。 | P2 |
| [赛事数据与状态](https://knowledge001.netlify.app/sports/match-data-status)<br>`/sports/match-data-status` | 场景切换可读，但赛事、市场、注单三种状态的对应关系没有一屏全览。 | 给出三条对齐状态轨道图，先看全貌，再可选切换场景。 | P2 |
| [后台配置](https://knowledge001.netlify.app/sports/sports-admin-config)<br>`/sports/sports-admin-config` | 有可操作配置演示，变更对前台和日志的影响需读多处说明。 | 用配置前后对照与后台→前台→记录联动图解释，保留实际控件演示。 | P2 |
| [体育风控场景](https://knowledge001.netlify.app/sports/sports-risk)<br>`/sports/sports-risk` | 能切换风险场景，决策过程仍以状态与文字卡组织。 | 用信号→判断→处理→反馈四步图展示放行、限额、复核等分支。 | P2 |
| [操盘基础](https://knowledge001.netlify.app/sports/sports-trading)<br>`/sports/sports-trading` | 演示已前置，事件、赔率、市场、已受理记录的区别需要主动切换理解。 | 用四泳道变化图对齐同一事件的影响，交互用于放大某条链路。 | P2 |
| [结算与对账](https://knowledge001.netlify.app/sports/sports-settlement-reconciliation)<br>`/sports/sports-settlement-reconciliation` | 已有比对演示，三方记录与异常处理的关系可更直观。 | 展示赛果/注单/钱包三列对齐图，匹配与不匹配分别标出后续动作。 | P2 |
| [运营场景](https://knowledge001.netlify.app/sports/sports-operation-scenes)<br>`/sports/sports-operation-scenes` | 场景演示有价值，触达条件、页面和结果分散在说明里。 | 使用用户条件→触达内容→落地页面→反馈的四格情境图。 | P2 |
| [客服与规则说明](https://knowledge001.netlify.app/sports/sports-service-rules)<br>`/sports/sports-service-rules` | 已从用户问题进入演示，定位证据的步骤还能缩短。 | 用用户问题→记录证据→当前状态→可说明结果的信息图组织场景。 | P2 |
| [体育设计体验](https://knowledge001.netlify.app/sports/sports-design-experience)<br>`/sports/sports-design-experience` | 四种状态可切换，无法直接同时比较不同状态的界面差异。 | 默认并排给出四种状态小样，保留单张放大与交互演示。 | P2 |
| [技术接入](https://knowledge001.netlify.app/sports/sports-integration)<br>`/sports/sports-integration` | 四步接口演示方向符合定位，但读完整个过程仍依赖逐步查看文字。 | 用赛事事件→行情→受理→结算的系统链路图，关键字段在节点旁简短标注。 | P2 |
| [管理看板](https://knowledge001.netlify.app/sports/sports-management-dashboard)<br>`/sports/sports-management-dashboard` | 已有看板场景，适合展示，当前结构仍强调按步骤理解指标。 | 先展示完整看板示例，用三处标注说明发现异常、定位原因、进入处理。 | P2 |

### 二十一篇文章（21页）

| 页面 | 当前问题 | 建议呈现 | 优先级 |
| --- | --- | --- | --- |
| [会员与账号状态：从注册登录到受限恢复](https://knowledge001.netlify.app/articles/member-account-states)<br>`/articles/member-account-states` | 长文、表格与检查项较多，关键图解靠后，首屏没有完整关系总览。 页面带理解检查。 | 账号状态地图＋注册/登录/受限/恢复四屏示意；直接给出图解结论，长文作为可选参考。 | P1 |
| [钱包、支付与对账：从余额变化到差异处理](https://knowledge001.netlify.app/articles/wallet-payment-reconciliation)<br>`/articles/wallet-payment-reconciliation` | 长文、表格与检查项较多，关键图解靠后，首屏没有完整关系总览。 页面带理解检查。 | 支付、订单、钱包三泳道流程＋异常分支对照；直接给出图解结论，长文作为可选参考。 | P1 |
| [什么是包网？](https://knowledge001.netlify.app/articles/what-is-white-label)<br>`/articles/what-is-white-label` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 页面带理解检查。 | 现有包网结构图前置，增加前台/后台/服务的模块标注；直接给出图解结论，长文作为可选参考。 | P1 |
| [博彩平台是怎么运转的？](https://knowledge001.netlify.app/articles/how-gambling-platform-works)<br>`/articles/how-gambling-platform-works` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 | 复用平台生态图，明确会员、代理、厂商、支付与后台关系；直接给出图解结论，长文作为可选参考。 | P1 |
| [体育博彩平台是怎么运转的？](https://knowledge001.netlify.app/articles/sportsbook-basic)<br>`/articles/sportsbook-basic` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 | 体育链路全景图＋注单状态时间线；直接给出图解结论，长文作为可选参考。 | P1 |
| [会员、代理、平台三者是什么关系？](https://knowledge001.netlify.app/articles/member-agent-platform)<br>`/articles/member-agent-platform` | 主要以段落、表格和概念说明展开，缺少直观的首屏图解。 | 三角色关系图＋归属与数据流向标注；直接给出图解结论，长文作为可选参考。 | P1 |
| [中心钱包和免转钱包有什么区别？](https://knowledge001.netlify.app/articles/wallet-center-vs-seamless)<br>`/articles/wallet-center-vs-seamless` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 | 中心钱包与免转钱包左右对照图＋同一用户路径；直接给出图解结论，长文作为可选参考。 | P1 |
| [代理系统怎么设计？](https://knowledge001.netlify.app/articles/agent-system-design)<br>`/articles/agent-system-design` | 长文、表格与检查项较多，关键图解靠后，首屏没有完整关系总览。 页面带理解检查。 | 代理层级关系图＋规则版本时间线＋一笔结算示意；直接给出图解结论，长文作为可选参考。 | P1 |
| [运营和产品为什么要放在一起看？](https://knowledge001.netlify.app/articles/operation-product-conversion-model)<br>`/articles/operation-product-conversion-model` | 主要以段落、表格和概念说明展开，缺少直观的首屏图解。 页面带理解检查。 | 运营目标→页面承接→用户反馈→数据复盘闭环图；直接给出图解结论，长文作为可选参考。 | P1 |
| [首存、复存、返水、VIP 分别是什么？](https://knowledge001.netlify.app/articles/first-deposit-retention-vip)<br>`/articles/first-deposit-retention-vip` | 主要以段落、表格和概念说明展开，缺少直观的首屏图解。 | 四类活动用途/条件/状态的对照卡；直接给出图解结论，长文作为可选参考。 | P1 |
| [博彩后台一般有哪些模块？](https://knowledge001.netlify.app/articles/admin-modules)<br>`/articles/admin-modules` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 页面带理解检查。 | 复用现有后台功能地图，按角色和任务连接模块入口；直接给出图解结论，长文作为可选参考。 | P1 |
| [游戏厂商 API 如何对接？](https://knowledge001.netlify.app/articles/game-provider-api)<br>`/articles/game-provider-api` | 主要以段落、表格和概念说明展开，缺少直观的首屏图解。 | 平台↔厂商时序图，标出登录、余额、注单与结算；直接给出图解结论，长文作为可选参考。 | P1 |
| [博彩平台上线前检查清单](https://knowledge001.netlify.app/articles/launch-checklist)<br>`/articles/launch-checklist` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 页面带理解检查。 | 复用上线流程图，配一份完成示例；检查表只作可下载工具；直接给出图解结论，长文作为可选参考。 | P1 |
| [支付通道是什么？](https://knowledge001.netlify.app/articles/payment-channel-basic)<br>`/articles/payment-channel-basic` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 页面带理解检查。 | 复用支付流程图，展示订单、通知、审核和到账关系；直接给出图解结论，长文作为可选参考。 | P1 |
| [注单状态有哪些？](https://knowledge001.netlify.app/articles/bet-ticket-status)<br>`/articles/bet-ticket-status` | 主要以段落、表格和概念说明展开，缺少直观的首屏图解。 | 状态机＋每个关键状态对应的页面反馈小样；直接给出图解结论，长文作为可选参考。 | P1 |
| [复杂后台页面怎样安排信息层级？](https://knowledge001.netlify.app/articles/admin-information-hierarchy)<br>`/articles/admin-information-hierarchy` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 | 同一后台页面改前/改后对照，标出阅读顺序；直接给出图解结论，长文作为可选参考。 | P1 |
| [风控规则基础怎么理解？](https://knowledge001.netlify.app/articles/risk-rule-basic)<br>`/articles/risk-rule-basic` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 | 规则触发→限制→人工复核→恢复的分支图；直接给出图解结论，长文作为可选参考。 | P1 |
| [数据报表指标怎么看？](https://knowledge001.netlify.app/articles/data-report-metrics)<br>`/articles/data-report-metrics` | 主要以段落、表格和概念说明展开，缺少直观的首屏图解。 页面带理解检查。 | 一张报表样例，图上标出时间、币种、口径与明细关系；直接给出图解结论，长文作为可选参考。 | P1 |
| [社群运营治理 SOP 怎么写？](https://knowledge001.netlify.app/articles/community-operations-governance)<br>`/articles/community-operations-governance` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 | 复用现有SOP信息图，按事件→判断→处理→记录呈现；直接给出图解结论，长文作为可选参考。 | P1 |
| [渠道质量评估清单怎么做？](https://knowledge001.netlify.app/articles/channel-quality-review)<br>`/articles/channel-quality-review` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 | 复用现有渠道看板图，标出指标用途与相同口径对照；直接给出图解结论，长文作为可选参考。 | P1 |
| [活动规则风险评审怎么做？](https://knowledge001.netlify.app/articles/campaign-risk-review)<br>`/articles/campaign-risk-review` | 已有图片可用，但图片前后说明、章节或标题重复，图解没有成为主要阅读方式。 | 复用现有活动规则图，展示参与条件、奖励状态与异常回退；直接给出图解结论，长文作为可选参考。 | P1 |

### 模板与实用资料（10页）

| 页面 | 当前问题 | 建议呈现 | 优先级 |
| --- | --- | --- | --- |
| [模板库](https://knowledge001.netlify.app/templates)<br>`/templates` | 九张卡片主要说明类别、角色和场景，看不到拿来使用后的成品。 | 每个模板提供一份填好的缩略预览，突出复制/下载；按需求、规则、数据和复盘分类。 | P2 |
| [会员账号状态评审表](https://knowledge001.netlify.app/templates/member-account-review)<br>`/templates/member-account-review` | 字段清单与应用练习占主体，读者需要自行想象最终资料长什么样。 | 先展示账号状态→允许动作→页面反馈的已填示例；移除应用练习，保留复制与下载。 | P1 |
| [钱包支付与对账检查表](https://knowledge001.netlify.app/templates/wallet-reconciliation-checklist)<br>`/templates/wallet-reconciliation-checklist` | 字段清单与应用练习占主体，读者需要自行想象最终资料长什么样。 | 先展示订单/账本/通道对齐的核对示例；移除应用练习，保留复制与下载。 | P1 |
| [包网项目需求表](https://knowledge001.netlify.app/templates/white-label-requirement-form)<br>`/templates/white-label-requirement-form` | 在线填写15字段占据大量首段空间，后面又展示原模板与应用练习；成品不直观。 | 先展示一份清楚标注为示例的完整需求表及输出预览；移除应用练习，保留复制与下载。在线填写作为自愿使用的次入口。 | P1 |
| [活动系统 PRD 模板](https://knowledge001.netlify.app/templates/promotion-system-prd)<br>`/templates/promotion-system-prd` | 字段清单与应用练习占主体，读者需要自行想象最终资料长什么样。 | 先展示活动条件→奖励→状态→异常的示例PRD；移除应用练习，保留复制与下载。 | P1 |
| [代理系统 PRD 模板](https://knowledge001.netlify.app/templates/agent-system-prd)<br>`/templates/agent-system-prd` | 字段清单与应用练习占主体，读者需要自行想象最终资料长什么样。 | 先展示层级、归属、规则与结算的示例结构；移除应用练习，保留复制与下载。 | P1 |
| [上线检查清单](https://knowledge001.netlify.app/templates/launch-checklist)<br>`/templates/launch-checklist` | 字段清单与应用练习占主体，读者需要自行想象最终资料长什么样。 | 先展示按阶段排列的上线流程及示例记录；移除应用练习，保留复制与下载。 | P1 |
| [事故复盘模板](https://knowledge001.netlify.app/templates/incident-review)<br>`/templates/incident-review` | 字段清单与应用练习占主体，读者需要自行想象最终资料长什么样。 | 先展示时间线、影响、处理和改进的复盘示例；移除应用练习，保留复制与下载。 | P1 |
| [风控规则评审表](https://knowledge001.netlify.app/templates/risk-rule-review)<br>`/templates/risk-rule-review` | 字段清单与应用练习占主体，读者需要自行想象最终资料长什么样。 | 先展示触发条件、处置和恢复的规则示例；移除应用练习，保留复制与下载。 | P1 |
| [数据报表口径说明](https://knowledge001.netlify.app/templates/data-report-spec)<br>`/templates/data-report-spec` | 字段清单与应用练习占主体，读者需要自行想象最终资料长什么样。 | 先展示一张报表及字段口径标注；移除应用练习，保留复制与下载。 | P1 |

### 五个角色页（5页）

| 页面 | 当前问题 | 建议呈现 | 优先级 |
| --- | --- | --- | --- |
| [运营工作路径](https://knowledge001.netlify.app/roles/operation)<br>`/roles/operation` | 刚新增的五步任务路径、完成后应具备和交接要求仍偏培训，缺少直接可看的作品。 | 改成按角色聚合的作品与图解集合，展示活动页面、渠道看板、数据复盘图和规则图解；角色作为浏览筛选，不要求按顺序完成。 | P1 |
| [产品工作路径](https://knowledge001.netlify.app/roles/product)<br>`/roles/product` | 刚新增的五步任务路径、完成后应具备和交接要求仍偏培训，缺少直接可看的作品。 | 改成按角色聚合的作品与图解集合，展示会员、钱包、代理等功能地图、业务流程图和页面原型；角色作为浏览筛选，不要求按顺序完成。 | P1 |
| [交互工作路径](https://knowledge001.netlify.app/roles/interaction)<br>`/roles/interaction` | 刚新增的五步任务路径、完成后应具备和交接要求仍偏培训，缺少直接可看的作品。 | 改成按角色聚合的作品与图解集合，展示正常/异常流程、页面状态对照、移动端交互演示；角色作为浏览筛选，不要求按顺序完成。 | P1 |
| [设计工作路径](https://knowledge001.netlify.app/roles/design)<br>`/roles/design` | 刚新增的五步任务路径、完成后应具备和交接要求仍偏培训，缺少直接可看的作品。 | 改成按角色聚合的作品与图解集合，展示视觉成果、改版对照、组件系统和素材规范；角色作为浏览筛选，不要求按顺序完成。 | P1 |
| [开发工作路径](https://knowledge001.netlify.app/roles/development)<br>`/roles/development` | 刚新增的五步任务路径、完成后应具备和交接要求仍偏培训，缺少直接可看的作品。 | 改成按角色聚合的作品与图解集合，展示系统架构、接口链路、状态时序与可运行演示；角色作为浏览筛选，不要求按顺序完成。 | P1 |

## 4. 三个嵌入预览与404页

| 页面 | 判断与建议 |
| --- | --- |
| `/case-assets/admin-optimization/index.html` | 保留可操作原型与角色切换；外部旧版依赖网络和登录，入口旁简短说明即可。版本号、缓存刷新等调试信息收进辅助说明。 |
| `/case-assets/white-label-official/index.html` | 官网本身就是展示成果，优先让访客直接看到完整画面；减少外层重复包装。 |
| `/case-assets/material-standards/index.html` | 这是实用工具，查询、尺寸、页面预览与源稿入口值得保留；优化内外导航和手机视口，不套课程模板。 |
| `/404` | 保持简短，提供返回作品与搜索入口，帮助访客继续浏览。 |

## 5. 从五个角色看共同问题

| 角色视角 | 需要优化的重点 |
| --- | --- |
| 运营 | 把最值得分享的作品放在首页与列表封面；用真实成果说明价值，减少学习门槛和维护话术。 |
| 产品 | 每页明确一个主要用途：展示、图解、体验或取用资料；合并重复总览与角色路径。 |
| 交互 | 用户进入即获得完整结论；放大、切换、体验均为自愿探索，不需要答题或完成步骤才看懂全貌。 |
| 设计 | 用真实作品、场景画面和信息图建立视觉层级；减少连续相同白色文字卡，保持手机可读。 |
| 开发 | 共用组件统一移除教学包装；保留资源地址、原型功能、图片放大与下载能力，处理渲染告警和整页溢出。 |

## 6. 信息图制作规则

1. 一张图回答一个问题，包含一个核心结论与3—5个视觉节点；注释尽量一行说清。
2. 结构按内容选：关系用结构图、状态用时间线/状态图、做法用流程图、优化用改前改后对照、能力用实际界面标注。
3. 使用真实案例图片和现有原型；需要生成新图时，把长文重新提炼为图形关系与简短文案，避免把全文塞进图片。
4. 功能介绍可以用“输入→系统处理→页面反馈→输出”四步。例如钱包专题用订单、通道、账本三条轨道对齐状态变化。
5. AI成果先给最终成品，再用“参考输入→生成过程→成果应用”解释；聊天截图与提示词放在后面。
6. 390px手机宽度下直接读懂标题与核心结论；复杂长图分段，提供放大和原图入口。
7. 必要时用简短标签说明视觉提案、交互演示或实际截图。只呈现可见差异，不编造效率或转化提升数字。
8. 长文、字段定义和技术细节作为按需查阅资料。每页默认展示应能在数秒内回答“是什么、亮点在哪、能怎么体验”。

## 7. 额外发现的质量问题

这些是本轮当前构建的浏览器检查结果，应纳入后续修复，不能据此宣布全站渲染无告警。此前通过的案例刷新专项范围较窄。

- 11篇带图文章在两种宽度打开时均捕获React #418告警；页面会恢复显示。该现象须单独定位，不能将本轮案例页的刷新修复推广为所有图文页面都通过。
- `/sportsbook`在1440与390宽度存在整页横向溢出；手机单独复测的文档宽度为463px，超过390px视口。
- `/ai-workflows`曾在首轮手机扫描中被标记为横向溢出，单独复测时文档宽度为390px且无溢出，暂列为待复核现象。
- 两条AI成果详情的输出主图在手机懒加载前容器高度约24px，加载后约493px，未预留完整图高，需处理滚动加载时的布局稳定性。
- 18篇旧文章同时使用外层标题与正文一级标题，存在重复h1；另有14个页面缺少h1，需要随页面模板整理统一。
- 懒加载Mermaid图在滚动接近时才渲染，所以本轮“首张图片”指标不代表页面完全没有流程图；CSS原型也不以图片数量衡量。

### 图文页告警清单

- `/articles/admin-modules`
- `/articles/campaign-risk-review`
- `/articles/channel-quality-review`
- `/articles/community-operations-governance`
- `/articles/how-gambling-platform-works`
- `/articles/launch-checklist`
- `/articles/payment-channel-basic`
- `/articles/risk-rule-basic`
- `/articles/sportsbook-basic`
- `/articles/wallet-center-vs-seamless`
- `/articles/what-is-white-label`

## 8. 建议推进顺序

1. 先清理公开的作业、答题、课程完成模块；重排四个案例页，并让首页出现真实作品。设计评审页直接改成改前/改后图解。
2. 把两条AI工作流的输出成果放到首屏，调整列表封面；用简短信息图解释怎么生成。
3. 先把会员、钱包、代理三个长专题做成信息图样板，再推广到其他文章、栏目和角色聚合。现有可用信息图优先复用。
4. 模板先给成品示例，体育专题以已有演示为基础轻量优化；同时修复图文渲染告警和手机横向溢出。
5. 整理历史工作流入口、重复导航、标题层级和查询体验；完整检查放大、全屏、原图、复制和下载。

## 9. 本轮证据与边界

- 全量页面记录：`/tmp/showcase-audit/pages.json`，含85个HTML页面的170条桌面/手机记录。
- 代表页面截图：`/tmp/showcase-audit/`，已查看首页、AI列表、设计答题、体育技术接入、素材规范、代理专题和Figma页面截图。
- 外部请求在本地审查中阻断，未核验私有旧后台或外部业务能力；当前结论针对站内内容呈现与默认布局。
- 本报告没有生成新信息图，也没有修改或发布网站；逐页建议用于下一轮改版的具体范围。
