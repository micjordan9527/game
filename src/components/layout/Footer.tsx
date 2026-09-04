import Link from "next/link"
import { categories } from "@/data/categories"
import { navItems } from "@/lib/site"
import { SiteLogo } from "@/components/layout/SiteLogo"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-white">
      <div className="container-shell grid gap-10 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <SiteLogo />
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
            用白话解释、专业拆解和模板沉淀，帮助产品、运营、设计、技术团队理解包网平台、后台系统和项目交付资料。
          </p>
          <p className="mt-4 text-xs leading-6 text-muted">
            本站以行业知识科普、产品理解和项目资料沉淀为主，内容保持中性、审慎和可查证。
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">知识栏目</div>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            {categories.slice(0, 5).map((category) => (
              <Link key={category.slug} href={`/${category.slug}`} className="hover:text-brand-700">
                {category.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">快速入口</div>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            {navItems.slice(-3).map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-brand-700">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
