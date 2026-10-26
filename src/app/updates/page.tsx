import type { Metadata } from "next"
import Link from "next/link"
import { knowledgeContentUpdates } from "@/data/knowledgeContentUpdates"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "更新记录",
  description: "逐项查看知识内容、主题图解和界面演示的变化及直接入口。",
  alternates: { canonical: absoluteUrl("/updates") },
}

const demonstrations = [
  { title: "钱包对账", href: "/articles/wallet-payment-reconciliation#reconciliation-case", description: "同一演示订单的订单列表、详情、通道、账务与差异；切换一致、缺流水、重复通知和未知结果。" },
  { title: "提现异常", href: "/articles/wallet-payment-reconciliation#withdrawal-case", description: "按原业务号查看审核、处理中、未知、退回和完成；区分可用、冻结与已付款金额。" },
  { title: "账号受限与恢复", href: "/articles/member-account-states#account-recovery-case", description: "从查询到复核、补充资料和恢复，分别观察账号、会话、资料与资金状态。" },
  { title: "代理跨期结算", href: "/articles/agent-system-design#agent-settlement-case", description: "查看会员归属、规则版本、结算批次和跨期调整，区分原记录与更正明细。" },
  { title: "BM 手机原型", href: "/cases/bm-optimization#bm-mobile-prototype", description: "切换运动与赛事状态、打开详情并返回，观察筛选保留和底部操作反馈。" },
  { title: "U8 个人中心原型", href: "/cases/competitor-analysis#u8-profile-prototype", description: "切换账号、资产、订单和服务，查看正常、加载、空结果、失败和受限五种状态。" },
  { title: "官网模块与响应式对照", href: "/cases/white-label-official#official-responsive-comparison", description: "服务展示、页面结构和咨询入口三组模块的桌面／手机实际页面截图，可打开大图。" },
  { title: "BM、U8 长图浏览", href: "/cases/bm-optimization", description: "在案例图集中打开大图，适应屏幕按可用宽度显示并纵向浏览；可切换原尺寸、上下张与缩略图。" },
  { title: "六种界面状态", href: "/design/states", description: "并列查看加载、空结果、失败、受限、处理中和未知结果，跳转到对应演示。" },
  { title: "搜索与详情往返", href: "/search", description: "按关键词与类型查资料；空搜索显示精选案例、图解与AI工作流；从详情返回保留查询和位置。" },
]

export default function UpdatesPage() {
  return (
    <div className="container-shell max-w-6xl py-10">
      <header>
        <p className="text-sm text-muted">2026-10-26</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">更新记录</h1>
        <p className="mt-3 max-w-3xl leading-8 text-muted">按条目查看内容变化与所在位置。文章页先展示主题图解，“查看详细说明”默认展开；每项均可直接打开正文重点或相关界面。</p>
        <nav aria-label="更新记录导航" className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-brand-700">
          <a href="#knowledge-content">知识内容与配图</a>
          <a href="#demonstrations">功能与演示入口</a>
        </nav>
      </header>
      <section id="knowledge-content" className="scroll-mt-24 pt-10" aria-labelledby="knowledge-content-title">
        <h2 id="knowledge-content-title" className="text-xl font-semibold">知识内容与配图 · {knowledgeContentUpdates.length} 项</h2>
        <p className="mt-2 text-sm leading-7 text-muted">本组配图均标明 GPT 生成示意图；正文中的演算与演示编号均为虚构说明，实际页面截图另附来源。</p>
        <ol className="mt-5 grid gap-4 md:grid-cols-2">
          {knowledgeContentUpdates.map((item, index) => (
            <li key={item.slug} id={item.slug} className="min-w-0 scroll-mt-24 rounded-xl border border-line bg-white p-5">
              <p className="text-xs font-semibold text-muted">{String(index + 1).padStart(2, "0")} · {item.kind}正文与主题图解</p>
              <h3 className="mt-2 font-semibold text-ink"><Link href={item.href}>{item.title}</Link></h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-brand-700">
                <Link href={item.href}>文章与配图 →</Link>
                <Link href={item.detailHref}>正文重点 →</Link>
                <Link href={item.relatedHref}>相关界面与说明 →</Link>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section id="demonstrations" className="scroll-mt-24 pt-10" aria-labelledby="demonstrations-title">
        <h2 id="demonstrations-title" className="text-xl font-semibold">功能与演示入口</h2>
        <p className="mt-2 text-sm leading-7 text-muted">已有功能集中列在这里，便于查找；本轮新增和补充的知识内容见上方条目。</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {demonstrations.map((item) => (
            <Link key={item.title} href={item.href} className="min-w-0 rounded-xl border border-line bg-white p-5 hover:border-brand-200">
              <h3 className="font-semibold text-ink">{item.title} →</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
