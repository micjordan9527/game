import type { FlowStep } from "@/components/common/FeatureFlow"
export const articleFlows: Record<string, { title: string; steps: FlowStep[] }> = {
  "admin-filter-list-states": {
    title: "列表查询与返回的四个位置",
    steps: [
      { title: "编辑条件", text: "输入尚未应用，结果保留原条件标识。" },
      { title: "提交查询", text: "区分加载、无匹配和失败，成功才替换结果。" },
      { title: "打开详情", text: "保存条件、排序、页码与原记录位置。" },
      { title: "返回列表", text: "恢复上下文，数据变化时说明回退位置。" },
    ],
  },
  "form-validation-submit-feedback": {
    title: "从填写到原申请结果",
    steps: [
      { title: "字段校验", text: "保留填写内容，指出错误字段与修改方式。" },
      { title: "发送申请", text: "暂停重复操作，等待本次请求响应。" },
      { title: "辨认结果", text: "分别表达已受理、未受理与未知结果。" },
      { title: "核对原申请", text: "未知时先查原结果，受理不等于发布。" },
    ],
  },

  "member-agent-platform": {
    title: "三种角色怎样连接",
    steps: [
      { title: "平台", text: "提供账号、页面与业务系统。" },
      { title: "代理", text: "建立合作关系与会员归属。" },
      { title: "会员", text: "使用服务，产生可追溯记录。" },
    ],
  },
  "operation-product-conversion-model": {
    title: "运营与产品的协作闭环",
    steps: [
      { title: "业务目标", text: "明确用户与使用场景。" },
      { title: "页面承接", text: "用内容和功能组织路径。" },
      { title: "反馈与数据", text: "对齐指标与用户问题。" },
      { title: "改进方案", text: "回到页面、规则和流程。" },
    ],
  },
  "first-deposit-retention-vip": {
    title: "四类活动对照",
    steps: [
      { title: "首存", text: "首次充值对应的参与条件。" },
      { title: "复存", text: "再次充值对应的活动规则。" },
      { title: "返水", text: "按约定口径核算与发放。" },
      { title: "VIP", text: "等级、权益与有效期。" },
    ],
  },
  "game-provider-api": {
    title: "平台与厂商怎样协作",
    steps: [
      { title: "登录", text: "确认用户与会话。" },
      { title: "余额", text: "明确钱包与资金边界。" },
      { title: "注单", text: "通过唯一编号关联记录。" },
      { title: "结算", text: "接收结果、核对状态。" },
    ],
  },
  "bet-ticket-status": {
    title: "一张注单的状态变化",
    steps: [
      { title: "提交", text: "核对选项、报价与金额。" },
      { title: "受理", text: "确认是否建立正式记录。" },
      { title: "结算", text: "根据结果更新状态。" },
      { title: "到账或退回", text: "核对记录与钱包变化。" },
    ],
  },
  "admin-information-hierarchy": {
    title: "后台界面的阅读顺序",
    steps: [
      { title: "先看状态", text: "当前对象发生了什么。" },
      { title: "再看关键数据", text: "金额、时间和影响范围。" },
      { title: "找到操作", text: "下一步可以做什么。" },
      { title: "按需看细节", text: "备注、日志与关联记录。" },
    ],
  },
  "data-report-metrics": {
    title: "看报表，先对齐四件事",
    steps: [
      { title: "时间", text: "时区、周期与统计日期。" },
      { title: "范围", text: "站点、对象和筛选条件。" },
      { title: "口径", text: "计算方式与排除规则。" },
      { title: "明细", text: "从汇总追溯原始记录。" },
    ],
  },
}
