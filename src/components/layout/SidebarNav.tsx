"use client"

import { usePathname } from "next/navigation"
import { ContentNavigation } from "@/components/layout/ContentNavigation"
import { getContentNavigation } from "@/lib/content-navigation"

export function SidebarNav() {
  const pathname = usePathname()
  if (!getContentNavigation(pathname).length) return null
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-line/80 bg-white/75 px-4 py-5 backdrop-blur xl:block">
      <nav className="h-full overflow-y-auto pr-1" aria-label="知识库导航">
        <ContentNavigation pathname={pathname} />
      </nav>
    </aside>
  )
}
