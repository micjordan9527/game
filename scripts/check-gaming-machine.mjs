import assert from "node:assert/strict"
import fs from "node:fs"
import ts from "typescript"

export async function checkGamingMachineModel() {
  const code = ts.transpileModule(fs.readFileSync("src/data/gamingMachine.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  const { machineSnapshot, machineParts, MACHINE_TICKET_ID } = await import("data:text/javascript;base64," + Buffer.from(code).toString("base64"))
  assert.equal(machineParts.length, 7)
  assert.deepEqual(Array.from({ length: 8 }, (_, n) => machineSnapshot(n).available), [0, 0, 100, 90, 90, 105, 0, 0])
  assert.equal(machineSnapshot(4).result, 15)
  assert.equal(machineSnapshot(4).returned, 0)
  for (const scenario of ["normal", "rejected", "paper-out"]) for (const recovered of [false, true]) for (const requested of [-5, 0, 1, 2, 3, 4, 5, 6, 7, 99, NaN, Infinity]) {
    const s = machineSnapshot(requested, scenario, recovered)
    assert.equal(s.accepted + s.returned, s.available + s.spent + s.pending + s.printed, "demonstration-unit conservation")
    for (const key of ["accepted", "returned", "available", "spent", "pending", "printed"]) assert(Number.isInteger(s[key]) && s[key] >= 0)
    if (scenario === "rejected") { assert.equal(s.accepted, 0); assert.equal(s.available, 0); assert.equal(s.ticketId, null) }
    if (s.ticketId) assert.equal(s.ticketId, MACHINE_TICKET_ID)
  }
  const failed = machineSnapshot(7, "paper-out"), retry = machineSnapshot(6, "paper-out", true), done = machineSnapshot(7, "paper-out", true)
  assert.equal(failed.step, 6); assert.equal(failed.pending, 105); assert.equal(failed.printed, 0); assert.equal(failed.canAdvance, false)
  assert.equal(retry.ticketId, failed.ticketId); assert.equal(done.ticketId, failed.ticketId); assert.equal(done.printed, 105); assert.equal(done.pending, 0); assert.equal(done.available, 0)
  const geometry = JSON.parse(fs.readFileSync("src/data/gamingMachineGeometry.json", "utf8"))
  assert.equal(geometry.solidCount, 75); assert.equal(geometry.parts.length, 75)
  for (const part of machineParts) { assert(geometry.parts.some((item) => item.part === part.id)); assert(geometry.zoom[part.id].split(" ").map(Number).every(Number.isFinite)) }
  console.log("PASS machine model: fixed balance path, unposted result, rejected note, original-voucher recovery and conserved nonnegative units")
}

export async function checkGamingMachine(page, base, prefix, width) {
  const href = "/articles/electronic-gaming-machine"
  await page.goto(base + href + "#machine-demo", { waitUntil: "networkidle" })
  const demo = page.locator("#machine-demo")
  await demo.waitFor()
  await page.locator("#article-details[open]").waitFor()
  assert((await page.locator("h1").innerText()).includes("电子游艺机主要部件与工作过程"))
  assert.equal(await demo.locator("[data-machine-name]").count(), 75)
  assert.equal(await demo.getByRole("group", { name: "选择主要部件" }).getByRole("button").count(), 7)
  assert.equal(await demo.getByRole("list", { name: "工作过程步骤" }).getByRole("button").count(), 8)
  await page.waitForFunction(() => document.querySelector("[data-machine-part][data-active='true']"))
  for (const [id, name] of [["screen", "显示屏"], ["controls", "操作按钮"], ["logic", "控制与记录"], ["validator", "纸币识别器"], ["cashbox", "纸币收纳箱"], ["printer", "票据打印机"], ["power", "电源与散热"]]) {
    const button = demo.getByRole("button", { name, exact: true })
    await button.focus(); await page.keyboard.press("Enter")
    await demo.locator(`[data-part-description="${id}"]`).waitFor()
    assert.equal(await button.getAttribute("aria-pressed"), "true")
    await demo.getByRole("button", { name: "放大当前部件", exact: true }).click()
    const zoomed = await demo.locator("[data-machine-art]").getAttribute("viewBox")
    assert.notEqual(zoomed, "0 0 560 640")
    await demo.getByRole("button", { name: "返回整体", exact: true }).click()
    assert.equal(await demo.locator("[data-machine-art]").getAttribute("viewBox"), "0 0 560 640")
  }
  await demo.locator('[data-machine-name="cashbox-body"]').click()
  await demo.locator('[data-part-description="cashbox"]').waitFor()
  const balances = [0, 0, 100, 90, 90, 105, 0, 0]
  for (let step = 0; step < 8; step++) {
    await page.waitForFunction((n) => document.querySelector("#machine-demo")?.getAttribute("data-step") === String(n), step)
    assert((await demo.locator("[data-machine-available]").innerText()).startsWith(String(balances[step])))
    if (step === 1) assert.equal(await demo.locator(".machine-note").isVisible(), true)
    if (step === 4) assert((await demo.locator("[data-machine-readout]").innerText()).includes("尚未入账"))
    if (step === 6) { assert((await demo.locator("[data-machine-pending]").innerText()).startsWith("105")); assert((await demo.locator("[data-machine-ticket]").innerText()).includes("EGM-DEMO-T001")) }
    if (step < 7) await demo.getByRole("button", { name: /^下一步：/ }).click()
  }
  assert.equal(await demo.locator(".machine-ticket").isVisible(), true)
  assert((await demo.locator("[data-machine-printed]").innerText()).startsWith("105"))
  assert.equal(await demo.getByRole("button", { name: "过程已结束", exact: true }).isDisabled(), true)
  await demo.getByRole("button", { name: "前一步", exact: true }).click()
  assert((await demo.locator("[data-machine-pending]").innerText()).startsWith("105"))
  await demo.getByRole("radio", { name: "纸币退回", exact: true }).check()
  await page.waitForFunction(() => document.querySelector("#machine-demo")?.getAttribute("data-rejected") === "true")
  assert((await demo.locator("[data-machine-available]").innerText()).startsWith("0")); assert.equal(await demo.locator(".machine-note").isVisible(), false)
  assert.equal(await demo.getByRole("button", { name: "本例止于退回", exact: true }).isDisabled(), true)
  await demo.getByRole("radio", { name: "出票缺纸", exact: true }).check()
  await demo.getByRole("alert").waitFor()
  assert((await demo.locator("[data-machine-pending]").innerText()).startsWith("105"))
  assert.equal(await demo.locator(".machine-ticket").isVisible(), false)
  const ticket = await demo.locator("[data-machine-ticket]").innerText()
  await demo.getByRole("button", { name: "补纸并重试原票据", exact: true }).click()
  await demo.getByRole("button", { name: "下一步：打印完成", exact: true }).click()
  assert((await demo.locator("[data-machine-ticket]").innerText()).includes("EGM-DEMO-T001")); assert(ticket.includes("EGM-DEMO-T001"))
  assert((await demo.locator("[data-machine-printed]").innerText()).startsWith("105")); assert((await demo.locator("[data-machine-available]").innerText()).startsWith("0"))
  await demo.getByRole("radio", { name: "正常过程", exact: true }).check()
  await demo.getByRole("button", { name: "自动播放", exact: true }).click()
  await page.waitForFunction(() => document.querySelector("#machine-demo")?.getAttribute("data-step") === "1", null, { timeout: 6500 })
  await demo.getByRole("button", { name: "暂停播放", exact: true }).click()
  const paused = await demo.getAttribute("data-step"); await page.waitForTimeout(4300); assert.equal(await demo.getAttribute("data-step"), paused)
  await demo.getByRole("button", { name: "从头再看", exact: true }).click()
  await page.emulateMedia({ reducedMotion: "reduce" })
  await demo.getByRole("button", { name: "下一步：识别纸币", exact: true }).click()
  // The shared reduced-motion rule uses 0.01ms, effectively still, rather than 0s.
  const moving = await demo.locator("[data-machine-art]").evaluate((svg) => [svg, ...svg.querySelectorAll("*")].filter((n) => getComputedStyle(n).animationName !== "none" || getComputedStyle(n).transitionDuration.split(",").some((v) => parseFloat(v) > 0.0001)).length)
  assert.equal(moving, 0)
  await page.emulateMedia({ reducedMotion: "no-preference" })
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
  const fonts = await demo.locator("button, p, dt, dd, label, legend").evaluateAll((nodes) => nodes.filter((n) => getComputedStyle(n).display !== "none").map((n) => parseFloat(getComputedStyle(n).fontSize)))
  assert(fonts.every((n) => n >= 14))
  await demo.screenshot({ path: `/tmp/gaming-machine-checked-${width}.png`, style: "body > header { visibility: hidden !important; }" })
  await page.goto(base + "/search?q=" + encodeURIComponent("电子游艺机") + "&type=" + encodeURIComponent("文章"), { waitUntil: "networkidle" })
  const result = page.locator(`main a[href="${prefix}${href}"]`)
  await result.evaluate((n) => n.scrollIntoView({ block: "center", behavior: "instant" }))
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const top = await page.evaluate(() => scrollY)
  await result.click(); await demo.waitFor(); await page.locator("#article-details[open]").waitFor()
  await page.goBack({ waitUntil: "networkidle" }); assert.equal(new URL(page.url()).searchParams.get("q"), "电子游艺机"); assert.equal(new URL(page.url()).searchParams.get("type"), "文章")
  await page.waitForFunction((top) => Math.abs(scrollY - top) < 8, top)
  await page.goto(base + "/articles?role=product&tag=" + encodeURIComponent("电子游艺机"), { waitUntil: "networkidle" })
  assert.equal(await page.locator("#article-results").getAttribute("data-selected-role"), "产品")
  assert.equal(await page.locator("#article-results").getAttribute("data-selected-tag"), "电子游艺机")
  await page.locator(`main a[href="${prefix}${href}"]`).first().waitFor()
  await page.goto(base + "/updates#electronic-gaming-machine", { waitUntil: "networkidle" })
  const row = page.locator("#electronic-gaming-machine")
  await row.waitFor(); await row.locator(`a[href="${prefix}${href}#machine-demo"]`).click(); await demo.waitFor()
  await page.goto(base + "/updates/demonstrations", { waitUntil: "networkidle" })
  await page.locator(`a[href="${prefix}${href}#machine-demo"]`).click(); await demo.waitFor()
  console.log(`PASS ${width}px machine: seven parts/zoom/keyboard, eight steps, two fault branches, original ticket, finite tour/pause, reduced motion, readable layout, search return and directory links`)
}

if (process.argv[1]?.endsWith("check-gaming-machine.mjs")) await checkGamingMachineModel()
