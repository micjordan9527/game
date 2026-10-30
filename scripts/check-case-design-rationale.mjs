import assert from "node:assert/strict"

export async function checkCaseDesignRationale(page, base, prefix, width) {
  const errors = []
  const onPageError = (error) => errors.push(error.message)
  const onConsole = (message) => {
    if (message.type() === "error" && /hydration|server rendered HTML|Minified React error/i.test(message.text())) errors.push(message.text())
  }
  const onResponse = (response) => {
    if (response.url().startsWith(base) && ["image", "script"].includes(response.request().resourceType()) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`)
  }
  const checkAnchor = async (selector, label) => {
    await page.evaluate(() => document.fonts?.ready)
    // Chromium versions differ in when fragment scrolling follows layout and media changes.
    // Observe its settled result without scrolling the target ourselves or imposing a pixel offset.
    const position = await page.evaluate((value) => new Promise((resolve) => {
      let previous, stableFrames = 0, frames = 0
      const measure = () => {
        const target = document.querySelector(value)
        const heading = target?.querySelector("h2")
        const targetRect = target?.getBoundingClientRect()
        const headingRect = heading?.getBoundingClientRect()
        const header = document.querySelector("body > header")
        const headerRect = header?.getBoundingClientRect()
        const snapshot = {
          scrollY,
          viewportHeight: innerHeight,
          documentHeight: document.documentElement.scrollHeight,
          targetTop: targetRect?.top,
          targetHeight: targetRect?.height,
          headingTop: headingRect?.top,
          headingBottom: headingRect?.bottom,
          headerBottom: Math.max(0, headerRect?.bottom ?? 0),
          headerPosition: header ? getComputedStyle(header).position : "absent",
          scrollMarginTop: target ? getComputedStyle(target).scrollMarginTop : "absent",
        }
        const unchanged = previous && ["scrollY", "targetTop", "headingTop", "documentHeight", "headerBottom"].every((key) => Math.abs(snapshot[key] - previous[key]) < .5)
        stableFrames = unchanged ? stableFrames + 1 : 0
        previous = snapshot
        if (stableFrames >= 8 || ++frames >= 240) resolve({ ...snapshot, stable: stableFrames >= 8 })
        else requestAnimationFrame(measure)
      }
      requestAnimationFrame(measure)
    }), selector)
    const diagnostic = `${label}: ${JSON.stringify(position)}`
    assert(position.stable, `Fragment scrolling and layout settle; ${diagnostic}`)
    assert(position.headingTop >= position.headerBottom - 2, `Anchor heading clears the actual header; ${diagnostic}`)
    assert(position.headingBottom <= position.viewportHeight + 2, `Anchor reveals the complete section heading; ${diagnostic}`)
    return position
  }
  const settle = () => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  page.on("pageerror", onPageError)
  page.on("console", onConsole)
  page.on("response", onResponse)
  try {
    for (const { kind, path, id, focus } of [
      { kind: "bm", path: "/cases/bm-optimization", id: "bm-design-rationale", focus: "status" },
      { kind: "u8", path: "/cases/competitor-analysis", id: "u8-design-rationale", focus: "profile" },
    ]) {
      // The shared runner's base already includes any deployment prefix.
      const response = await page.goto(base + path + "#" + id, { waitUntil: "networkidle" })
      assert.equal(response.status(), 200)
      const selector = `[data-case-rationale="${kind}"]`
      const section = page.locator(selector)
      await section.waitFor()
      await checkAnchor(selector, `Initial ${kind}/${width}px fragment`)
      assert.equal(await section.locator("ol > li").count(), 4)
      assert.equal(await section.locator("svg[data-cropped-image]").count(), 2)
      assert.equal(await section.locator("button").filter({ hasText: "放大这一局部" }).count(), 2)
      assert((await section.innerText()).includes("生成式"))
      const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `No horizontal page overflow ${kind}/${width}`)
      await noOverflow()
      await section.screenshot({ path: `/tmp/six-case-rationale-${kind}-${width}.png`, animations: "disabled", style: 'body > header { visibility: hidden !important; }' })
      const trigger = section.locator("button").filter({ hasText: "放大这一局部" }).first()
      await trigger.scrollIntoViewIfNeeded()
      await settle()
      const originalY = await page.evaluate(() => scrollY)
      await trigger.click()
      await page.getByRole("dialog", { name: /原界面/ }).waitFor()
      const modal = page.getByRole("dialog", { name: /原界面|生成式/ })
      assert.equal(await page.locator("body").evaluate((node) => node.style.position), "fixed")
      const image = modal.getByRole("region", { name: "图片浏览区域", exact: true }).locator("[data-gallery-image]")
      assert(await image.evaluate((node) => node.getBoundingClientRect().width <= node.parentElement.clientWidth + 1), "Fit mode uses the available width")
      await modal.getByRole("button", { name: "下一张", exact: true }).click()
      assert((await modal.locator("h2").innerText()).includes("生成式"))
      await modal.getByRole("button", { name: "原尺寸", exact: true }).click()
      assert.equal(await modal.getByRole("button", { name: "原尺寸", exact: true }).getAttribute("aria-pressed"), "true")
      await modal.getByRole("button", { name: "适应屏幕", exact: true }).click()
      await page.keyboard.press("Escape")
      await page.getByRole("dialog").waitFor({ state: "hidden" })
      await settle()
      assert(Math.abs(await page.evaluate(() => scrollY) - originalY) <= 2, `Escape restores reading position ${kind}/${width}`)
      assert(await trigger.evaluate((node) => document.activeElement === node), `Escape restores trigger focus ${kind}/${width}`)
      await trigger.click()
      await page.getByRole("dialog").getByRole("button", { name: "关闭", exact: true }).click()
      await settle()
      assert(Math.abs(await page.evaluate(() => scrollY) - originalY) <= 2, `Close button restores reading position ${kind}/${width}`)
      assert(await trigger.evaluate((node) => document.activeElement === node), `Close button restores trigger focus ${kind}/${width}`)
      await section.locator("nav a").first().click()
      await page.waitForURL((url) => url.pathname === prefix + path && url.searchParams.get("focus") === focus && url.hash === "#case-focus")
      await page.locator(`#case-focus [data-focus-id="${focus}"]`).waitFor()
      await noOverflow()
      await page.getByRole("navigation", { name: "案例位置", exact: true }).getByRole("link", { name: /设计取舍说明/ }).click()
      await page.waitForURL((url) => url.hash === "#" + id)
      await checkAnchor(selector, `Top-navigation ${kind}/${width}px fragment`)
      console.log(`PASS ${kind} design rationale ${width}px: local images, viewer position/focus, comparison and section links`)
    }
    assert.deepEqual(errors, [], "No script, hydration or same-origin image/script loading errors")
  } finally {
    page.off("pageerror", onPageError)
    page.off("console", onConsole)
    page.off("response", onResponse)
  }
}
