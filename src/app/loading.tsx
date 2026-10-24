export default function LoadingPage() {
  return (
    <section className="container-shell py-12" role="status" aria-label="页面加载">
      <p className="text-sm font-semibold text-brand-700">正在加载资料…</p>
      <div className="mt-6 space-y-4" aria-hidden="true">
        <div className="h-8 w-2/3 rounded-md bg-paper" />
        <div className="h-32 rounded-lg border border-line bg-paper" />
        <div className="h-20 rounded-lg border border-line bg-paper" />
      </div>
    </section>
  )
}
