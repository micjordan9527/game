import type { MetadataRoute } from "next"
import { articles } from "@/data/articles"
import { caseItems } from "@/data/cases"
import { templates } from "@/data/templates"
import { designTopics } from "@/components/design/DesignExperienceHub"
import { aiWorkflows } from "@/data/aiWorkflowLibrary"
import { categories } from "@/data/categories"
import { sportsModules } from "@/data/sports"
import { absoluteUrl } from "@/lib/seo"
import { workRoles } from "@/data/workRoles"

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
      url: absoluteUrl("/articles"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: absoluteUrl("/cases"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    },
    { url: absoluteUrl("/design/states"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/updates"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    {
      url: absoluteUrl("/ai-workflows/codex-cases"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: absoluteUrl("/ai-workflows/figma-strategy"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: absoluteUrl("/ai-workflows/prompt-library"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65,
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
      .filter((item) => item.href.startsWith("/sports/"))
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
    ...caseItems.map((item) => ({
      url: absoluteUrl(item.href),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
    ...templates.map((template) => ({
      url: absoluteUrl(`/templates/${template.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...designTopics.map((topic) => ({
      url: absoluteUrl(`/design/${topic.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...workRoles.map((role) => ({
      url: absoluteUrl(`/roles/${role.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/articles/${article.slug}`),
      lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ]
}
