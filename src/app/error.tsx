"use client"

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-shell grid min-h-[60vh] place-items-center py-16">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold text-brand-700">页面加载异常</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink">这个页面暂时没有正常打开</h1>
        <p className="mt-4 text-base leading-8 text-muted">可以尝试重新加载。如果问题持续出现，通常是本地开发服务或缓存状态需要重启。</p>
        <button type="button" onClick={reset} className="mt-8 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
          重新加载
        </button>
      </div>
    </div>
  )
}
