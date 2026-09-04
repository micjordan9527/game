export type TemplateItem = {
  slug: string
  title: string
  description: string
  category: string
  roles: string[]
  useCases: string[]
  cautions: string[]
  sections: {
    title: string
    items: string[]
  }[]
}

export const templates: TemplateItem[] = [
  {
    slug: "white-label-requirement-form",
    title: "包网项目需求表",
    description: "用于早期收集客户或内部团队对包网项目的基础需求。",
    category: "包网",
    roles: ["项目", "产品", "售前"],
    useCases: ["项目启动前需求收集", "客户沟通前内部对齐"],
    cautions: ["目标市场、币种和支付方式必须明确", "不要只记录前台页面需求"],
    sections: [
      {
        title: "基础信息",
        items: ["品牌名称", "目标市场", "语言要求", "币种要求", "上线时间"],
      },
      {
        title: "业务需求",
        items: ["游戏类型", "支付方式", "代理模式", "活动需求", "风控要求"],
      },
      {
        title: "后台需求",
        items: ["后台权限", "数据报表", "会员管理", "代理管理", "注单管理"],
      },
    ],
  },
  {
    slug: "promotion-system-prd",
    title: "活动系统 PRD 模板",
    description: "用于设计首存、复存、返水、VIP、任务等活动。",
    category: "产品",
    roles: ["产品", "运营"],
    useCases: ["活动系统 PRD", "活动上线前规则评审"],
    cautions: ["奖励、流水和风控限制要同步设计", "活动口径要能被报表验证"],
    sections: [
      {
        title: "活动基础",
        items: ["活动背景", "活动目标", "适用用户", "参与条件"],
      },
      {
        title: "规则配置",
        items: ["奖励规则", "流水要求", "发放方式", "后台配置"],
      },
      {
        title: "风险与数据",
        items: ["风控限制", "数据指标", "异常情况", "复盘方式"],
      },
    ],
  },
  {
    slug: "agent-system-prd",
    title: "代理系统 PRD 模板",
    description: "用于设计代理推广、下级管理、佣金结算和报表功能。",
    category: "产品",
    roles: ["产品", "运营"],
    useCases: ["代理后台设计", "佣金规则梳理"],
    cautions: ["层级变更和佣金结算必须保留日志", "代理可见数据要控制隐私边界"],
    sections: [
      {
        title: "代理结构",
        items: ["代理角色", "层级关系", "推广方式", "会员绑定规则"],
      },
      {
        title: "收益规则",
        items: ["佣金计算规则", "返点配置", "结算周期", "提现规则"],
      },
      {
        title: "后台管理",
        items: ["报表字段", "风控规则", "后台权限", "异常处理"],
      },
    ],
  },
  {
    slug: "launch-checklist",
    title: "上线检查清单",
    description: "用于平台上线前检查核心链路是否正常。",
    category: "运维",
    roles: ["项目", "运维", "产品"],
    useCases: ["上线前验收", "灰度开放前检查"],
    cautions: ["资金链路和游戏链路必须用生产配置复核", "上线窗口要明确应急联系人"],
    sections: [
      {
        title: "用户链路",
        items: ["注册是否正常", "登录是否正常", "充值是否正常", "提现是否正常"],
      },
      {
        title: "游戏链路",
        items: ["游戏进入是否正常", "下注是否正常", "注单是否生成", "派彩是否正常"],
      },
      {
        title: "后台链路",
        items: ["活动奖励是否正常", "代理绑定是否正常", "后台权限是否正常", "报表数据是否正常"],
      },
      {
        title: "运维链路",
        items: ["告警是否配置", "日志是否可查", "异常联系人是否明确", "回滚方案是否准备"],
      },
    ],
  },
  {
    slug: "incident-review",
    title: "事故复盘模板",
    description: "用于平台异常、支付异常、游戏异常、注单异常后的复盘。",
    category: "运维",
    roles: ["运维", "项目", "产品"],
    useCases: ["事故复盘会议", "异常处理归档"],
    cautions: ["复盘要区分临时方案和长期改进", "不要只记录结果，要记录时间线"],
    sections: [
      {
        title: "事故信息",
        items: ["事故时间", "影响范围", "用户影响", "发现方式"],
      },
      {
        title: "处理过程",
        items: ["根因分析", "处理过程", "恢复时间", "临时方案"],
      },
      {
        title: "后续改进",
        items: ["长期改进", "责任归属", "后续跟进项", "复盘结论"],
      },
    ],
  },
  {
    slug: "risk-rule-review",
    title: "风控规则评审表",
    description: "用于评审异常识别、限制策略、人工复核和操作日志是否完整。",
    category: "运维",
    roles: ["风控", "产品", "运维"],
    useCases: ["风控规则上线前评审", "异常策略复盘"],
    cautions: ["规则细节不要对外公开", "限制动作要有解除条件和审批记录"],
    sections: [
      {
        title: "规则信息",
        items: ["规则名称", "适用场景", "触发条件", "影响对象"],
      },
      {
        title: "处理动作",
        items: ["提醒方式", "限制方式", "人工复核", "解除条件"],
      },
      {
        title: "审计要求",
        items: ["操作日志", "审批记录", "误伤评估", "复盘周期"],
      },
    ],
  },
  {
    slug: "data-report-spec",
    title: "数据报表口径说明",
    description: "用于统一注册、充值、流水、注单、派彩、留存等报表指标口径。",
    category: "产品",
    roles: ["产品", "运营", "数据"],
    useCases: ["报表 PRD", "运营指标口径统一"],
    cautions: ["指标必须说明统计周期和数据来源", "导出权限和敏感字段要单独评审"],
    sections: [
      {
        title: "指标定义",
        items: ["指标名称", "业务含义", "计算公式", "统计周期"],
      },
      {
        title: "数据来源",
        items: ["来源表或接口", "更新时间", "筛选条件", "排除规则"],
      },
      {
        title: "展示与导出",
        items: ["页面字段", "筛选项", "排序规则", "导出权限"],
      },
    ],
  },
]
