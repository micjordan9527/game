# Codex 交接包：博彩 / 体育 / 包网行业科普知识站

## 项目定位

这是一个对外可访问的中文科普知识网站，内容方向包括博彩行业、体育博彩、包网、运营、产品、设计、开发、运维、风控、后台系统、代理体系、支付、钱包、游戏厂商、活动系统和数据报表。

网站不是赌博推广站，不引导用户充值下注，不写“稳赚”“暴利”“带人下注”等内容。

网站定位：

> 用白话解释 + 专业拆解 + 图解表达 + 模板沉淀的方式，把博彩、体育、包网行业知识做成一个外行能看懂、内行觉得专业的网站。

## 第一阶段目标

请先搭建一个可以运行的中文科普知识站基础版本。

必须完成：

1. 搭建或适配 Next.js + TypeScript + Tailwind CSS 项目结构。
2. 实现首页。
3. 实现栏目页。
4. 实现术语库页。
5. 实现模板库页。
6. 实现文章详情页。
7. 使用 mock 数据展示内容。
8. 实现基础响应式布局。
9. 实现 Header 和 Footer。
10. 实现文章卡片、术语卡片、模板卡片。
11. 术语库支持关键词搜索。
12. 模板库支持分类展示。
13. 文章详情页支持 Markdown / MDX 内容展示。
14. Mermaid 流程图可以先用静态代码块展示，后续再增强渲染。
15. 页面整体风格要专业、清爽、适合中文阅读。

暂时不需要：

- 登录注册
- 后台 CMS
- 数据库
- 用户评论
- 支付
- 下载功能
- 多语言
- 真正的图片生成
- 复杂权限系统

## 推荐技术栈

- Next.js
- TypeScript
- Tailwind CSS
- MDX 或 Markdown 内容管理
- shadcn/ui 风格组件
- Mermaid 流程图支持
- 静态数据优先，不需要先接 CMS

如果当前项目已有技术栈，请优先兼容现有项目。

## 视觉风格

- 中文 SaaS 官网风格
- 专业
- 干净
- 信息层级清晰
- 适合长文阅读
- 适合移动端
- 不要像赌博推广站
- 不要用太花哨、夜店、赌场、金色筹码堆满屏的视觉
- 更偏知识库、产品文档、咨询报告、行业白皮书风格

## 内容边界

不要提供：

- 如何规避监管
- 如何绕过风控
- 如何洗钱
- 如何攻击平台
- 如何作弊套利
- 如何诱导用户下注
- 如何欺诈用户

可以提供：

- 风险识别
- 合规提醒
- 权限控制
- 异常监控
- 平台稳定性
- 业务流程说明
- 产品结构说明
- 运营方法分析
- 用户体验优化
- 技术架构科普

## 页面结构

```txt
/
首页

/industry
行业入门

/sportsbook
体育博彩

/white-label
包网科普

/product
产品设计

/operation
运营增长

/design
设计体验

/development
技术开发

/devops-risk
运维风控

/glossary
术语库

/templates
模板库

/articles/[slug]
文章详情页
```

## 首页文案

Hero 标题：

```txt
用产品、运营、设计、技术视角，看懂博彩与体育平台
```

Hero 副标题：

```txt
系统拆解博彩、体育博彩、包网平台从业务模式到系统架构的完整链路，让复杂行业变得更容易理解。
```

按钮：

```txt
开始阅读
查看术语库
```

项目介绍：

```txt
博彩和体育平台并不只是一个前台页面，它背后包含会员系统、钱包系统、游戏厂商、支付通道、代理体系、活动运营、数据报表、风控规则和运维监控。

本站希望用更容易理解的方式，把这些复杂内容拆成清晰的知识模块，让读者能够从业务、产品、设计、开发和运营多个角度理解平台如何运转。
```

## 建议组件

```txt
layout/
  Header
  Footer
  MobileNav

home/
  HeroSection
  CategoryGrid
  FeaturedArticles
  GlossaryPreview
  TemplatePreview

article/
  ArticleHero
  DefinitionCard
  WarningBox
  ExampleBox
  FAQBlock
  ImagePromptBlock
  RelatedArticles

common/
  CategoryCard
  CompareTable
  Checklist
  ProcessFlow
  Tag
  Badge
  SectionHeader

glossary/
  GlossaryItem
  GlossarySearch
  GlossaryCategoryFilter

templates/
  TemplateCard
  TemplateDetail
```

## 推荐文件结构

```txt
src/
  app/
    page.tsx
    industry/page.tsx
    sportsbook/page.tsx
    white-label/page.tsx
    product/page.tsx
    operation/page.tsx
    design/page.tsx
    development/page.tsx
    devops-risk/page.tsx
    glossary/page.tsx
    templates/page.tsx
    articles/[slug]/page.tsx

  components/
    layout/
    home/
    article/
    common/
    glossary/
    templates/

  data/
    categories.ts
    glossary.ts
    templates.ts
    articles.ts
    featuredArticles.ts

  lib/
    utils.ts
    mdx.ts

content/
  articles/
    what-is-white-label.md

docs/
  image-prompts.md
  mermaid-library.md
  article-template.md

prompts/
  01-project-positioning.md
  02-site-structure.md
  03-components.md
  04-data-models.md
  05-first-codex-task.md
```

## Codex 执行方式

请先阅读：

1. `codex-handoff.md`
2. `prompts/05-first-codex-task.md`
3. `src/data/*.ts`
4. `content/articles/what-is-white-label.md`

然后按第一阶段任务开始实现。
