export const requirementExample = [
  "REQ-DEMO-001 · 虚构工单查询需求",
  "R1：支持编号或标题查询，去除首尾空格，不区分大小写。",
  "R2：状态为全部、待处理、已关闭；按更新时间正序或倒序。",
  "R3：修改条件后点击查询才生效，成功时一起更新条件、数量和列表，新查询回到第一页；每页3条。",
  "R4：查询失败保留上次成功结果，并明确它不属于新输入；无匹配显示0条并提供清空条件。",
  "R5：详情返回保留条件、排序、页码、原记录、阅读位置与键盘焦点。",
  "D1：本页界面对照沿用本站列表的8条虚构工单，其中3条已关闭；数量只是示例数据，不是通用需求规则。",
  "未约定：跨页全选、刷新后保存、权限失效后的缓存处理。",
].join("\n")

export const matrixFields = [
  { id: "F1", name: "编号或标题", rule: "文本；去首尾空格；不区分大小写", source: "R1" },
  { id: "F2", name: "记录状态", rule: "全部／待处理／已关闭", source: "R2" },
  { id: "F3", name: "排序", rule: "更新时间正序／倒序", source: "R2" },
  { id: "F4", name: "已应用条件", rule: "最近一次成功查询的条件，与输入分开保存", source: "R3、R4" },
  { id: "F5", name: "分页与返回位置", rule: "每页3条，新查询第一页；详情返回恢复原位置", source: "R3、R5" },
]
export const matrixStates = [
  { id: "S1", state: "编辑条件", trigger: "输入已修改但未查询", screen: "旧结果继续标明旧条件", action: "提交查询", source: "R3" },
  { id: "S2", state: "查询成功", trigger: "收到可信成功结果", screen: "条件、数量、列表一起更新，新查询回第一页", action: "查看详情、翻页", source: "R3" },
  { id: "S3", state: "没有匹配", trigger: "查询成功且为0条", screen: "说明没有匹配，显示当前条件", action: "修改或清空条件", source: "R4" },
  { id: "S4", state: "查询失败", trigger: "本次未取得可信结果", screen: "保留并标明上次成功结果，不能改写成0条", action: "重试当前条件", source: "R4" },
  { id: "S5", state: "详情返回", trigger: "关闭当前记录详情", screen: "恢复条件、排序、页码、位置与焦点", action: "继续处理原列表", source: "R5" },
  { id: "S6", state: "查询中", trigger: "已发请求、尚无结果", screen: "加载提示、旧数据与重复请求规则需确认", action: "等待；是否取消待确认", source: "待确认；不从R3自行补全" },
]
export const requirementQuestions = ["查询中是否允许再次查询、打开详情或取消？", "权限失效后怎样清除受保护的缓存结果？", "是否支持跨页选择和刷新后恢复？", "详情操作导致记录不再匹配时怎样回退？"]

export const screenshotExample = [
  "MAT-DEMO-001 · 本知识库后台演示的充值记录截图，非生产数据。",
  "来源：/case-assets/admin-optimization/index.html#version=optimized&page=finance-fundsRecords-depositRecord",
  "E1：列表上方有会员ID、会员昵称、会员账号、订单号和渠道订单号筛选。",
  "E2：每行右侧可见“详情”和“查看记录”。",
  "E3：页面右上方可见“导出记录”。",
  "只根据截图写说明；接口行为、权限、加载性能和改版效果均未由此图验证。",
].join("\n")
export const screenshotClaims = [
  { id: "C1", evidence: "E1", kind: "可见事实", text: "充值记录页把对象与业务编号筛选放在列表上方。" },
  { id: "C2", evidence: "E2", kind: "可见事实", text: "每行右侧提供详情和查看记录入口。" },
  { id: "C3", evidence: "E3", kind: "可见事实", text: "页面右上方显示导出记录按钮。" },
  { id: "C4", evidence: "E1、E2", kind: "设计解释", text: "这种布局将查找对象与进入明细的路径放在相邻区域，可据此讨论信息分层。" },
  { id: "C5", evidence: "缺少实际角色与请求证据", kind: "待验证", text: "不同角色是否只能导出授权范围内的数据。" },
  { id: "C6", evidence: "缺少前后对照数据", kind: "待验证", text: "是否减少操作时间、错误或提升转化。" },
]
export const screenshotCaseText = "材料：MAT-DEMO-001，本地后台演示截图，非生产记录。\n页面任务：查找充值记录并进入明细。\n可见结构：对象与业务编号筛选位于列表上方（E1）；每行右侧提供详情和查看记录入口（E2）；右上方显示导出按钮（E3）。\n设计解释：可据此讨论查找、列表识别与明细追溯的分层，属于材料解读。\n待验证：实际权限、请求结果、下载范围、响应时间及改版效果；截图不能证明这些结论。"

export function practicalPrompt(slug: string, input: string) {
  const instruction = slug === "requirements-state-matrix"
    ? "把下面需求整理为字段表与状态矩阵。每行标注需求来源R编号；字段包含名称、值域、触发条件与规则；状态包含触发、界面反馈、允许动作、异常与验收观察点。明确区分原文已说明和待确认；不得擅自补出权限、时限、持久化或取消规则。最后列出需要产品、设计与开发确认的问题。"
    : "根据以下截图材料写案例说明。先编号列出可见事实E1/E2/E3，再写页面任务、信息结构、设计解释和待验证事项。每个事实关联证据编号；将推断单独标注。截图看不到的权限、接口、性能、历史改版过程和效果数据均写待验证，不编造指标。实际提交给GPT时还需附上经过脱敏并获准使用的原截图。"
  return instruction + "\n\n输入材料：\n" + input + "\n\n输出为可复核草稿，等待人工逐项核对来源、遗漏和边界。"
}
export function matrixExampleText() {
  return ["REQ-DEMO-001 · 预置示例输出，非实时AI生成", "", "字段：", ...matrixFields.map((x) => `${x.id} ${x.name}：${x.rule}（${x.source}）`), "", "状态：", ...matrixStates.map((x) => `${x.id} ${x.state}｜${x.trigger}｜${x.screen}｜${x.action}｜来源：${x.source}`), "", "待确认：", ...requirementQuestions.map((x) => "- " + x)].join("\n")
}
