# GPT 到 Codex 工作流

## 标准流程

1. **GPT Chat 分析**：梳理问题、现状、风险和候选方案。
2. **最终 Decision**：确认目标、范围、约束、验收方式和不做事项。
3. **写入 current.md**：把批准后的任务定义、Scope 文件和验收要求写入 `docs/exec-plans/active/current.md`。
4. **Codex 执行**：Codex 只读取 `AGENTS.md`、`current.md` 和任务明确列出的 Scope 文件，按范围实施并验证。
5. **GPT Review**：复核执行结果、质量与下一步决策。
6. **completed 归档**：任务完成并确认后，将执行计划移入 `docs/exec-plans/completed/`。

## current.md 写作规则

`current.md` 是面向执行的简短交接文件，应包含：目标、允许与禁止范围、Scope 文件、验收标准和 `Execution Result`。

不要把完整聊天记录、废弃方案、长篇推理或未经批准的候选方向写入 `current.md`。这些内容留在 GPT Chat；只有最终决定进入执行计划。

## Codex 完成规则

Codex 不改写已批准的任务定义。完成后只填写 `Execution Result`，记录改动、验证、未解决问题与是否部署；未明确要求时不部署。
