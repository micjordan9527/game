import Image from "next/image"
import { siteName } from "@/lib/site"

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-line ${className}`}>
      <Image src="/images/brand/baowang-knowledge-logo.png" alt="包网知识库标志" width={72} height={72} className="h-full w-full object-cover" priority />
    </span>
  )
}

export function SiteLogo({ hideText = false }: { hideText?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <LogoMark />
      <span className={hideText ? "sr-only" : "truncate text-base font-semibold tracking-normal text-ink"}>{siteName}</span>
    </span>
  )
}
