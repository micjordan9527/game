export type CaseReadingGuideData = {
  title: string
  material: string
  steps: { title: string; where: string; observation: string; boundary: string; href: string; linkLabel: string }[]
}

export const caseReadingGuides: Record<string, CaseReadingGuideData> = {
  "admin-optimization": {
    title: "后台：从角色看板读到记录证据",
    material: "本地交互演示与9张步骤截图。数字和业务记录为示例；角色切换用于说明展示任务。",
    steps: [
      { title: "确认角色与统计范围", where: "交互演示 · 数据中台 · 角色切换", observation: "老板、运营、财务、客服关注的内容不同。先辨认当前角色、时间和币种，再解释同一张看板。", boundary: "切换视角不等于服务端鉴权；金额和趋势不是实际经营结果。", href: "#case-materials", linkLabel: "打开角色看板" },
      { title: "沿同一记录查看列表与详情", where: "三角色导览 · 财务充值记录／客服会员列表", observation: "列表识别对象和状态，详情追溯编号、时间与备注。导览第二、三步可直接打开相应界面。", boundary: "空字段不能推断成审核通过或资金完成。", href: "#admin-role-tour", linkLabel: "查看列表与详情导览" },
      { title: "区分界面状态与账务证据", where: "钱包文章 · 充值与对账案例", observation: "订单、通道、账本和差异单通过同一演示订单关联，可比较一致、缺账、重复通知和未知结果。", boundary: "订单页写成功不足以证明账本一致；联动记录为虚构说明。", href: "/articles/wallet-payment-reconciliation#reconciliation-case", linkLabel: "对照四类对账结果" },
    ],
  },
  "bm-optimization": {
    title: "BM：三类材料分别能说明什么",
    material: "来源局部用于观察，同内容结构示意用于比较布局，独立原型用于查看分类与返回。",
    steps: [
      { title: "原截图与生成提案", where: "原材料观察 · 两张编号局部", observation: "观察实际可见的队名、时间、阶段与盘口标题。", boundary: "两侧赛事不同；源图分辨率有限，不作为同场改版效果。", href: "#bm-source-evidence", linkLabel: "回到原材料标注" },
      { title: "同内容结构示意", where: "布局示意 · 同一演示记录", observation: "保持内容一致，只比较分组；切换长队名和放大文字查看高度代价。", boundary: "这是重新绘制的解释图，不是原版还原或上线方案。", href: "#bm-layout-study", linkLabel: "回到同内容示意" },
      { title: "分类与状态原型", where: "BM手机原型 · 列表与详情", observation: "切换球类和状态，打开记录再返回，查看筛选是否保留。", boundary: "原型不复现上方盘口布局，使用独立演示记录。", href: "#bm-mobile-prototype", linkLabel: "操作分类与返回" },
    ],
  },
  "competitor-analysis": {
    title: "U8：从入口分组读到账号与资产状态",
    material: "首页、个人中心分析信息图与三组可放大的局部对照；另有账号、资产、订单、服务的交互示意。",
    steps: [
      { title: "区分首页与个人中心任务", where: "U8信息图 · 首页与个人中心", observation: "首页组织内容和功能入口，个人中心组织身份、资产、订单和服务。先判断入口属于哪类任务。", boundary: "图中的问题与改版建议是材料分析，不是已上线功能或转化数据。", href: "#case-materials", linkLabel: "查看两张完整信息图" },
      { title: "分开核对入口、钱包与服务", where: "U8重点位置 · 首页入口／首页分组／个人中心", observation: "将材料中的原界面和改版示意分别放大，核对登录按钮、浮条位置，以及钱包、收益和服务的分组。", boundary: "图中的布局变化不证明实际点击或资金结果；首页示意与个人中心原型分别判断。", href: "#case-focus", linkLabel: "查看三组局部对照" },
      { title: "比较五种界面状态", where: "个人中心原型 · 正常、加载、空结果、失败、受限", observation: "在四类分组中切换状态，核对原因和下一步。失败重试保留分组，空结果应与加载失败区分。", boundary: "资产与订单都是演示快照，不是实际资金查询结果。", href: "#u8-profile-prototype", linkLabel: "打开个人中心原型" },
    ],
  },
  "white-label-official": {
    title: "官网：从服务范围读到结构与咨询反馈",
    material: "现有官网页面、三处界面标注与六张桌面／手机实际截图。咨询表单为本地演示，不发送数据。",
    steps: [
      { title: "服务卡片说明范围与差异", where: "原官网演示 · 服务方案模块", observation: "对照标题、条目和下一步入口，区分服务覆盖的模块，避免用不同名称重复表达同一能力。", boundary: "卡片呈现不等于实际交付范围，仍需需求、约定和验收记录确认。", href: "/case-assets/white-label-official/index.html?case-preview=1#solution", linkLabel: "打开服务展示模块" },
      { title: "结构图与文字各有说明任务", where: "原官网演示 · 产品能力模块", observation: "结构图表达模块怎样连接，旁侧条目解释各组负责什么。先看主线，再核对前台、后台与外部服务边界。", boundary: "图中出现接口或模块不代表已完成真实对接。", href: "/case-assets/white-label-official/index.html?case-preview=1#product", linkLabel: "打开页面结构模块" },
      { title: "咨询入口同时检查字段与反馈", where: "官网桌面与手机对照 · 咨询入口", observation: "选择咨询入口，对照手机长模块和桌面首屏，核对必填项、联系方式、提交结果和后续查询说明。", boundary: "本地表单不发送咨询，示例联系方式不是实际服务渠道，提交反馈不等于送达。", href: "#official-responsive-comparison", linkLabel: "查看咨询入口响应式截图" },
    ],
  },
}
