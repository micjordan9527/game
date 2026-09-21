# 内容模型

结构化数据集中在 `src/data`，Markdown 正文集中在 `content/articles`。同一个事实只保留一个权威来源，避免重复维护。

## 核心数据

- **Categories**：`src/data/categories.ts` 定义栏目 slug、标题与说明。
- **Articles metadata + Markdown**：`src/data/articles.ts` 定义文章元数据；`content/articles/{slug}.md` 保存对应正文。两者的 slug、标题和关联信息必须保持一致。
- **Glossary**：`src/data/glossary.ts` 定义术语、解释与关联内容。
- **Templates**：`src/data/templates.ts` 定义模板字段、适用场景与关联文章、术语。
- **Cases**：`src/data/cases.ts` 定义案例索引与展示信息。
- **Topic Guides**：`src/data/topicGuides.ts` 组织栏目学习顺序、受众、模块、术语和模板引用。
- **Learning Checks**：`src/data/learningChecks.ts` 定义栏目学习检查题与反馈。

## 专题内容

- **Design Topics / tools / prototypes**：`src/components/design` 提供设计体验主题、工具和交互原型；路由在 `src/app/design/[topic]`。
- **AI Workflows**：`src/data/aiWorkflows.ts` 与 `src/data/aiWorkflowLibrary.ts` 定义工作流、案例和输出信息；路由在 `src/app/ai-workflows`。
- **Sports**：`src/data/sports.ts` 与 `src/data/sportsGuides.ts` 定义体育专题、角色路径和文章组织；路由在 `src/app/sports`。

## 关联规则

- slug 与 id 是稳定标识，不要为了文案调整而改名。
- 文章元数据是文章索引的权威来源，Markdown 是正文权威来源。
- 不要在多个文件复制同一组栏目、文章或专题定义。
- 修改 slug、id、文章、术语、模板或专题关联前，先搜索所有引用并同步更新。
- 内容、数据或图片改动后运行 `npm run check:content`。
