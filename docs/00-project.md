# 项目地图

## 项目定位

包网知识库是一个中文行业知识站，帮助产品、运营、设计、技术和项目协作角色理解平台结构、业务流程、体验设计、风险治理与交付协作。

项目当前处于持续内容扩展、信息架构优化、设计工具和 AI Workflow 建设阶段。

## 技术栈

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Markdown 内容与 Mermaid 图表
- Netlify Next.js 插件

## 主要路由

- `/`：首页
- `/[category]`：栏目页
- `/articles`、`/articles/[slug]`：文章库与文章详情
- `/glossary`：术语表
- `/templates`、`/templates/[slug]`：模板库与模板详情
- `/cases`：案例页
- `/design/[topic]`：设计体验专题与工具
- `/sports`、`/sports/[slug]`：体育知识与体验专题
- `/ai-workflows`、`/ai-workflows/[slug]`：AI Workflow 内容与案例
- `/search`：站内搜索

## 目录职责

- `src/app`：App Router 路由、页面与元数据。
- `src/components`：可复用页面模块、内容组件与交互工具。
- `src/data`：栏目、文章索引、术语、模板、案例、学习路径和专题的结构化数据。
- `src/lib`：内容读取、站点查询、SEO 与资源路径等共用逻辑。
- `content`：Markdown 正文内容。
- `public`：站点静态资源与文章图片。
- `scripts`：内容完整性校验脚本。
- `docs`：项目说明、内容模型、工作流、执行计划与归档资料。

## 运行命令

```bash
npm install
npm run dev
npm run check:content
npm run build
```

## 部署规则

默认只验证，不部署。`main` 推送和 Pull Request 运行内容检查与构建；只有用户明确要求时，才通过 GitHub Actions 的手动触发流程发布到 Netlify。
