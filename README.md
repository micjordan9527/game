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

**推送代码不等于发布网站。** 所有正式发布都需要主动通过 GitHub Actions 手动触发。

- 推送到 `main` 或提交 Pull Request：触发 `.github/workflows/netlify-deploy.yml` 的 `verify`，只检查内容和构建，不发布。
- GitHub Pages：`.github/workflows/github-pages.yml` 只接受 `workflow_dispatch` 手动运行，构建并发布到 `/game`。
- Netlify：`.github/workflows/netlify-deploy.yml` 只在手动运行且分支是 `main` 时执行 `deploy`，缺少凭据会安全失败。
- GitHub Pages 与 Netlify 的 canonical、sitemap 分别使用对应站点域名，不要混用。

发布前建议：

1. `npm ci`
2. `npm run check:content`
3. `npm run build`
4. `npm run dev` 预览关键页面

只有用户明确要求“部署”时，才发起发布。
