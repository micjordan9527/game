# Prompt 4：数据模型

请使用以下 TypeScript 数据模型组织 mock 数据。

```ts
export type Category = {
  slug: string
  title: string
  description: string
  icon?: string
  color?: string
  articleCount?: number
}

export type Article = {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  audience: string[]
  difficulty: "入门" | "进阶" | "专业"
  cover?: string
  date?: string
}

export type GlossaryTerm = {
  id: string
  term: string
  category: string
  shortDescription: string
  commonScene: string
  relatedFeatures: string[]
  misunderstanding?: string
  relatedArticles?: string[]
}

export type TemplateItem = {
  slug: string
  title: string
  description: string
  category: string
  sections: {
    title: string
    items: string[]
  }[]
}
```

请读取并使用：

- `src/data/categories.ts`
- `src/data/articles.ts`
- `src/data/glossary.ts`
- `src/data/templates.ts`
