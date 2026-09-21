# KB-DESIGN-002：优化 `/design` 首页知识架构

## Task Definition

先做归档：

1. 将当前已完成的 T01：`docs/exec-plans/active/current.md` 复制/保存为：`docs/exec-plans/completed/KB-INFRA-001.md`
2. 然后用本任务内容替换：`docs/exec-plans/active/current.md`
3. 执行 T02
4. 完成后只填写 current.md 的 Execution Result
5. 不部署

## 目标

把 `/design` 从普通“栏目内容展示页”优化成任务导向的 Design Knowledge Hub，让用户先根据“我要学习 / 我要评审页面 / 我要找案例资源”进入，再浏览四大核心专题。

本次只优化 `/design` 首页信息架构，不深度重构 `/design/[topic]`。

## 允许范围

允许修改：

- `src/app/[category]/page.tsx`
- `src/components/design/DesignExperienceHub.tsx`

允许按需新增：

- `src/components/design/DesignEntryActions.tsx`
- 与 `/design` 首页 IA 直接相关的小型展示组件

如确有必要可读取但尽量不要修改：

- `src/data/topicGuides.ts`
- `src/data/learningChecks.ts`
- `src/data/articles.ts`
- `src/data/templates.ts`
- `src/data/glossary.ts`

不要修改：

- `src/app/design/[topic]/page.tsx`
- 现有 Design 互动工具 / Prototype 功能
- `src/data/topicGuides.ts` 的结构
- `src/data/learningChecks.ts` 的结构
- 其它栏目页面
- 全站导航
- 搜索
- AI Workflow
- 业务文章内容
- 依赖
- 部署配置

## 页面最终 IA

1. Design Hero

- 保留“设计体验”定位
- 表达从复杂后台、关键页面、移动端状态到评审交付
- 保留适用人群
- “读完你会理解”精简为 3 个结果：
  - 如何判断复杂页面的问题
  - 如何选择合适的信息与组件
  - 如何把设计判断转成可交付方案

2. 新增「你今天要解决什么？」

做 3 个任务入口卡片：

- 系统学习：从信息层级 → 页面设计 → 移动反馈 → 评审交付逐步学习；CTA：开始学习；目标位置：当前页学习路径或核心专题区域。
- 页面评审：从信息、操作、状态、异常、权限等角度检查页面；CTA：开始评审；链接到 `/design/information`。
- 案例与资源：查看后台、钱包、风控、注单、移动端等原型与案例；CTA：查看案例；链接到 `/design/prototypes`。

3. 四大核心专题

保留现有 4 个 Topic 和路由：

- 01 看得懂 / 信息层级与组件
- 02 会操作 / 关键页面原型
- 03 用得顺 / 移动端与状态反馈
- 04 能交付 / 评审与交付

明确它们是“核心设计能力 / 知识地图”，而不是第二套课程。

4. Course Path 降级

原 Course Path 保留，定位为「推荐学习路径」，只表达推荐学习顺序，不与四大 Topic 视觉竞争，推荐理解为：基础 → 实战 → 交付。不要删除原有学习数据。

5. Learning Check 后移

移到核心专题 / 推荐学习路径之后，对外标题建议为「检查一下你的理解」。不修改业务逻辑或数据模型。

6. Category Visual 降级

保留现有专题图解内容，但放在核心专题之后，顺序为：核心专题 → 推荐学习路径 → 专题图解 → 理解检查。不要重做 Category Visual 功能。

7. 文章模块

只对 design 栏目将“栏目文章”改为「设计方法文章」，描述体现文章用于理解设计原则、方法和判断方式，不影响其它 category。

8. 术语 / 模板

继续放页面后部，整体语义可弱化成「相关资料」，内部仍保留关键术语和相关模板，不修改数据关系。

推荐最终顺序：

Design Hero → 你今天要解决什么？ → 核心设计能力（4 Topics） → 推荐学习路径 → 专题图解 → 检查一下你的理解 → 设计方法文章 → 相关资料（术语 / 模板）

## 实现原则

- 只对 `categorySlug === "design"` 做特殊 IA。
- 其它 category 页面行为必须保持不变。
- 优先复用现有 `SectionHeader`、卡片风格、Tailwind 规范。
- 不引入新依赖，不大范围重构通用 CategoryPage。
- 不复制 Design Topic 数据到新的第三个 source of truth。
- 不处理 Topic 数据双维护问题，该问题留给 T03。

## 验收标准

1. `/design` 第一屏后能够快速看到 3 个任务入口。
2. 用户可以明确区分任务入口、四大核心专题、推荐学习路径。
3. 四大 Topic 路由全部保持可访问。
4. Learning Check 不再出现在页面最前部。
5. Design 的文章区标题变为“设计方法文章”。
6. 其它 category 页面结构和标题不受影响。
7. 不修改 `/design/[topic]`。
8. 移动端布局正常。
9. 无新增依赖。
10. 不出现内部规划 / 第一阶段 / 后续扩展等公开文案。

## 验证

- `npm run check:content`
- `npm run build`

## Execution Result

## Files Changed

- src/app/[category]/page.tsx
- src/components/design/DesignExperienceHub.tsx
- src/components/category/CoursePathSection.tsx
- docs/exec-plans/active/current.md（仅填写 Execution Result）

## Files Added

- src/components/design/DesignEntryActions.tsx

## Summary

- /design 首页新增“你今天要解决什么？”三项任务入口，并保留四个 Topic 路由。
- Design 首页调整为核心设计能力 → 推荐学习路径 → 专题图解 → 理解检查 → 设计方法文章 → 相关资料的顺序。
- Design Hero 精简为三个学习结果；学习路径降级为推荐顺序；学习检查改为“检查一下你的理解”。
- 其它 category 保持原有学习检查、栏目文章标题和页面行为。
- 已先将 KB-INFRA-001 当前任务归档到 docs/exec-plans/completed/KB-INFRA-001.md；未修改 Topic 数据、Topic 详情页、互动工具、依赖或部署配置。

## Verification

- npm run check:content：通过（19 articles、7 templates、4 cases、48 images）。
- npm run build：通过（静态页面生成 78/78）。
- 本地路由检查：/design、/design/information、/design/prototypes、/design/mobile、/design/review、/industry 均返回 HTTP 200。
- 未部署。

## Remaining Issues

- 无。Topic 数据双维护问题按任务要求留给 T03。

