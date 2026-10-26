import assert from "node:assert/strict"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { chromium } from "playwright-core"
import { checkUnavailableStorage, checkWorkTools } from "./check-work-tools.mjs"
import { checkShowcase } from "./check-showcase.mjs"
import { checkHomepage } from "./check-homepage.mjs"
import { checkSiteUpdate } from "./check-site-update.mjs"
import { checkContentExpansion } from "./check-content-expansion.mjs"
import { checkAccountRecovery } from "./check-account-recovery.mjs"
import { checkBusinessCases, checkMobileCases } from "./check-completion.mjs"

const root = path.resolve("out")
const prefix = process.env.TEST_BASE_PATH ?? ""
const rounds = Number(process.env.REFRESH_ROUNDS ?? 2)
const scope = process.env.CHECK_SCOPE ?? "all"
assert(["all", "home", "site-update", "content", "account", "business", "mobile"].includes(scope), "Unsupported CHECK_SCOPE")
assert(Number.isInteger(rounds) && rounds > 0 && rounds <= 50, "REFRESH_ROUNDS must be between 1 and 50")
const contentTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".txt": "text/x-component",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
}

let server
let browser
try {
  let base = process.env.BASE_URL
  if (!base) {
    assert(fs.existsSync(path.join(root, "index.html")), "Build the static site before running the browser checks")
    server = http.createServer(async (request, response) => {
      try {
        const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname)
        if (prefix && pathname !== prefix && !pathname.startsWith(prefix + "/")) {
          response.writeHead(404).end()
          return
        }
        let filename = path.resolve(root, "." + (pathname.slice(prefix.length) || "/"))
        if (filename !== root && !filename.startsWith(root + path.sep)) {
          response.writeHead(404).end()
          return
        }
        if (
          fs.existsSync(filename) &&
          fs.statSync(filename).isDirectory() &&
          fs.existsSync(path.join(filename, "index.html"))
        )
          filename = path.join(filename, "index.html")
        if ((!fs.existsSync(filename) || fs.statSync(filename).isDirectory()) && fs.existsSync(filename + ".html"))
          filename += ".html"
        if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) {
          response.writeHead(404).end()
          return
        }
        const data = fs.readFileSync(filename)
        const ext = path.extname(filename)
        response.writeHead(200, {
          "Content-Type": contentTypes[ext] ?? "application/octet-stream",
          "Cache-Control": "no-cache",
        })
        const chunkDelay = Number(process.env.HTML_CHUNK_DELAY_MS ?? 0)
        if (ext === ".html" && chunkDelay > 0) {
          for (let start = 0; start < data.length && !response.destroyed; start += 8192) {
            response.write(data.subarray(start, start + 8192))
            await delay(chunkDelay)
          }
          response.end()
        } else response.end(data)
      } catch (error) {
        if (!response.headersSent) response.writeHead(500)
        response.end(String(error))
      }
    })
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
    base = `http://127.0.0.1:${server.address().port}${prefix}`
  }
  base = base.replace(/\/$/, "")
  const executablePath =
    process.env.CHROMIUM_EXECUTABLE ??
    ["/usr/bin/chromium", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"].find((candidate) =>
      fs.existsSync(candidate)
    )
  assert(executablePath, "Set CHROMIUM_EXECUTABLE to an installed Chromium or Chrome browser")
  const proxy = process.env.BROWSER_PROXY ? { server: process.env.BROWSER_PROXY } : undefined
  browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox"], proxy })
  const errors = []
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      proxy,
      permissions: ["clipboard-read", "clipboard-write"],
      acceptDownloads: true,
    })
    // Private legacy backends are outside the static-site checks. Local CI stays offline;
    // deployed checks retain the site's ordinary public embeds and their loading order.
    await context.route("**/*", (route) => {
      const url = new URL(route.request().url())
      if (url.hostname === "aurora.test" || url.hostname.endsWith(".aurora.test")) return route.abort()
      if (process.env.BASE_URL || url.origin === new URL(base).origin || !["http:", "https:"].includes(url.protocol))
        return route.continue()
      return route.abort()
    })
    context.on("page", (page) => {
      page.on("pageerror", (error) => errors.push({ url: page.url(), message: error.message }))
      page.on("console", (message) => {
        if (message.type() === "error" && /hydration|server rendered HTML|Minified React error/i.test(message.text()))
          errors.push({ url: page.url(), message: message.text() })
      })
      page.on("response", (response) => {
        if (
          new URL(response.url()).origin === new URL(base).origin &&
          ["script", "image"].includes(response.request().resourceType()) &&
          response.status() >= 400
        )
          errors.push({ url: response.url(), message: `Asset HTTP ${response.status()}` })
      })
    })
    const page = await context.newPage()
    await checkHomepage(page, base, prefix, width)
    if (scope === "business" || scope === "all") await checkBusinessCases(page, base, prefix, width)
    if (scope === "mobile" || scope === "all") await checkMobileCases(page, base, prefix, width)
    if (scope === "account" || scope === "all") await checkAccountRecovery(page, base, prefix, width)
    if (scope === "content" || scope === "all") await checkContentExpansion(page, base, prefix, width)
    if (scope === "site-update" || scope === "all") await checkSiteUpdate(page, base, prefix, width)
    if (scope === "all") {
      await checkShowcase(page, base, prefix, width, rounds)
      await checkWorkTools(page, base, prefix, width)
      if (width === 390) await checkUnavailableStorage(context, base)
    }
    await context.close()
  }
  assert.deepEqual(errors, [], "Browser initialization or script failures:\n" + JSON.stringify(errors, null, 2))
  console.log("Production navigation checks passed without hydration warnings.")
} finally {
  await browser?.close()
  await new Promise((resolve) => (server ? server.close(resolve) : resolve()))
}
