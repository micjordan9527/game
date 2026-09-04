import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { Footer } from "@/components/layout/Footer"
import { absoluteUrl, siteDescription, siteTitle, siteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteTitle} | 平台系统与项目资料库`,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${siteTitle} | 平台系统与项目资料库`,
    description: siteDescription,
    url: absoluteUrl("/"),
    siteName: siteTitle,
    locale: "zh_CN",
    type: "website",
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630 }],
  },
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <div className="mx-auto flex w-full max-w-[1440px]">
          <SidebarNav />
          <div className="min-w-0 flex-1">
            <main>{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}
