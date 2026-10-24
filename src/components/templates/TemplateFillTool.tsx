"use client"

import { useEffect, useId, useState } from "react"
import type { TemplateItem } from "@/data/templates"
import { CopyTemplateButton } from "./CopyTemplateButton"
import { DownloadTemplateButton } from "./DownloadTemplateButton"

const sample: Record<string, string> = {
  品牌名称: "星河演示项目（虚构教学示例）",
  目标市场: "内部教学环境；实际适用市场及准入条件待负责人确认。",
  语言要求: "简体中文、英文；术语与时区显示需评审。",
  币种要求: "仅使用模拟币，明确小数精度，不接入真实资金。",
  上线时间: "演示评审日待定；评审通过后再确认上线窗口与负责人。",
  游戏类型: "仅演示测试数据；需逐项确认模块范围和验收账号。",
  支付方式: "隔离环境模拟充值与提现；覆盖重复通知、失败与结果未知。",
  代理模式: "演示归属关系与规则版本；实际结算规则另行评审。",
  活动需求: "教学活动：明确参与条件、奖励状态、冲突规则及异常回退。",
  风控要求: "定义触发条件、限制范围、审批角色和解除条件。",
  后台权限: "运营可查询；审核角色单独授权；敏感字段脱敏并保留操作日志。",
  数据报表: "记录指标定义、来源、时区、周期、筛选与排除规则。",
  会员管理: "区分账号、验证、会话与权限状态，补齐恢复和资料变更场景。",
  代理管理: "记录归属有效区间、层级约束和变更审批证据。",
  注单管理: "用模拟数据核对注单状态、结算结果、查询权限和异常追溯。",
}

type Fields = Record<string, string>
type SaveState = "loading" | "empty" | "saved" | "unavailable" | "blocked"
const fieldKey = (section: string, label: string) => `${section}:${label}`

export function TemplateFillTool({ template }: { template: TemplateItem }) {
  const storageKey = `wg-template-draft:${template.slug}`
  const id = useId()
  const [fields, setFields] = useState<Fields>({})
  const [saveState, setSaveState] = useState<SaveState>("loading")
  const [updatedAt, setUpdatedAt] = useState("")
  const [confirmClear, setConfirmClear] = useState(false)
  const keys = template.sections.flatMap((section) => section.items.map((label) => fieldKey(section.title, label)))

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw === null) { setSaveState("empty"); return }
      const draft = JSON.parse(raw)
      if (draft?.version !== 1 || draft.templateSlug !== template.slug || !draft.fields || typeof draft.fields !== "object" || Array.isArray(draft.fields) || Object.values(draft.fields).some((value) => typeof value !== "string") || typeof draft.updatedAt !== "string" || !Number.isFinite(Date.parse(draft.updatedAt))) {
        setSaveState("blocked")
        return
      }
      setFields(draft.fields)
      setUpdatedAt(draft.updatedAt)
      setSaveState("saved")
    } catch (error) {
      setSaveState(error instanceof SyntaxError ? "blocked" : "unavailable")
    }
  }, [storageKey, template.slug])

  function updateFields(next: Fields) {
    setFields(next)
    if (saveState === "blocked") return
    try {
      const timestamp = new Date().toISOString()
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, templateSlug: template.slug, fields: next, updatedAt: timestamp }))
      setUpdatedAt(timestamp)
      setSaveState("saved")
    } catch {
      setSaveState("unavailable")
    }
  }

  function fillSample() {
    const next = { ...fields }
    template.sections.forEach((section) => section.items.forEach((label) => {
      const key = fieldKey(section.title, label)
      if (!next[key]?.trim()) next[key] = sample[label] ?? ""
    }))
    updateFields(next)
  }

  function clearDraft() {
    try {
      localStorage.removeItem(storageKey)
      setSaveState("empty")
    } catch {
      setSaveState("unavailable")
    }
    setFields({})
    setUpdatedAt("")
    setConfirmClear(false)
  }

  const filled = keys.filter((key) => fields[key]?.trim()).length
  const content = [
    `# ${template.title}（填写结果）`, "", template.description, "",
    ...template.sections.flatMap((section) => [
      `## ${section.title}`, "",
      ...section.items.flatMap((label) => [`### ${label}`, "", fields[fieldKey(section.title, label)]?.trim() || "未填写", ""]),
    ]),
    "## 注意事项", "", ...template.cautions.map((caution) => `- ${caution}`), "",
  ].join("\n")
  const status = saveState === "loading" ? "正在读取本机草稿…"
    : saveState === "saved" ? `已保存到当前浏览器 · ${new Date(updatedAt).toLocaleString("zh-CN")}`
    : saveState === "blocked" ? "草稿格式无法读取，原记录已保留。本次填写仍可复制或导出；清空草稿后可重新保存。"
    : saveState === "unavailable" ? "此浏览器无法保存草稿，本次填写可复制或导出。"
    : "尚未填写，修改后自动保存在当前浏览器。"

  return (
    <section className="mt-8 rounded-xl border border-brand-100 bg-white p-5 md:p-6" aria-labelledby="template-fill-title">
      <h2 id="template-fill-title" className="text-xl font-semibold text-ink">在线填写需求表</h2>
      <p className="mt-2 text-sm leading-7 text-muted">填写内容仅保存在当前浏览器，不会提交到网站。请勿填写密码、密钥或真实身份资料；跨设备使用请导出文件。</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" disabled={saveState === "loading"} onClick={fillSample} className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-brand-700 disabled:opacity-50">用教学示例补全空白</button>
        <span className="text-sm text-muted">已填写 {filled} / {keys.length} 项</span>
      </div>
      <p className={`mt-3 text-sm leading-6 ${["blocked", "unavailable"].includes(saveState) ? "text-amber-800" : "text-muted"}`} role="status">{status}</p>
      <div className="mt-6 space-y-6">
        {template.sections.map((section, sectionIndex) => (
          <fieldset key={section.title} disabled={saveState === "loading"} className="min-w-0 border-t border-line pt-5">
            <legend className="pr-3 font-semibold text-ink">{section.title}</legend>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {section.items.map((label, index) => {
                const key = fieldKey(section.title, label)
                const inputId = `${id}-${sectionIndex}-${index}`
                return <div key={key} className="min-w-0">
                  <label htmlFor={inputId} className="block text-sm font-medium text-ink">{label}</label>
                  <textarea id={inputId} rows={2} value={fields[key] ?? ""} onChange={(event) => updateFields({ ...fields, [key]: event.target.value })} className="mt-2 block w-full resize-y rounded-md border border-line bg-paper px-3 py-2 text-sm leading-6 text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
                </div>
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="mt-6 border-t border-line pt-5" role="group" aria-label="填写结果操作">
        <p className="mb-3 text-sm text-muted">复制或导出当前填写结果，空白字段显示“未填写”。</p>
        <div className="flex flex-wrap gap-2">
          <CopyTemplateButton content={content} label="复制填写结果" />
          <DownloadTemplateButton content={content} filename={`${template.slug}-filled.md`} label="导出填写结果" />
          <button type="button" disabled={saveState === "loading"} onClick={() => setConfirmClear(true)} className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:text-ink disabled:opacity-50">清空草稿</button>
        </div>
        {confirmClear ? <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-950">清空全部填写内容和本机草稿？此操作无法撤销，可先导出备份。</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" onClick={clearDraft} className="rounded-md bg-amber-900 px-3 py-2 text-sm font-semibold text-white">确认清空</button>
            <button type="button" onClick={() => setConfirmClear(false)} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink">取消</button>
          </div>
        </div> : null}
      </div>
    </section>
  )
}
