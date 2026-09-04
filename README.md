# betting-knowledge-site-handoff

这是给 Codex 使用的交接包，用于搭建“博彩 / 体育 / 包网行业科普知识站”。

## 建议使用方式

把整个文件夹放到项目根目录，或者把 ZIP 解压后上传到 Codex 工作区。

然后在 Codex 输入：

```txt
请先阅读 codex-handoff.md、prompts/05-first-codex-task.md、src/data/*.ts 和 content/articles/what-is-white-label.md，然后按第一阶段任务搭建网站基础版本。
```

## 文件说明

- `codex-handoff.md`：完整项目交接说明
- `prompts/`：分阶段给 Codex 的指令
- `src/data/`：可直接用于项目的 mock 数据
- `content/articles/`：首篇文章内容
- `docs/`：文章模板、Mermaid 图库、GPT Image 提示词库

## 注意

该项目定位是行业科普和专业知识库，不是赌博推广站。

## 部署策略（手动触发）

本仓库 Netlify CI 采用“验证与发布分离”策略：

- `push` 到 `main` 会触发 `verify` 流程：内容检查 + 构建（不会发布）。
- `pull_request` 会触发 `verify` 流程：内容检查 + 构建（不会发布）。
- 只有通过 GitHub Actions 的 `workflow_dispatch`（手动触发）且分支为 `main`，才会执行 `deploy` 步骤，向 Netlify 发布。

对应文件：`.github/workflows/netlify-deploy.yml`

为了避免误操作，默认规则是：**只有用户明确说“部署”才发起上线发布**。

发布前建议顺序：

1. `npm run check:content`
2. `npm run build`
3. 本地通过 `npm run dev` 做关键页核验
