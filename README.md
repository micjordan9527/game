# betting-knowledge-site-handoff

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

## 验证与部署策略

**提交主分支后自动检查并发布 GitHub Pages。** 用户于 2026-10-23 要求将提交与发布绑定。

- 推送到 `main`：`.github/workflows/github-pages.yml` 自动检查内容、构建静态站，通过后发布到 `https://micjordan9527.github.io/game/`。检查或构建失败时不会发布。
- 备份和开发分支不发布；Pull Request 只验证。
- `.github/workflows/netlify-deploy.yml` 的 `verify` 继续对 `main` 和 Pull Request 做验证。
- GitHub Pages 同时保留 `workflow_dispatch`，用于必要时手动重新发布。
- Netlify：`.github/workflows/netlify-deploy.yml` 只在手动运行且分支是 `main` 时执行 `deploy`，缺少凭据会安全失败。
- GitHub Pages 与 Netlify 的 canonical、sitemap 分别使用对应站点域名，不要混用。

发布前建议：

1. `npm ci`
2. `npm run check:content`
3. `npm run build`
4. `npm run dev` 预览关键页面

每项可独立交付的改动先在本地完成相关验证，再提交并推送 `main`，检查 GitHub Actions 的发布结果；区分“已提交”和“已上线”。Netlify 仍需用户单独指定发布。
