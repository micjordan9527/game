import assert from "node:assert/strict"

const ticket = "DC-DEMO-T001"

async function frame(page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
}

async function sameViewport(page, demo, width) {
  await frame(page)
  const bottomOfHeader = await page.locator("body > header").evaluate((node) => node.getBoundingClientRect().bottom)
  const height = page.viewportSize().height
  const critical = [
    demo.getByRole("navigation", { name: "设备操作情景", exact: true }),
    demo.getByRole("group", { name: "查看设备部位", exact: true }),
    demo.locator("[data-device-main-art]"),
    demo.locator("[data-device-screen]"),
    demo.locator("[data-device-explanation]"),
    demo.locator("[data-device-actions]"),
  ]
  for (const node of critical) {
    const box = await node.boundingBox()
    assert(box && box.y >= bottomOfHeader - 1 && box.y + box.height <= height - 8,
      `Device selector, art, explanation and actions share the viewport: ${JSON.stringify({ width, height, bottomOfHeader, box })}`)
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "No page overflow")
}

async function phase(demo, value) {
  await demo.locator(`[data-device-phase="${value}"]`).waitFor()
}

async function expectCounters(demo, requests, tickets) {
  const screen = demo.locator("[data-device-screen]")
  const values = await screen.locator("dl > div").evaluateAll((nodes) => Object.fromEntries(nodes.map((node) => [node.querySelector("dt").textContent, node.querySelector("dd").textContent])))
  assert.equal(values["操作请求"], `${requests} 次`)
  assert.equal(values["票据记录"], `${tickets} 张`)
}

async function focused(page, label) {
  await page.waitForFunction((text) => document.activeElement?.textContent?.trim() === text, label)
}

export async function checkDeviceControls(page, base, prefix, width) {
  const original = page.viewportSize()
  const errors = []
  const record = (error) => errors.push(error.message)
  page.on("pageerror", record)
  try {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(base + "/articles/device-controls-feedback#device-controls-view", { waitUntil: "networkidle" })
    const section = page.locator("#device-controls-demo")
    const demo = section.locator("#device-controls-view")
    await demo.waitFor()
    await page.locator("#article-details[open]").waitFor()
    assert((await page.locator("h1").innerText()).includes("设备控制面板与操作反馈"))
    const parts = demo.getByRole("group", { name: "查看设备部位", exact: true })
    const scenarios = demo.getByRole("navigation", { name: "设备操作情景", exact: true })
    assert.equal(await parts.getByRole("button").count(), 3)
    assert.equal(await scenarios.getByRole("button").count(), 4)
    const ids = await demo.locator("svg [id]").evaluateAll((nodes) => nodes.map((node) => node.id))
    assert.equal(new Set(ids).size, ids.length, "Main and overview SVG clipping IDs stay unique")
    const boxes = new Set()
    for (const [id, name, explanation] of [["screen", "显示屏", "当前状态"], ["controls", "主按钮", "主操作与票据操作分区"], ["printer", "票据出口", "缺纸提示对应票据出口"]]) {
      const button = parts.getByRole("button", { name, exact: true })
      await button.focus(); await page.keyboard.press("Enter")
      await page.waitForFunction(({ id }) => document.querySelector(`[data-device-main-art] [data-machine-part="${id}"][data-control-active="true"]`), { id })
      assert.equal(await button.getAttribute("aria-pressed"), "true")
      assert((await demo.locator("[data-device-explanation]").innerText()).includes(explanation), "Selected-part purpose remains visible on phones")
      boxes.add(await demo.locator("[data-device-main-art] svg").getAttribute("viewBox"))
      await sameViewport(page, demo, width)
    }
    assert.equal(boxes.size, 3, "Three meaningful local views")

    // Use a visible piece of the display at the top of the control-area crop.
    await parts.getByRole("button", { name: "主按钮", exact: true }).click()
    const point = await demo.locator("[data-device-main-art]").evaluate((root) => {
      const box = root.getBoundingClientRect()
      for (let y = box.top + 3; y < box.bottom - 3; y += 6) for (let x = box.left + 3; x < box.right - 3; x += 6) {
        const hit = document.elementFromPoint(x, y)?.closest("[data-machine-part]")
        if (hit?.getAttribute("data-machine-part") === "screen") return { x, y }
      }
      return null
    })
    assert(point, "A visible neighbouring display part can be selected in the SVG")
    await page.mouse.click(point.x, point.y)
    assert.equal(await parts.getByRole("button", { name: "显示屏", exact: true }).getAttribute("aria-pressed"), "true")

    await scenarios.getByRole("button", { name: "正常操作", exact: true }).click()
    await sameViewport(page, demo, width)
    await expectCounters(demo, 0, 0)
    await demo.screenshot({ path: `/tmp/device-controls-ready-${width}.png` })
    await demo.getByRole("button", { name: "开始演示", exact: true }).click()
    await phase(section, "running")
    const disabledMain = demo.getByRole("button", { name: "执行中 · 请等待", exact: true })
    assert(await disabledMain.isDisabled(), "The busy button is semantically disabled")
    await disabledMain.evaluate((node) => node.click())
    await expectCounters(demo, 1, 0)
    await sameViewport(page, demo, width)
    await demo.getByRole("button", { name: "查看完成状态", exact: true }).click()
    await phase(section, "done")
    await expectCounters(demo, 1, 0)
    await sameViewport(page, demo, width)

    await scenarios.getByRole("button", { name: "处理中禁用", exact: true }).click()
    await phase(section, "running")
    await expectCounters(demo, 1, 0)
    assert(await demo.getByRole("button", { name: "执行中 · 请等待", exact: true }).isDisabled())
    await sameViewport(page, demo, width)
    await demo.screenshot({ path: `/tmp/device-controls-busy-${width}.png` })

    await scenarios.getByRole("button", { name: "误触隔离", exact: true }).click()
    await demo.getByRole("button", { name: "输出示例票据", exact: true }).click()
    await phase(section, "confirm")
    await focused(page, "确认输出")
    await expectCounters(demo, 0, 0)
    await sameViewport(page, demo, width)
    await demo.getByRole("button", { name: "取消", exact: true }).click()
    await phase(section, "ready")
    await focused(page, "输出示例票据")
    await expectCounters(demo, 0, 0)
    await demo.getByRole("button", { name: "输出示例票据", exact: true }).click()
    await demo.getByRole("button", { name: "确认输出", exact: true }).click()
    await phase(section, "printed")
    await page.waitForFunction(() => document.activeElement?.hasAttribute("data-device-screen"))
    await expectCounters(demo, 0, 1)
    assert((await demo.locator("[data-device-screen]").innerText()).includes(ticket))
    assert(await demo.getByRole("button", { name: "输出示例票据", exact: true }).isDisabled())
    await sameViewport(page, demo, width)

    await scenarios.getByRole("button", { name: "出票缺纸", exact: true }).click()
    await phase(section, "paperout")
    await expectCounters(demo, 0, 1)
    const pending = await demo.locator("[data-device-screen]").innerText()
    assert(pending.includes(ticket) && pending.includes("待打印"))
    await sameViewport(page, demo, width)
    await demo.screenshot({ path: `/tmp/device-controls-paperout-${width}.png` })
    await demo.getByRole("button", { name: "模拟补纸", exact: true }).click()
    await phase(section, "retry")
    await expectCounters(demo, 0, 1)
    await focused(page, "重试原票据")
    assert((await demo.locator("[data-device-screen]").innerText()).includes(ticket))
    await sameViewport(page, demo, width)
    await demo.getByRole("button", { name: "重试原票据", exact: true }).click()
    await phase(section, "printed")
    await page.waitForFunction(() => document.activeElement?.hasAttribute("data-device-screen"))
    await expectCounters(demo, 0, 1)
    const printed = await demo.locator("[data-device-screen]").innerText()
    assert(printed.includes(ticket) && printed.includes("已打印"))
    await sameViewport(page, demo, width)
    await demo.screenshot({ path: `/tmp/device-controls-printed-${width}.png` })

    await page.emulateMedia({ reducedMotion: "reduce" })
    await scenarios.getByRole("button", { name: "正常操作", exact: true }).click()
    await parts.getByRole("button", { name: "票据出口", exact: true }).click()
    const moving = await demo.locator("[data-device-main-art] svg").evaluate((svg) => [svg, ...svg.querySelectorAll("*")].filter((node) => {
      const css = getComputedStyle(node)
      return css.animationName !== "none" && css.animationDuration.split(",").some((v) => parseFloat(v) > .0001) || css.transitionDuration.split(",").some((v) => parseFloat(v) > .0001)
    }).length)
    assert.equal(moving, 0, "Reduced motion leaves a readable, interactive still diagram")
    await sameViewport(page, demo, width)
    assert.equal(await section.locator(`a[href="${prefix}/articles/electronic-gaming-machine#machine-view"]`).count(), 1)
    assert.deepEqual(errors, [], "No device-page script errors")
    console.log(`PASS device controls ${width}px: three parts and SVG selection, four scenarios, single request, confirmation/cancel/focus, same-ticket recovery, unique SVG IDs, viewport, reduced motion and open details`)
  } finally {
    page.off("pageerror", record)
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await page.setViewportSize(original)
  }
}
