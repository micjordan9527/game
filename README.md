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
- Netlify 已关联 GitHub `main`，推送后自动构建发布到 `https://knowledge001.netlify.app/`。Actions 中的 Netlify `deploy` 任务作为手动备用，仍需要对应凭据。
- GitHub Pages 与 Netlify 的 canonical、sitemap 分别使用对应站点域名，不要混用。

发布前建议：

1. `npm ci`
2. `npm run check:content`
3. `npm run build`
4. `npm run check:browser` 验证81个站内页面的标题、无课程界面、首屏作品与手机布局，并检查原型、图片放大、搜索、角色筛选、可选模板草稿和复制导出。
5. `npm run dev` 预览关键页面。开发与生产构建共用 `.next`，构建前先停止自己启动的开发服务。

浏览器检查使用已安装的 Chromium 或 Chrome，路径可通过 `CHROMIUM_EXECUTABLE` 指定。脚本自动启动本地静态服务，不需要另开预览进程。`TEST_BASE_PATH=/game` 用于验证 Pages 构建；`HTML_CHUNK_DELAY_MS=30` 可模拟分段到达的 HTML。设置 `BASE_URL` 可验证已部署版本（先构建 `out` 作为页面清单），`REFRESH_ROUNDS` 控制每个案例、每种宽度的刷新次数。需要环境 HTTP 代理时显式提供 `BROWSER_PROXY`，保持系统 CA 信任与 TLS 验证。

每项可独立交付的改动先完成相关验证，再按当前授权推送并核对 Netlify 和 GitHub Actions 发布结果；区分“已提交”和“已上线”。
