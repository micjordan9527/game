# 包网知识库

面向产品、运营、设计、技术与项目协作的中文行业知识库。内容聚焦系统结构、业务流程、体验设计、风险治理与交付协作，不提供推广或规避合规的操作指引。

## 日常 AI 开发入口

日常任务从以下文件开始：

1. `AGENTS.md`
2. `docs/exec-plans/active/current.md`
3. `docs/00-project.md`
4. `docs/content-model.md`
5. `docs/workflows/gpt-to-codex.md`

旧交接资料、启动提示和恢复资料保存在 `docs/archive/`，日常任务无需读取。

## 运行与验证

```bash
npm install
npm run dev
npm run check:content
npm run build
```

## 部署规则

GitHub Actions 对 `main` 推送和 Pull Request 只运行验证。仅在用户明确要求部署时，才手动触发 `workflow_dispatch` 的 Netlify 发布流程。默认不部署。
