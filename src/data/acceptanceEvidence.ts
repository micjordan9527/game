// Native GitHub run metadata read on 2026-10-28. Historical v26 evidence only.
export const historicalChecks = [
  { id: 40649724780, name: "根路径自动检查", workflow: "Verify CI + Manual Netlify Deploy", status: "completed", conclusion: "success", headSha: "aa1370b68a3944fcadd5cbc138746a5c3a667890", startedAt: "2026-10-28T07:23:09Z", updatedAt: "2026-10-28T07:41:03Z", href: "https://github.com/micjordan9527/game/actions/runs/40649724780" },
  { id: 40649724901, name: "/game 自动检查与Pages发布", workflow: "Verify and Deploy GitHub Pages", status: "completed", conclusion: "success", headSha: "aa1370b68a3944fcadd5cbc138746a5c3a667890", startedAt: "2026-10-28T07:23:09Z", updatedAt: "2026-10-28T07:42:07Z", href: "https://github.com/micjordan9527/game/actions/runs/40649724901" },
]
export const acceptanceExamples = [
  { id: "missing", title: "缺少实测记录", requirement: "PUB-SCOPE-01 · 中文发布只影响目标站点和语言", build: "待填写待验版本", environment: "待填写站点、角色、时间和视口", expected: "发布站点A中文v4后，其他语言和站点不被自动覆盖。", observed: "未执行；实际结果与证据待填写。", conclusion: "未验证", evidence: [{ title: "公告演示：用于理解操作路径", href: "/articles/content-publication-versions#publication-demo" }], boundary: "演示入口提供说明，不是待验项目的执行证据。缺少版本、范围、实际结果或记录时，不能写通过。" },
  { id: "historical", title: "v26已完成的历史检查", requirement: "知识库对应提交的静态构建与自动浏览器检查", build: "v26 · GitHub aa1370b68a3944fcadd5cbc138746a5c3a667890", environment: "仓库CI；根路径与/game工作流；检查配置见对应提交的工作流文件", expected: "对应v26提交的两条工作流成功完成。", observed: "两条工作流的原生状态均为completed，结论为success，提交号与v26交付记录一致。", conclusion: "历史检查成功", evidence: historicalChecks.map((x) => ({ title: x.name + " · run " + x.id, href: x.href })), boundary: "只支持v26对应范围的历史结论，不能证明新版本或真实平台的支付、权限、审批与生产运行。根路径工作流的Netlify部署是手动步骤，push成功不表示已部署Netlify。" },
  { id: "screenshot", title: "只有按钮截图", requirement: "只有授权角色可导出目标范围的数据", build: "现有本地后台演示材料；服务端版本未知", environment: "截图缺少真实账号授权、请求与下载记录", expected: "允许与拒绝路径都按角色、站点和数据范围执行。", observed: "截图中可见导出记录按钮，未取得实际服务端授权和下载结果。", conclusion: "不能判断", evidence: [{ title: "后台截图与角色导览", href: "/cases/admin-optimization#admin-role-tour" }, { title: "截图证据工作流", href: "/ai-workflows/screenshot-case-description" }], boundary: "入口可见与服务端允许执行是两件事。不能把按钮截图写成权限隔离通过。" },
]
export function acceptanceExampleText(index: number) {
  const x = acceptanceExamples[index] ?? acceptanceExamples[0]
  return ["# 验收证据对照 · " + x.title, "性质：说明示例或已标明版本的历史证据，不是当前项目上线批准。", "需求：" + x.requirement, "版本：" + x.build, "环境与范围：" + x.environment, "预期：" + x.expected, "实际：" + x.observed, "结论：" + x.conclusion, "证据：", ...x.evidence.map((e) => `- ${e.title}：${e.href}`), "边界：" + x.boundary].join("\n\n")
}
