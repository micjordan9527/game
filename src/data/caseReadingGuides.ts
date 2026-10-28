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
    title: "BM：分开阅读视觉方案与手机交互",
    material: "两张原界面／生成式方案对照图、三组可分别放大的局部对照，以及独立的虚构记录手机原型。",
    steps: [
      { title: "确认两张对照图的范围", where: "案例长图组 · 首页与详情页", observation: "首页比较分类与状态分层，详情页比较头区、内容块和底部操作区。图片左右两侧的材料性质不同。", boundary: "生成式视觉方向不能证明吸顶、触控、实时状态或服务端操作已经实现。", href: "#case-materials", linkLabel: "查看首页与详情对照图" },
      { title: "分别核对分类、状态与操作区", where: "BM局部对照 · 首页分类／状态层级／详情操作区", observation: "每组将原界面与生成式方案单独展示，可分别放大；配图注核对顶部入口、比分分组和详情底栏。", boundary: "方案中仍有悬浮图标，是否遮挡与固定需要实际操作核对；颜色和数字大小不能代替业务状态。", href: "#case-focus", linkLabel: "查看三组局部对照" },
      { title: "在原型中验证返回和反馈", where: "BM手机原型 · 筛选、详情、底部栏", observation: "切换运动与赛事状态，打开详情再返回，观察筛选是否保留，底部反馈是否仍指向当前记录。", boundary: "原型使用虚构赛事，不连接交易；它与静态视觉方案应分别判断。", href: "#bm-mobile-prototype", linkLabel: "打开手机交互原型" },
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
