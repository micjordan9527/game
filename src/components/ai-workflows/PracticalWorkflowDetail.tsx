import Link from "next/link"
import { ArrowDown } from "lucide-react"
import type { AiWorkflow } from "@/data/aiWorkflowLibrary"
import { Frame, Field, Action, Badge } from "@/components/article/DesignArticleGuide"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { CopyPromptButton } from "./CopyPromptButton"
import { PracticalPromptBuilder } from "./PracticalPromptBuilder"
import { matrixExampleText, matrixFields, matrixStates, requirementExample, requirementQuestions, screenshotExample, screenshotClaims, screenshotCaseText } from "@/data/practicalWorkflows"
import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"
import { resourcesForResource } from "@/lib/knowledge-relations"
import { assetPath } from "@/lib/assets"
import base from "@/components/article/DesignArticleGuide.module.css"
import styles from "@/components/article/EvidenceWorkflow.module.css"

function Crop({ x, y, width, height, alt }: { x: number; y: number; width: number; height: number; alt: string }) {
  return <div className={styles.crop} style={{ aspectRatio: `${width}/${height}` }}><img src={assetPath("/images/enrichment/admin-finance-02.jpg")} alt={alt} width={1440} height={900} loading="lazy" style={{ width: `${1440 / width * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} /></div>
}
function RequirementVisuals() {
  return <div className={base.grid}>
    <Frame n="1" title="输入先拆成可引用的条目" note="保留R编号，输出才能指回需求原文。没有写明的规则先列待确认。"><div className={base.browserBar}><span />REQ-DEMO-001 · 虚构需求</div><div className={styles.record}><strong className={styles.source}>R1 · 查询字段</strong><p>编号或标题；去首尾空格，不区分大小写。</p></div><div className={styles.record}><strong className={styles.source}>R3 · 条件生效</strong><p>点击查询成功后，条件、数量和列表一起更新。</p></div><div className={styles.record}><strong className={styles.source}>R4 · 异常</strong><p>失败保留并标明旧结果；无匹配显示0条。</p></div></Frame>
    <Frame n="2" title="把一句话映射到字段与界面" note="F4的规则来自R3，8条与3条的演示数量来自D1。输入条件和列表实际条件分别表达。"><div className={base.browserBar}><span />F4 · 已应用条件</div><Field label="正在编辑的状态" value="已关闭" /><Action>查询 · 尚未点击</Action><div className={base.applied}>上次成功：全部 · 共8条</div><ArrowDown className={base.sceneArrow} aria-hidden="true" /><div className={styles.record}><strong>点击并成功后</strong><p>已应用：已关闭 · 共3条</p></div><Badge>来源R3、D1 · 示例界面对照</Badge></Frame>
    <Frame n="3" title="状态写出触发、反馈和动作" note="S4来自R4。失败不能写成无记录，也不能把旧列表标为新查询结果。"><div className={base.browserBar}><span />S4 · 查询失败</div><div className={base.notice}>本次没有取得可信结果。</div><div className={base.applied}>保留上次结果 · 明确标注旧条件</div><div className={base.actions}><Action>重试当前条件</Action></div><div className={styles.record}><strong>验收观察点</strong><p>旧数量不变为0，旧结果不冒充新结果。</p></div></Frame>
    <Frame n="4" title="原文没写，就留下待确认" note="AI草稿不能自行决定取消、权限缓存或跨页选择规则。补充约定后再更新矩阵和验收依据。"><div className={base.browserBar}><span />S6 · 查询中</div><Field label="已知触发" value="请求已发出，尚未返回" /><div className={base.actions}><Action disabled>能否取消？待确认</Action><Action disabled>能否再次查询？待确认</Action></div><div className={styles.record}><strong>其他待确认</strong><p>权限失效后的缓存；跨页选择；刷新恢复。</p></div><Badge tone="warn">不能擅自填成已实现</Badge></Frame>
  </div>
}
function ScreenshotVisuals() {
  return <div className={base.grid}>
    <Frame n="1" title="先定位截图里的事实" note="E1是筛选区，E2是每行的详情与记录入口。这里只描述截图能直接看见的内容。"><div className={base.browserBar}><span />MAT-DEMO-001 · 本地演示截图</div><Badge>E1 · 列表上方的对象与编号筛选</Badge><Field label="可见字段示例" value="会员ID、订单号、渠道订单号" /><Badge>E2 · 记录右侧入口</Badge><Crop x={1215} y={680} width={205} height={140} alt="原截图局部：记录右侧的详情和查看记录入口" /></Frame>
    <Frame n="2" title="看见导出入口，不等于验证授权" note="E3只能支持按钮可见。不同角色、数据范围和下载结果需要其他证据。"><div className={base.browserBar}><span />E3 · 截图右上方</div><Crop x={1310} y={158} width={120} height={64} alt="原截图局部：右上方导出记录按钮" /><div className={styles.record}><strong>可直接写</strong><p>页面右上方显示导出记录按钮。</p></div><div className={styles.record}><strong>待验证</strong><p>是否有权限，是否按范围导出，拒绝时是否生成文件。</p></div></Frame>
    <Frame n="3" title="案例说明逐句关联证据" note="事实与设计解释分开标注。解释可以讨论结构，但不冒充后台能力或已测效果。"><div className={base.browserBar}><span />案例说明 · 预置示例片段</div>{screenshotClaims.slice(0, 4).map((claim) => <div key={claim.id} className={styles.record}><Badge tone={claim.kind === "可见事实" ? "good" : "neutral"}>{claim.kind} · {claim.evidence}</Badge><p>{claim.text}</p></div>)}</Frame>
    <Frame n="4" title="没有证据的结论明确留空" note="不写无依据的效率提升、转化数据、实际权限或历史改版过程。人工复核后再用于正式案例。"><div className={base.browserBar}><span />案例复核 · 待补证据</div>{screenshotClaims.slice(4).map((claim) => <div key={claim.id} className={styles.record}><Badge tone="warn">{claim.kind}</Badge><p>{claim.text}</p><p className={styles.source}>{claim.evidence}</p></div>)}<Badge>原截图不证明真实生产运行</Badge></Frame>
  </div>
}
export function PracticalWorkflowDetail({ workflow }: { workflow: AiWorkflow }) {
  const matrix = workflow.slug === "requirements-state-matrix"
  const sample = matrix ? requirementExample : screenshotExample
  const output = matrix ? matrixExampleText() : screenshotCaseText
  return <div className="container-shell max-w-6xl py-6 md:py-8">
    <Link href="/ai-workflows" className="text-sm font-semibold text-brand-700">← AI 工作流</Link><h1 className="mt-4 text-3xl font-semibold">{workflow.title}</h1><p className="mt-3 text-sm leading-7 text-muted">{workflow.summary}</p>
    <section id="workflow-outputs" aria-label="输入与输出图解" className={`mt-6 scroll-mt-24 ${base.guide}`}><div className={base.heading}><p>本站整理的预置示例 · 供人工复核</p><h2>{matrix ? "需求原文怎样对应到矩阵" : "截图事实怎样变成案例说明"}</h2><p>图中控件用于静态说明；下面可复制输入、示例输出与完整提示词，不执行实时AI生成。</p></div><nav aria-label="工作流阅读入口" className={base.readingNav}><a href="#workflow-outputs">看输入与输出</a><a href="#workflow-details">查看完整示例 ↓</a><a href="#workflow-prompt">替换输入并复制提示词 ↓</a></nav><div className="mt-5">{matrix ? <RequirementVisuals /> : <ScreenshotVisuals />}</div></section>
    {!matrix ? <section id="screenshot-source" aria-label="工作流截图来源" className="mt-6 scroll-mt-24"><h2 className="text-xl font-semibold">原始材料与来源</h2><p className="mt-3 text-sm leading-7 text-muted">现有本地后台演示截图，非生产记录。局部裁切只改变查看范围；完整截图可放大，并可打开对应演示。</p><LongImageGallery label="参考输入材料" groupLabel="截图输入参考组" emptyMessage="输入截图暂时无法显示。" items={[{ id: "case-input", title: "MAT-DEMO-001 · 充值记录", description: "E1筛选区、E2记录右侧入口、E3右上方导出按钮。图片用于观察结构，不证明服务端权限。", src: "/images/enrichment/admin-finance-02.jpg", width: 1440, height: 900, sourceHref: "/case-assets/admin-optimization/index.html#version=optimized&page=finance-fundsRecords-depositRecord" }]} /></section> : null}
    <details open id="workflow-details" className="mt-6 scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6"><summary className="cursor-pointer font-semibold">查看详细说明</summary><section aria-label="预置示例输入" className="mt-5"><h2 className="text-xl font-semibold">示例输入</h2><pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-paper p-4 text-sm leading-7">{sample}</pre><CopyPromptButton content={sample} label="复制示例输入" /></section>
      <section aria-label="预置示例输出" className="mt-6"><h2 className="text-xl font-semibold">示例输出与人工复核</h2>{matrix ? <><h3 className="mt-4 font-semibold">字段表</h3><div className={styles.rows}>{matrixFields.map((x) => <article key={x.id} className={styles.matrix}><h3>{x.id} · {x.name}</h3><p className="mt-2 text-sm leading-7">{x.rule}</p><p className="mt-2 text-sm font-semibold text-brand-700">来源：{x.source}</p></article>)}</div><h3 className="mt-5 font-semibold">状态矩阵</h3><div className={styles.rows}>{matrixStates.map((x) => <article key={x.id} className={styles.matrix}><h3>{x.id} · {x.state}</h3><dl className="text-sm leading-7">{[["触发", x.trigger], ["界面反馈", x.screen], ["允许动作", x.action], ["来源", x.source]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></article>)}</div><h3 className="mt-5 font-semibold">待确认项</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7">{requirementQuestions.map((x) => <li key={x}>{x}</li>)}</ul></> : <><pre className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-paper p-4 text-sm leading-7">{screenshotCaseText}</pre><p className="mt-3 text-sm leading-7">逐句核对E编号是否存在；模糊文字不猜写；设计解释单独标明；后端能力与效果数据另取证。对外使用前检查素材授权、脱敏和事实范围。</p></>}<div className="mt-4"><CopyPromptButton content={output} label="复制示例输出" /></div></section>
    </details>
    <PracticalPromptBuilder slug={workflow.slug} sample={sample} />
    <section className="mt-6 rounded-xl border border-line bg-white p-4 text-sm leading-7 md:p-6"><h2 className="text-xl font-semibold">怎样复核后继续使用</h2><p className="mt-3">{matrix ? "逐行核对R编号、值域、触发和异常；删去自行补出的规则；把待确认项交给相关人员补充，再更新矩阵与验收观察点。" : "核对原图与每条E编号，保留事实与推断边界；补充真实操作和数据证据后，再更新对应说明。"}</p><div className="mt-4 flex flex-wrap gap-4 font-semibold text-brand-700"><Link href={matrix ? "/articles/admin-filter-list-states#list-demo" : "/cases/admin-optimization#admin-role-tour"}>{matrix ? "操作需求对应的列表示例 →" : "查看截图所属后台案例 →"}</Link><Link href="/articles/launch-checklist#acceptance-evidence">对照验收证据 →</Link><Link href={matrix ? "/ai-workflows/screenshot-case-description" : "/ai-workflows/requirements-state-matrix"}>查看另一个实用工作流 →</Link></div></section>
    <KnowledgeLinks resources={resourcesForResource("AI 工作流", workflow.slug)} title="相关案例与图解" />
  </div>
}
