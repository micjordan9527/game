import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const articleData = fs.readFileSync(path.join(root, "src/data/articles.ts"), "utf8")
const templateData = fs.readFileSync(path.join(root, "src/data/templates.ts"), "utf8")
const caseDataPath = path.join(root, "src/data/cases.ts")
const caseData = fs.existsSync(caseDataPath) ? fs.readFileSync(caseDataPath, "utf8") : ""
const imagePromptData = fs.readFileSync(path.join(root, "src/data/imagePrompts.ts"), "utf8")
const categoryVisualDataPath = path.join(root, "src/data/categoryVisuals.ts")
const categoryVisualData = fs.existsSync(categoryVisualDataPath) ? fs.readFileSync(categoryVisualDataPath, "utf8") : ""
const contentDir = path.join(root, "content/articles")
const publicSourceDirs = ["src/app", "src/components", "src/lib", "content/articles"]

const articleSlugs = [...articleData.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1])
const templateSlugs = [...templateData.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1])
const caseSlugs = [...caseData.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1])
const imagePaths = [
  ...new Set([...`${imagePromptData}\n${categoryVisualData}`.matchAll(/imageSrc(?:Webp|Avif)?:\s*"([^"]+)"/g)].map((match) => match[1])),
]
const casePreviewPaths = [...caseData.matchAll(/previewSrc:\s*"([^"]+)"/g)].map((match) => match[1])
const forbidden = [
  "*** Add File",
  "*** End Patch",
  "GPT Image",
  "提示词",
  "建议配图",
  "图解建议",
  "mock 数据",
  "TODO",
  "FIXME",
]
const publicSourceForbidden = [
  "查看 GPT Image",
  "GPT Image 提示词",
  "mock 数据",
  "Lorem ipsum",
  "Route Static",
  "Try Turbopack",
  "Next.js Dev Tools",
  "TODO",
  "FIXME",
]

const errors = []

function checkDuplicates(values, label) {
  const seen = new Set()
  for (const value of values) {
    if (seen.has(value)) errors.push(`${label} duplicate slug: ${value}`)
    seen.add(value)
  }
}

checkDuplicates(articleSlugs, "article")
checkDuplicates(templateSlugs, "template")
checkDuplicates(caseSlugs, "case")

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath))
      continue
    }

    if (/\.(md|ts|tsx)$/.test(entry.name)) files.push(fullPath)
  }

  return files
}

for (const slug of articleSlugs) {
  const file = path.join(contentDir, `${slug}.md`)
  if (!fs.existsSync(file)) {
    errors.push(`missing article markdown: ${slug}`)
    continue
  }

  const markdown = fs.readFileSync(file, "utf8")
  for (const word of forbidden) {
    if (markdown.includes(word)) errors.push(`forbidden text "${word}" in ${slug}.md`)
  }
  if (!/^---[\s\S]+?---/.test(markdown)) errors.push(`missing frontmatter: ${slug}.md`)
  if (!markdown.includes("## 一句话解释")) errors.push(`missing 一句话解释: ${slug}.md`)
  if (!markdown.includes("## 风险与注意事项")) errors.push(`missing 风险与注意事项: ${slug}.md`)
}

for (const imagePath of imagePaths) {
  const file = path.join(root, "public", imagePath.replace(/^\//, ""))
  if (!fs.existsSync(file)) errors.push(`missing image asset: ${imagePath}`)
}

for (const previewPath of casePreviewPaths) {
  const file = path.join(root, "public", previewPath.replace(/^\//, ""))
  if (!fs.existsSync(file)) errors.push(`missing case preview asset: ${previewPath}`)
}

for (const dir of publicSourceDirs) {
  for (const file of walkFiles(path.join(root, dir))) {
    const source = fs.readFileSync(file, "utf8")
    const relativePath = path.relative(root, file)

    for (const word of publicSourceForbidden) {
      if (source.includes(word)) errors.push(`public-source forbidden text "${word}" in ${relativePath}`)
    }
  }
}

if (!templateData.includes("roles:")) errors.push("templates missing roles metadata")
if (!templateData.includes("useCases:")) errors.push("templates missing useCases metadata")
if (!templateData.includes("cautions:")) errors.push("templates missing cautions metadata")

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"))
  process.exit(1)
}

console.log(`Content check passed: ${articleSlugs.length} articles, ${templateSlugs.length} templates, ${caseSlugs.length} cases, ${imagePaths.length} images.`)
