# KB-INFRA-001: 重构 GPT → Codex 上下文架构

## Task Definition

执行任务 KB-INFRA-001：重构本项目 GPT → Codex 上下文架构。

目标：
建立“GPT 负责分析，current.md 负责交接，Codex 负责执行”的轻量开发流程，让日常 Codex 默认只读取 AGENTS.md、current.md 和任务 Scope 文件，不再默认读取历史交接资料。

允许修改：

- AGENTS.md
- README.md

新增：

- docs/00-project.md
- docs/content-model.md
- docs/workflows/gpt-to-codex.md
- docs/exec-plans/active/current.md
- docs/exec-plans/completed/

归档移动：

- codex-handoff.md → docs/archive/codex-handoff-v1.md
- prompts/ → docs/archive/bootstrap-prompts/
- codex-context/ → docs/archive/codex-recovery/

要求：

1. AGENTS.md
   升级为长期 Codex 工作规则，至少包含：

- 项目：Next.js / React / TypeScript / Tailwind 中文知识库
- 默认流程：AGENTS → current.md → Scope 文件 → 修改 → 验证 → Execution Result
- Context 分三级加载，不默认扫描整个仓库
- docs/archive 默认禁止作为日常上下文
- 修改小而准、不重构无关代码、不随意新增依赖
- 保留公开页面禁止内部规划措辞规则
- 默认验证 npm run check:content 和 npm run build
- 未明确要求不得部署
- 完成后只填写 current.md 的 Execution Result，不修改已批准任务定义

2. docs/00-project.md
   建立当前项目地图，只写当前事实：

- 项目定位
- 当前技术栈
- 主要路由
- src/app、components、data、lib、content、public、scripts、docs 的职责
- 运行命令
- 部署规则
- 当前已进入持续内容扩展、IA 优化、设计工具和 AI Workflow 阶段
  不要再写“第一阶段搭站”。

3. docs/content-model.md
   说明当前知识数据在哪里维护及关系：

- Categories
- Articles metadata + Markdown
- Glossary
- Templates
- Cases
- Topic Guides
- Learning Checks
- Design Topics / tools / prototypes
- AI Workflows
- Sports
  说明 slug/id 稳定、避免重复 source of truth、修改关联前检查引用。

4. docs/workflows/gpt-to-codex.md
   写明标准流程：
   GPT Chat 分析
   → 最终 Decision
   → 写 current.md
   → Codex 执行
   → GPT Review
   → completed 归档

其中明确：
不要把完整聊天、废弃方案和长篇推理写入 current.md。

5. README.md
   移除过时的：

- 默认读取 codex-handoff.md
- 默认读取 prompts/05-first-codex-task.md
- 第一阶段搭站说明

改为说明日常 AI 开发入口：

- AGENTS.md
- docs/exec-plans/active/current.md
- docs/00-project.md
- docs/content-model.md
- docs/workflows/gpt-to-codex.md

旧资料保存在 docs/archive/，日常无需读取。

限制：

- 不修改 src/
- 不修改 content/articles/
- 不修改 public/
- 不修改 scripts/
- 不修改 package.json
- 不修改 .github/
- 不修改网站 UI 或业务逻辑
- 不升级依赖
- 不改变部署策略
- 不部署

验证：
npm run check:content
npm run build

完成后汇报：

1. Files Changed
2. Files Added
3. Files Moved
4. Summary
5. Verification
6. Remaining Issues

不要部署。

## Execution Result

Files Changed

- AGENTS.md
- README.md

Files Added

- docs/00-project.md
- docs/content-model.md
- docs/workflows/gpt-to-codex.md
- docs/exec-plans/active/current.md
- docs/exec-plans/completed/

Files Moved

- codex-handoff.md -> docs/archive/codex-handoff-v1.md
- prompts/ -> docs/archive/bootstrap-prompts/
- codex-context/ -> docs/archive/codex-recovery/

Summary

- Established the AGENTS -> current.md -> Scope -> change -> verify -> Execution Result workflow.
- Added the project map, content model, and GPT-to-Codex handoff workflow.
- Removed obsolete daily AI entry points from README and placed legacy materials under docs/archive.

Verification

- npm run check:content: passed.
- npm run build: passed.
- Deployment: not performed.

Remaining Issues

- None. Current plan remains active until GPT review and completed-plan archival.
