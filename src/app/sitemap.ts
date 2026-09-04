import type { MetadataRoute } from "next"
import { articles } from "@/data/articles"
import { aiWorkflows } from "@/data/aiWorkflowLibrary"
import { categories } from "@/data/categories"
import { sportsModules } from "@/data/sports"
import { absoluteUrl } from "@/lib/seo"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/glossary"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/templates"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/ai-workflows"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/sports"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...sportsModules
      .filter((item) => item.status === "已开放")
      .map((item) => ({
        url: absoluteUrl(item.href),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.78,
      })),
    ...aiWorkflows.map((workflow) => ({
      url: absoluteUrl(`/ai-workflows/${workflow.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.78,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ]
}
