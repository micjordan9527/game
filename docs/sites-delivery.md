# Sites 发布与源码同步

站点：https://baowang-knowledge.aurora-5448.chatgpt.site

Sites 项目身份与静态输出目录在 `.openai/hosting.json`。继续编辑前读取 Sites 当前访问范围、版本及最新仓库源码，避免从旧的本地副本覆盖线上修改。

## 发布前检查

```sh
npm run check:content
NEXT_PUBLIC_SITE_URL=https://baowang-knowledge.aurora-5448.chatgpt.site npm run build
CHECK_SCOPE=site-update npm run check:browser
```

`site-update` 在 1440/390 宽度检查重点页面、BM/U8 图片显示比例与阅读位置、官网三个模块定位、搜索往返和文章默认展开。默认完整浏览器检查也包含这些交互检查。浏览器使用环境已有的 Chromium；仅在依赖缺失或变更时安装依赖。

## 保存、发布与 GitHub

1. 修改前保留当前已发布的 Sites 版本及其源码提交，必要时另存源码备份。
2. 验收通过后，将相同源码推送到 Sites 的源代码仓库，打包对应 `out` 与托管清单，保存并发布。保持当前访问范围。
3. Sites 发布成功后，把交付的源码修改提交到 `micjordan9527/game` 的 `main`。先读取远端分支状态，保留其他修改。
4. 报告实际 Sites 发布状态、站点链接及 GitHub 提交链接。GitHub 的自动检查结果与 Sites 发布结果分别确认。

GitHub Pages 与 Netlify 保留各自已有的构建域名配置；Sites 构建显式设置上述 `NEXT_PUBLIC_SITE_URL`。

## 本批修改前的恢复点

- 保存版本：v1
- 版本 ID：`appgprj_6addc756f42c81918d005093dc65171c~appgver_1331b82ac2e881918f7e8d34dbb18f6c`
- 源码提交：`00a795416669586b6af917e759aa6241af9801f7`

恢复站点时部署这一已有的归档版本即可，不要创建新站点或更改访问范围。此恢复点保留在 Sites 版本历史中。
