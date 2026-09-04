type CaseIframeVersionPanelProps = {
  version: string | null
  updatedAt: string | null
  label?: string
  extraText?: string
  compact?: boolean
}

export function CaseIframeVersionPanel({
  version,
  updatedAt,
  label = "当前预览版本",
  extraText,
  compact = false,
}: CaseIframeVersionPanelProps) {
  return (
    <div className={`${compact ? "" : "mt-4"} rounded-md border border-line bg-paper px-4 py-3`}>
      <p className="text-xs leading-6 text-muted">
        {label}：v {version ?? "读取中"} {updatedAt ? `（${updatedAt}）` : ""}
        {extraText ? ` · ${extraText}` : ""}
      </p>
    </div>
  )
}
