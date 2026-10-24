import Link from "next/link"
import { Search } from "lucide-react"
import { MobileNav } from "@/components/layout/MobileNav"
import { SiteLogo } from "@/components/layout/SiteLogo"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-6 px-4">
        <Link href="/" className="min-w-0 shrink-0">
          <span className="hidden sm:block">
            <SiteLogo />
          </span>
          <span className="sm:hidden">
            <SiteLogo hideText />
          </span>
        </Link>
        <div className="hidden min-w-0 flex-1 xl:block" />
        <div className="hidden items-center gap-1 xl:flex">
          <Link href="/cases" className="rounded-md px-2.5 py-2 text-sm font-medium text-muted hover:bg-paper">
            作品案例
          </Link>
          <Link href="/articles" className="rounded-md px-2.5 py-2 text-sm font-medium text-muted hover:bg-paper">
            功能图解
          </Link>
          <Link href="/ai-workflows" className="rounded-md px-2.5 py-2 text-sm font-medium text-muted hover:bg-paper">
            AI 成果
          </Link>
          <Link
            href="/design/material-standards"
            className="rounded-md px-2.5 py-2 text-sm font-medium text-muted hover:bg-paper"
          >
            素材规范
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-muted hover:bg-paper hover:text-ink"
            aria-label="全站搜索"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>搜索</span>
          </Link>
          <Link
            href="/glossary"
            className="rounded-md px-2.5 py-2 text-sm font-medium text-muted hover:bg-paper hover:text-ink"
          >
            术语库
          </Link>
          <Link
            href="/templates"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-paper hover:text-ink"
          >
            模板库
          </Link>
        </div>
        <MobileNav />
      </div>
    </header>
  )
}
