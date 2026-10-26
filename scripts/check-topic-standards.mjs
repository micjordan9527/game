import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import ts from "typescript"

// Inspect literal metadata without executing the data modules.
function readLiteral(node) {
  if (ts.isStringLiteral(node)) return node.text
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(readLiteral)
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(
      node.properties
        .filter(ts.isPropertyAssignment)
        .map((property) => [property.name.getText().replace(/^['"]|['"]$/g, ""), readLiteral(property.initializer)])
    )
  }
  return undefined
}

function readRecords(root, file, name) {
  const source = ts.createSourceFile(file, fs.readFileSync(path.join(root, file), "utf8"), ts.ScriptTarget.Latest, true)
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue
    const declaration = statement.declarationList.declarations.find((item) => item.name.getText(source) === name)
    let initializer = declaration?.initializer
    if (initializer && (ts.isAsExpression(initializer) || ts.isSatisfiesExpression(initializer)))
      initializer = initializer.expression
    if (initializer && ts.isObjectLiteralExpression(initializer)) return readLiteral(initializer)
    if (!initializer || !ts.isArrayLiteralExpression(initializer)) continue
    return initializer.elements.filter(ts.isObjectLiteralExpression).map(readLiteral)
  }
  throw new Error(`Cannot read literal metadata ${file}:${name}`)
}

function normalize(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value
}

export function checkTopicStandards(root, errors) {
  const articles = readRecords(root, "src/data/articles.ts", "articles")
  const templates = readRecords(root, "src/data/templates.ts", "templates")
  const cases = readRecords(root, "src/data/cases.ts", "caseItems")
  const workflows = readRecords(root, "src/data/aiWorkflowLibrary.ts", "aiWorkflows")
  const glossary = readRecords(root, "src/data/glossary.ts", "glossary")
  const topics = readRecords(root, "src/data/knowledgeTopics.ts", "knowledgeTopics")
  const categories = readRecords(root, "src/data/categories.ts", "categories")
  const roles = readRecords(root, "src/data/workRoles.ts", "workRoles")
  const designTopics = readRecords(root, "src/components/design/DesignExperienceHub.tsx", "designTopics")
  const visuals = readRecords(root, "src/data/imagePrompts.ts", "imagePrompts")
  const flows = readRecords(root, "src/data/articleFlows.ts", "articleFlows")
  const showcase = readRecords(root, "src/data/showcase.ts", "showcaseItems")
  const sports = readRecords(root, "src/data/sports.ts", "sportsModules")
  const home = readRecords(root, "src/data/homeContent.ts", "homeContent")
  for (const article of articles) {
    if (!visuals.some((image) => image.articleSlug === article.slug) && !flows[article.slug]?.steps?.length)
      errors.push(`article ${article.slug}: missing visual explanation`)
  }
  for (const image of [
    ...showcase.map((item) => item.cover),
    ...sports.map((item) => `/images/showcase/sports/${item.slug}.jpg`),
  ]) {
    if (typeof image !== "string" || !fs.existsSync(path.join(root, "public", image.slice(1))))
      errors.push(`showcase: missing preview ${image}`)
  }
  const ids = {
    articles: new Set(articles.map((item) => item.slug)),
    templates: new Set(templates.map((item) => item.slug)),
    cases: new Set(cases.map((item) => item.slug)),
    workflows: new Set(workflows.map((item) => item.slug)),
  }
  const studies = readRecords(root, "src/data/caseStudies.ts", "caseStudies")
  if (new Set(studies.map((study) => study.slug)).size !== studies.length) errors.push("case studies: duplicate slug")
  for (const slug of ["admin-optimization", "bm-optimization"]) {
    if (!studies.some((study) => study.slug === slug)) errors.push(`case study missing: ${slug}`)
  }
  for (const study of studies) {
    const label = `case study ${study.slug}`
    if (!ids.cases.has(study.slug)) errors.push(`${label}: unknown case`)
    for (const key of ["materialType", "evidenceNote", "context", "exercise"]) {
      if (typeof study[key] !== "string" || !study[key].trim()) errors.push(`${label}: missing ${key}`)
    }
    for (const key of ["originalStructure", "roles", "changes", "checklist", "sources"]) {
      if (!Array.isArray(study[key]) || study[key].length === 0) errors.push(`${label}: missing ${key}`)
    }
    for (const change of study.changes ?? []) {
      for (const key of ["title", "observation", "evidence", "reasoning", "verification"]) {
        if (typeof change[key] !== "string" || !change[key].trim()) errors.push(`${label}: change missing ${key}`)
      }
    }
    for (const source of study.sources ?? []) {
      if (typeof source.href !== "string" || !source.href.startsWith("/case-assets/")) {
        errors.push(`${label}: invalid material source`)
        continue
      }
      const pathname = new URL(source.href, "https://knowledge001.netlify.app").pathname
      if (!fs.existsSync(path.join(root, "public", pathname.slice(1))))
        errors.push(`${label}: missing material ${source.href}`)
    }
    for (const [key, known] of [
      ["relatedArticles", ids.articles],
      ["relatedTemplates", ids.templates],
      ["relatedWorkflows", ids.workflows],
    ]) {
      for (const slug of study[key] ?? []) {
        if (!known.has(slug)) errors.push(`${label}: unknown ${key} reference ${slug}`)
      }
    }
  }
  for (const topic of topics) {
    for (const [kind, known] of Object.entries(ids)) {
      for (const slug of topic[kind] ?? []) {
        if (!known.has(slug)) errors.push(`topic ${topic.slug}: unknown ${kind} reference ${slug}`)
      }
    }
  }

  const routes = new Set([
    "/",
    "/glossary",
    "/articles",
    "/templates",
    "/cases",
    "/search",
    "/updates",
    "/ai-workflows",
    ...articles.map((item) => `/articles/${item.slug}`),
    ...templates.map((item) => `/templates/${item.slug}`),
    ...cases.map((item) => item.href),
    ...categories.map((item) => `/${item.slug}`),
    ...roles.map((item) => `/roles/${item.slug}`),
    ...designTopics.map((item) => `/design/${item.slug}`),
    ...fs
      .readdirSync(path.join(root, "src/app/design"), { withFileTypes: true })
      .filter((item) => item.isDirectory() && fs.existsSync(path.join(root, "src/app/design", item.name, "page.tsx")))
      .map((item) => `/design/${item.name}`),
    ...workflows.map((item) => `/ai-workflows/${item.slug}`),
  ])
  routes.add("/sports")
  for (const [name, selected, known] of [
    ["cases", home.caseSlugs, ids.cases],
    ["workflows", home.workflowSlugs, ids.workflows],
    ["diagrams", home.diagrams.map((item) => item.slug), new Set(visuals.map((item) => item.slug))],
  ]) {
    if (selected.length !== 2 || new Set(selected).size !== 2)
      errors.push(`homepage ${name}: expected two unique selections`)
    for (const slug of selected) if (!known.has(slug)) errors.push(`homepage ${name}: unknown resource ${slug}`)
  }
  if (home.topics.length !== 6) errors.push("homepage: expected six business topics")
  for (const link of [...home.topics, ...home.quickLinks]) {
    if (!routes.has(new URL(link.href, "https://knowledge001.netlify.app").pathname)) errors.push(`homepage: unknown destination ${link.href}`)
  }
  if (new Set(roles.map((role) => role.slug)).size !== 5 || roles.length !== 5)
    errors.push("role paths: expected five unique roles")
  for (const role of roles) {
    for (const key of ["title", "summary", "goal", "handoff"])
      if (!role[key]?.trim()) errors.push(`role ${role.slug}: missing ${key}`)
    if (!roles.some((item) => item.slug === role.nextRole)) errors.push(`role ${role.slug}: unknown next role`)
    if (!role.steps?.length || !role.outputs?.length) errors.push(`role ${role.slug}: missing steps or outputs`)
    for (const step of role.steps ?? []) {
      if (!routes.has(step.href)) errors.push(`role ${role.slug}: unknown destination ${step.href}`)
      if (![step.title, step.description, step.kind].every((value) => typeof value === "string" && value.trim()))
        errors.push(`role ${role.slug}: incomplete step`)
    }
  }
  const glossaryIds = new Set(glossary.map((item) => item.id))
  const requiredHeadings = [
    "一句话解释",
    "适合谁看",
    "学习路径",
    "概念与边界",
    "状态与处理",
    "流程图",
    "虚构示例",
    "异常场景",
    "评审检查清单",
    "相关资料",
    "风险与注意事项",
  ]
  for (const slug of ["member-account-states", "agent-system-design"]) {
    const filename = path.join(root, "content/articles", `${slug}.md`)
    if (!fs.existsSync(filename)) {
      errors.push(`standard topic missing: ${slug}`)
      continue
    }
    const { data, content } = matter(fs.readFileSync(filename, "utf8"))
    const entry = articles.find((item) => item.slug === slug)
    for (const key of ["title", "description", "category", "tags", "audience", "difficulty", "date", "updatedAt"]) {
      if (data[key] === undefined || !entry || JSON.stringify(normalize(data[key])) !== JSON.stringify(entry[key]))
        errors.push(`${slug}: frontmatter ${key} differs from article metadata`)
    }
    for (const key of ["date", "updatedAt"]) {
      const value = normalize(data[key])
      if (
        typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !Number.isFinite(Date.parse(value)) ||
        new Date(value).toISOString().slice(0, 10) !== value
      )
        errors.push(`${slug}: invalid ${key}`)
    }
    if (normalize(data.updatedAt) < normalize(data.date)) errors.push(`${slug}: updatedAt precedes date`)
    let previous = -1
    for (const heading of requiredHeadings) {
      const position = content.indexOf(`\n## ${heading}\n`)
      if (position < 0) errors.push(`${slug}: missing standard heading ${heading}`)
      else if (position <= previous) errors.push(`${slug}: standard heading out of order ${heading}`)
      previous = position
    }
    if (/^#\s/m.test(content)) errors.push(`${slug}: body duplicates page h1`)
    if (!content.includes("```mermaid\n")) errors.push(`${slug}: missing Mermaid flow`)
    if (!content.includes("- [ ] ")) errors.push(`${slug}: missing review checklist`)
    if (!content.includes("虚构") || !content.includes("教学")) errors.push(`${slug}: missing teaching-example label`)
    for (const [, href] of content.matchAll(/\]\((\/[^\s)]+)\)/g)) {
      const url = new URL(href, "https://knowledge001.netlify.app")
      if (!routes.has(url.pathname)) errors.push(`${slug}: unknown internal link ${href}`)
      if (url.pathname === "/glossary" && url.hash && !glossaryIds.has(url.hash.slice(1)))
        errors.push(`${slug}: unknown glossary anchor ${href}`)
    }
  }
}
