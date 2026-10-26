import Link from "next/link"
import { MobileNav } from "@/components/layout/MobileNav"
import { SiteLogo } from "@/components/layout/SiteLogo"
import { TopNavigation } from "@/components/layout/TopNavigation"

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
        <TopNavigation />
        <MobileNav />
      </div>
    </header>
  )
}
