import Link from "next/link"
import { SiteLogo } from "@/components/layout/SiteLogo"
export function Footer() {
  return (
    <footer className="mt-10 border-t border-line bg-white">
      <div className="container-shell py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SiteLogo />
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {[
              ["/cases", "案例"],
              ["/articles", "功能图解"],
              ["/ai-workflows", "AI成果"],
              ["/design/material-standards", "素材规范"],
              ["/templates", "工作模板"],
            ].map(([href, title]) => (
              <Link key={href} href={href} className="hover:text-brand-700">
                {title}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs leading-6 text-muted">包网产品、运营、设计与技术资料。</p>
      </div>
    </footer>
  )
}
