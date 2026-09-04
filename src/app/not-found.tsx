import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container-shell grid min-h-[60vh] place-items-center py-16">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold text-brand-700">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink">页面没有找到</h1>
        <p className="mt-4 text-base leading-8 text-muted">这个内容可能还在整理中，或者链接已经变更。你可以回到首页、搜索全站内容，或继续查看术语库。</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            返回首页
          </Link>
          <Link href="/search" className="rounded-md border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:border-brand-100 hover:text-brand-700">
            全站搜索
          </Link>
        </div>
      </div>
    </div>
  )
}
