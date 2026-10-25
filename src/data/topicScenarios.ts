export type ScenarioState = { label: string; status: string; fields: [string, string][]; feedback: string; next: string }
export type TopicScenario = { title: string; description: string; steps: string[]; evidence: string; diagram?: string; states: ScenarioState[]; related: { title: string; href: string; reason: string }[] }

export const topicScenarios: Record<string, TopicScenario> = {
  "member-account-states": {
    "title": "账号限制与恢复：界面怎样反馈",
    "description": "同一会员在不同状态下，查询、敏感操作和恢复入口分别怎样表达。账号状态与钱包状态单独记录。",
    "steps": [
      "核对账号标识",
      "分清限制范围",
      "查看允许动作",
      "复核后更新状态"
    ],
    "evidence": "/images/enrichment/admin-support-03.jpg",
    "states": [
      {
        "label": "正常",
        "status": "正常",
        "fields": [
          [
            "会员编号",
            "DEMO-M001"
          ],
          [
            "登录会话",
            "有效"
          ],
          [
            "资料查询",
            "可查询"
          ],
          [
            "资金状态",
            "单独查询钱包记录"
          ]
        ],
        "feedback": "账号正常，可使用已授权的功能。",
        "next": "按实际权限进入对应业务。"
      },
      {
        "label": "受限",
        "status": "部分功能受限",
        "fields": [
          [
            "会员编号",
            "DEMO-M001"
          ],
          [
            "限制范围",
            "本例限制资料变更"
          ],
          [
            "资料查询",
            "可查询"
          ],
          [
            "申请编号",
            "DEMO-R001"
          ]
        ],
        "feedback": "资料变更暂不可操作，保留查询与进度入口。",
        "next": "查看原因与所需资料，不重复提交同一申请。"
      },
      {
        "label": "停用",
        "status": "账号停用",
        "fields": [
          [
            "会员编号",
            "DEMO-M001"
          ],
          [
            "登录会话",
            "原会话失效"
          ],
          [
            "敏感操作",
            "不可执行"
          ],
          [
            "钱包状态",
            "不由账号停用自动推定"
          ]
        ],
        "feedback": "当前账号已停用，显示联系支持及查询处理进度的方式。",
        "next": "通过已授权流程复核；不将停用自动等同于资金冻结。"
      },
      {
        "label": "恢复",
        "status": "复核通过",
        "fields": [
          [
            "会员编号",
            "DEMO-M001"
          ],
          [
            "复核记录",
            "DEMO-R001"
          ],
          [
            "会话要求",
            "按规则重新认证"
          ],
          [
            "原变更申请",
            "仍需独立处理"
          ]
        ],
        "feedback": "账号恢复后重新认证，原资料变更申请不会自动批准。",
        "next": "核对新状态与复核记录，重新进入业务。"
      }
    ],
    "related": [
      {
        "title": "会员评审表",
        "href": "/templates/member-account-review",
        "reason": "查看同一恢复场景的完整填写示例。"
      },
      {
        "title": "客服角色导览",
        "href": "/cases/admin-optimization#admin-role-tour",
        "reason": "对照会员列表和详情的实际演示界面。"
      }
    ]
  },
  "wallet-payment-reconciliation": {
    "title": "一笔充值的三份记录",
    "description": "用同一笔 DEMO-001 对照平台订单、通道回执与资金账本，区分支付确认和实际入账。",
    "steps": [
      "匹配交易编号",
      "核对金额与币种",
      "逐笔比较状态",
      "复核差异并留痕"
    ],
    "evidence": "/images/enrichment/admin-finance-03.jpg",
    "diagram": "/images/enrichment/wallet-reconciliation-gpt.webp",
    "states": [
      {
        "label": "核对一致",
        "status": "三方一致",
        "fields": [
          [
            "平台订单",
            "DEMO-001 · 已支付"
          ],
          [
            "通道回执",
            "EXT-001 · 成功"
          ],
          [
            "账本记录",
            "LEDGER-001 · 入账一次"
          ],
          [
            "金额 / 币种",
            "100.00 / DEMO"
          ]
        ],
        "feedback": "订单、通道和账本可关联，金额与币种相同。",
        "next": "核对时间口径与原始凭据后标记复核完成。"
      },
      {
        "label": "缺少入账",
        "status": "支付成功，账本待入账",
        "fields": [
          [
            "平台订单",
            "DEMO-001 · 已支付"
          ],
          [
            "通道回执",
            "EXT-001 · 成功"
          ],
          [
            "账本记录",
            "未找到对应入账"
          ],
          [
            "金额 / 币种",
            "100.00 / DEMO"
          ]
        ],
        "feedback": "通道成功不能代替入账证据；差异单保持处理中。",
        "next": "查询既有流水、通知与补偿记录，复核授权后处理。"
      },
      {
        "label": "重复通知",
        "status": "收到重复回执",
        "fields": [
          [
            "平台订单",
            "DEMO-001 · 已支付"
          ],
          [
            "通道回执",
            "EXT-001 · 相同通知两次"
          ],
          [
            "账本记录",
            "LEDGER-001 · 仍仅一次"
          ],
          [
            "金额 / 币种",
            "100.00 / DEMO"
          ]
        ],
        "feedback": "重复通知对应同一笔业务，不应增加第二笔入账。",
        "next": "用唯一业务标识检查幂等处理与原记录。"
      },
      {
        "label": "结果未知",
        "status": "查询确认中",
        "fields": [
          [
            "平台订单",
            "DEMO-001 · 确认中"
          ],
          [
            "通道回执",
            "原请求暂未返回终态"
          ],
          [
            "账本记录",
            "待确认"
          ],
          [
            "金额 / 币种",
            "100.00 / DEMO"
          ]
        ],
        "feedback": "未收到结果不等于失败；显示查询进度。",
        "next": "先查询原交易，避免生成重复支付或出款请求。"
      }
    ],
    "related": [
      {
        "title": "钱包对账检查表",
        "href": "/templates/wallet-reconciliation-checklist",
        "reason": "示例逐项记录缺账差异、证据和复核结论。"
      },
      {
        "title": "财务角色导览",
        "href": "/cases/admin-optimization#admin-role-tour",
        "reason": "对照充值列表与订单详情的字段组织。"
      }
    ]
  },
  "agent-system-design": {
    "title": "归属变更与历史结算",
    "description": "本例约定按业务发生时的归属和规则版本核算，展示变更前后怎样保留记录。",
    "steps": [
      "确定生效时间",
      "保存原归属",
      "新业务用新规则",
      "历史调整单独留痕"
    ],
    "evidence": "/images/enrichment/admin-support-03.jpg",
    "states": [
      {
        "label": "变更前",
        "status": "归属 A",
        "fields": [
          [
            "会员",
            "DEMO-M001"
          ],
          [
            "代理",
            "代理 A"
          ],
          [
            "规则版本",
            "RULE-A-01"
          ],
          [
            "生效区间",
            "截至 2026-10-25 12:00（UTC+8）"
          ]
        ],
        "feedback": "变更前产生的记录保留代理 A 与原规则版本。",
        "next": "先核对历史批次，再审批新的归属关系。"
      },
      {
        "label": "变更后",
        "status": "新业务归属 B",
        "fields": [
          [
            "会员",
            "DEMO-M001"
          ],
          [
            "代理",
            "代理 B"
          ],
          [
            "规则版本",
            "RULE-B-02"
          ],
          [
            "生效区间",
            "2026-10-25 12:00（UTC+8）起"
          ]
        ],
        "feedback": "新业务按本例确认的新归属处理；历史批次不自动覆盖。",
        "next": "记录变更原因、审批人和生效时间。"
      },
      {
        "label": "历史调整",
        "status": "单独调整记录",
        "fields": [
          [
            "原批次",
            "BATCH-DEMO-09"
          ],
          [
            "原规则",
            "RULE-A-01"
          ],
          [
            "调整编号",
            "ADJ-DEMO-01"
          ],
          [
            "处理状态",
            "待复核"
          ]
        ],
        "feedback": "历史修正关联原批次，以调整记录说明原因和影响。",
        "next": "核对明细后复核，保留原始计算依据。"
      }
    ],
    "related": [
      {
        "title": "代理系统需求模板",
        "href": "/templates/agent-system-prd",
        "reason": "把归属、规则版本和生效区间写进需求。"
      },
      {
        "title": "数据报表口径",
        "href": "/templates/data-report-spec",
        "reason": "明确跨期批次与调整项的统计方式。"
      }
    ]
  },
  "campaign-risk-review": {
    "title": "活动规则与奖励状态",
    "description": "以资料完善演示活动为例，分开表达参与条件、奖励条件和审核结果。",
    "steps": [
      "确认参与资格",
      "校验活动条件",
      "核对审核结果",
      "幂等发放并留记录"
    ],
    "evidence": "/images/enrichment/admin-operation-03.jpg",
    "states": [
      {
        "label": "条件未满足",
        "status": "不可申请",
        "fields": [
          [
            "活动",
            "DEMO-CAMPAIGN-01"
          ],
          [
            "参与范围",
            "测试账号"
          ],
          [
            "未满足项",
            "资料项未完成"
          ],
          [
            "奖励示例",
            "10.00 DEMO"
          ]
        ],
        "feedback": "说明当前缺少的条件，不将不可申请显示成系统错误。",
        "next": "完成所需资料后重新核对资格。"
      },
      {
        "label": "待审核",
        "status": "申请已受理",
        "fields": [
          [
            "申请",
            "DEMO-REWARD-01"
          ],
          [
            "条件校验",
            "已通过"
          ],
          [
            "审核状态",
            "待复核"
          ],
          [
            "奖励状态",
            "未发放"
          ]
        ],
        "feedback": "申请受理与奖励到账是两个阶段，显示查询入口。",
        "next": "等待复核结果，不重复创建同一申请。"
      },
      {
        "label": "已发放",
        "status": "审核通过",
        "fields": [
          [
            "申请",
            "DEMO-REWARD-01"
          ],
          [
            "审核状态",
            "通过"
          ],
          [
            "奖励流水",
            "DEMO-REWARD-L001"
          ],
          [
            "奖励示例",
            "10.00 DEMO · 仅一次"
          ]
        ],
        "feedback": "展示奖励记录与当前状态，同一申请不重复发放。",
        "next": "通过关联流水核对结果与数据统计。"
      },
      {
        "label": "已失效",
        "status": "有效期结束",
        "fields": [
          [
            "活动",
            "DEMO-CAMPAIGN-01"
          ],
          [
            "失效原因",
            "超过本例申请期限"
          ],
          [
            "奖励状态",
            "未发放"
          ],
          [
            "已有记录",
            "保留查询"
          ]
        ],
        "feedback": "说明失效原因与适用规则，不删除已经产生的记录。",
        "next": "如存在异议，按原规则和证据复核。"
      }
    ],
    "related": [
      {
        "title": "活动系统模板",
        "href": "/templates/promotion-system-prd",
        "reason": "把参与条件、奖励条件和反馈分别写清。"
      },
      {
        "title": "运营角色导览",
        "href": "/cases/admin-optimization#admin-role-tour",
        "reason": "查看活动记录列表和实际详情字段。"
      }
    ]
  },
  "admin-information-hierarchy": {
    "title": "同一条记录的四层信息",
    "description": "用充值记录示意筛选、列表、详情与异常提示如何配合，不把所有字段挤进首屏。",
    "steps": [
      "筛选定位范围",
      "列表识别记录",
      "详情承载依据",
      "异常明确下一步"
    ],
    "evidence": "/images/enrichment/admin-finance-02.jpg",
    "states": [
      {
        "label": "筛选",
        "status": "查询范围已确认",
        "fields": [
          [
            "业务范围",
            "充值记录"
          ],
          [
            "时间口径",
            "创建时间 · UTC+8"
          ],
          [
            "状态条件",
            "确认中"
          ],
          [
            "查询条件",
            "DEMO-M001"
          ]
        ],
        "feedback": "筛选项显示当前范围，并能清除条件。",
        "next": "查询列表后核对是否仍使用同一时间口径。"
      },
      {
        "label": "列表",
        "status": "找到对应记录",
        "fields": [
          [
            "订单编号",
            "DEMO-001"
          ],
          [
            "会员编号",
            "DEMO-M001"
          ],
          [
            "金额",
            "100.00 DEMO"
          ],
          [
            "状态",
            "确认中"
          ]
        ],
        "feedback": "列表优先展示识别、金额和状态，再提供详情入口。",
        "next": "用同一订单编号打开详情。"
      },
      {
        "label": "详情",
        "status": "查看关联依据",
        "fields": [
          [
            "订单编号",
            "DEMO-001"
          ],
          [
            "外部编号",
            "EXT-001"
          ],
          [
            "状态来源",
            "最近一次有效通知"
          ],
          [
            "关联流水",
            "待核对"
          ]
        ],
        "feedback": "详情补充外部编号、状态来源和关联记录。",
        "next": "依据记录进行核对；查询权限不等同于调整权限。"
      },
      {
        "label": "异常",
        "status": "暂未找到终态",
        "fields": [
          [
            "订单编号",
            "DEMO-001"
          ],
          [
            "异常说明",
            "原交易仍在确认"
          ],
          [
            "已有状态",
            "不覆盖为失败"
          ],
          [
            "建议动作",
            "查询原请求"
          ]
        ],
        "feedback": "异常提示交代对象、原因、影响与下一步。",
        "next": "保留查询入口，不能用再次提交代替核对。"
      }
    ],
    "related": [
      {
        "title": "后台优化案例",
        "href": "/cases/admin-optimization#admin-role-tour",
        "reason": "查看相同分层方式在实际演示中的呈现。"
      },
      {
        "title": "UI 设计系统",
        "href": "/ai-workflows/ui-design-system#workflow-process",
        "reason": "继续看页面结构如何映射到组件状态。"
      }
    ]
  },
  "bet-ticket-status": {
    "title": "注单取消、结算与重算",
    "description": "从同一注单的状态记录理解页面反馈。以下是界面与数据关系示意，不连接真实投注。",
    "steps": [
      "受理保留标识",
      "确认有效状态",
      "结算写入结果",
      "更正关联原记录"
    ],
    "evidence": "/images/showcase/sports/bet-ticket-lifecycle.jpg",
    "states": [
      {
        "label": "已受理",
        "status": "等待确认",
        "fields": [
          [
            "注单",
            "DEMO-T001"
          ],
          [
            "业务标识",
            "REQUEST-001"
          ],
          [
            "结算结果",
            "未产生"
          ],
          [
            "页面反馈",
            "查询进度"
          ]
        ],
        "feedback": "受理仅代表请求已记录，不能提前展示最终结算结果。",
        "next": "查询当前有效状态和来源。"
      },
      {
        "label": "结算中",
        "status": "核对结果",
        "fields": [
          [
            "注单",
            "DEMO-T001"
          ],
          [
            "事件来源",
            "EVENT-DEMO-01"
          ],
          [
            "结算批次",
            "BATCH-DEMO-01"
          ],
          [
            "账本状态",
            "等待结算确认"
          ]
        ],
        "feedback": "保持订单状态与资金处理阶段的对应关系。",
        "next": "结果确认后关联结算记录。"
      },
      {
        "label": "已结算",
        "status": "保留结果",
        "fields": [
          [
            "注单",
            "DEMO-T001"
          ],
          [
            "结算版本",
            "SETTLEMENT-V1"
          ],
          [
            "关联流水",
            "LEDGER-DEMO-01"
          ],
          [
            "历史记录",
            "可追溯"
          ]
        ],
        "feedback": "结算结果关联来源版本与流水，便于核对。",
        "next": "如结果需更正，进入有记录的重算流程。"
      },
      {
        "label": "已取消",
        "status": "记录取消原因",
        "fields": [
          [
            "注单",
            "DEMO-T001"
          ],
          [
            "取消依据",
            "RULE-DEMO-01"
          ],
          [
            "处理状态",
            "按本例规则确认"
          ],
          [
            "资金处理",
            "独立查询关联流水"
          ]
        ],
        "feedback": "取消原因与资金处理分别展示，不仅显示一个“取消”标签。",
        "next": "核对关联资金记录与实际处理结果。"
      },
      {
        "label": "重算",
        "status": "保留原结果及更正",
        "fields": [
          [
            "注单",
            "DEMO-T001"
          ],
          [
            "原版本",
            "SETTLEMENT-V1"
          ],
          [
            "更正版本",
            "SETTLEMENT-V2"
          ],
          [
            "关联方式",
            "冲正与新记录引用原流水"
          ]
        ],
        "feedback": "重算不直接抹去历史结算；界面能查看原结果与更正关系。",
        "next": "核对更正依据、差额与复核记录。"
      }
    ],
    "related": [
      {
        "title": "BM 手机端对照",
        "href": "/cases/bm-optimization#case-focus",
        "reason": "把状态关系与详情操作区放在一起看。"
      },
      {
        "title": "上线检查模板",
        "href": "/templates/launch-checklist",
        "reason": "用正常、取消、延迟和更正场景复核界面。"
      }
    ]
  }
}
