import Link from "next/link"

export function ArticleBreadcrumbs({ title, parents }: { title: string; parents: { href: string; label: string }[] }) {
  return <nav aria-label="文章位置" className="mb-4 text-xs leading-6 text-muted">
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {parents.map((parent) => <li key={parent.href} className="contents"><Link href={parent.href} className="font-semibold text-brand-700">{parent.label}</Link><span aria-hidden="true">/</span></li>)}
      <li className="min-w-0 max-w-full"><span aria-current="page" className="line-clamp-1">{title}</span></li>
    </ol>
  </nav>
}
