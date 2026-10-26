import fs from "node:fs"
import { spawnSync } from "node:child_process"

const env = { ...process.env, NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://baowang-knowledge.aurora-5448.chatgpt.site", REFRESH_ROUNDS: process.env.REFRESH_ROUNDS ?? "1", CHECK_SCOPE: "all" }
const report = { checkedAt: new Date().toISOString(), status: "running", viewports: [1440, 390], checks: [] }
const save = () => { fs.mkdirSync(".openai", { recursive: true }); fs.writeFileSync(".openai/validation-report.json", JSON.stringify(report, null, 2) + "\n") }
const npm = process.platform === "win32" ? "npm.cmd" : "npm"
try {
  const { chromium } = await import(env.PLAYWRIGHT_MODULE ?? "playwright-core")
  const executable = env.CHROMIUM_EXECUTABLE ?? ["/usr/bin/chromium", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", chromium.executablePath()].find((file) => fs.existsSync(file))
  if (!executable || !fs.existsSync(executable)) throw new Error("Browser verification requires Chromium/Chrome. Install with npx playwright-core install --with-deps chromium, or set CHROMIUM_EXECUTABLE to an existing browser.")
  env.CHROMIUM_EXECUTABLE = executable
  for (const [name, command, args] of [["content", npm, ["run", "check:content"]], ["production-build", npm, ["run", "build"]], ["export-integrity", process.execPath, ["scripts/check-release-integrity.mjs"]], ["browser-regression", process.execPath, ["scripts/check-browser.mjs"]]]) {
    const started = Date.now()
    const result = spawnSync(command, args, { env, stdio: "inherit" })
    report.checks.push({ name, status: result.status === 0 ? "passed" : "failed", durationMs: Date.now() - started })
    if (result.status !== 0) throw result.error ?? new Error(name + " failed (exit " + result.status + ")")
    save()
  }
  report.status = "passed"
  save()
  console.log("Release checks passed. Validation report: .openai/validation-report.json")
} catch (error) {
  report.status = "failed"
  report.error = error.message
  save()
  console.error(error.message)
  process.exitCode = 1
}
