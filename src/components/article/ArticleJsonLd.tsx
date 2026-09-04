import type { Article } from "@/data/articles"
import { absoluteUrl, siteTitle } from "@/lib/seo"

export function ArticleJsonLd({ article }: { article: Article }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updatedAt ?? article.date,
    author: {
      "@type": "Organization",
      name: siteTitle,
    },
    publisher: {
      "@type": "Organization",
      name: siteTitle,
    },
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}`),
    keywords: article.tags.join(", "),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "文章", item: absoluteUrl(`/articles/${article.slug}`) },
      { "@type": "ListItem", position: 3, name: article.title, item: absoluteUrl(`/articles/${article.slug}`) },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  )
}
