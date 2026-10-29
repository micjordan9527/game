import assert from "node:assert/strict"

export async function checkTgCaseDetails(page, base, prefix, width) {
  const sourcePath = `${prefix}/images/operations/tg-material-message-reference.webp`
  await page.goto(base + "/articles/tg-message-media#tg-case-details", { waitUntil: "networkidle" })
  await page.getByRole("heading", { level: 1, name: "TG频道推送：图片与视频展示", exact: true }).waitFor()
  const details = page.locator("#tg-case-details")
  await details.waitFor()
  await details.getByRole("heading", { level: 2, name: "TG推送截图", exact: true }).waitFor()
  assert(await details.evaluate((node) => node.closest("details") === null), "The screenshots are directly visible without an expandable ancestor")
  assert.equal(await page.locator("details#article-details, main #article-content").count(), 0, "TG has no old details or Markdown module")
  for (const name of ["推送位置对照", "核对这三个位置", "查看详细说明"]) {
    assert.equal(await page.getByRole("heading", { name, exact: true }).count(), 0)
  }
  assert.equal(await page.locator("main summary").filter({ hasText: /^查看详细说明$/ }).count(), 0)
  assert(await details.evaluate((node) => {
    const box = node.getBoundingClientRect()
    return document.getElementById("tg-message-demo").getBoundingClientRect().bottom <= box.top + 1 && box.bottom <= document.getElementById("tg-materials").getBoundingClientRect().top + 1
  }), "Screenshots sit after the video preview and before materials")
  for (const id of ["tg-output-examples", "tg-check-points", "article-details"]) {
    const alias = page.locator("#" + id)
    assert.equal(await alias.count(), 1)
    assert(await alias.evaluate((node) => !node.textContent.trim() && !node.querySelector("h1,h2,h3,img,svg,video,details") && Math.abs(node.getBoundingClientRect().top - document.getElementById("tg-case-details").getBoundingClientRect().top) < 120), "A historical anchor stays near the gallery without restoring its old module")
  }
  const gallery = details.getByRole("region", { name: "TG群消息案例原图与局部", exact: true })
  const cards = gallery.locator(":scope > article")
  assert.equal(await cards.count(), 4, "One complete reference and three source crops")
  assert.equal(await gallery.locator("img[data-gallery-image]").count(), 1)
  assert.equal(await gallery.locator("svg[data-cropped-image]").count(), 3)
  const text = await details.innerText()
  assert(text.includes("另一个群消息案例") && /不是.*双狮主题官方频道截图/.test(text), "The material reference is identified as a separate case, not the missing official-channel screenshot")
  assert(/20:00/.test(text) && /22:00/.test(text))
  assert(/1[＋+]2[＋+]2/.test(await cards.nth(1).innerText()) && (await cards.nth(1).innerText()).includes("不是下方22:00消息的按钮"))
  assert(/立即体验/.test(await cards.nth(2).innerText()) && /海报内部.*不能.*TG独立按钮/s.test(await cards.nth(2).innerText()))
  assert(/输入框遮挡.*不能.*补造/s.test(await cards.nth(3).innerText()))
  assert.equal(await details.getByRole("link", { name: "下载这张案例截图", exact: true }).getAttribute("href"), sourcePath)
  assert.equal(await page.locator(`#tg-original-post img[src="${sourcePath}"]`).count(), 0, "This case does not fill the missing user-original slot")

  const decode = async (image) => {
    const state = await image.evaluate(async (node) => {
      const cropped = node.tagName.toLowerCase() === "svg"
      const loaded = cropped ? new Image() : node
      if (cropped) loaded.src = node.querySelector("image").getAttribute("href")
      await loaded.decode()
      const box = cropped ? node.viewBox.baseVal : null
      return { src: loaded.currentSrc || loaded.src, width: loaded.naturalWidth, height: loaded.naturalHeight, crop: box ? { x: box.x, y: box.y, width: box.width, height: box.height } : null }
    })
    assert.equal(new URL(state.src).pathname, sourcePath)
    assert.deepEqual([state.width, state.height], [896, 1280], "The actual reference WEBP decodes at its original size")
    if (state.crop) {
      const c = state.crop
      assert(c.x >= 0 && c.y >= 0 && c.width > 0 && c.height > 0 && c.x + c.width <= state.width && c.y + c.height <= state.height, "Crop stays inside the real source image")
    }
    return state.crop ? state.crop.height / state.crop.width : state.height / state.width
  }
  for (let index = 0; index < 4; index++) {
    const card = cards.nth(index)
    const title = (await card.getByRole("heading", { level: 3 }).innerText()).trim()
    await card.locator("[data-gallery-image]").scrollIntoViewIfNeeded()
    await decode(card.locator("[data-gallery-image]"))
    assert.equal(await card.getByRole("link", { name: "查看原图", exact: true }).getAttribute("href"), sourcePath)
    const trigger = card.getByRole("button", { name: /查看完整长图|放大这一局部/ })
    const control = trigger.getByText(index === 0 ? "查看完整长图" : "放大这一局部", { exact: true })
    await control.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const top = await page.evaluate(() => scrollY)
    const button = await trigger.elementHandle()
    try {
      await control.click()
      const dialog = page.getByRole("dialog", { name: title, exact: true })
      await dialog.waitFor()
      const viewport = dialog.getByRole("region", { name: "图片浏览区域", exact: true })
      const image = viewport.locator("[data-gallery-image]")
      const ratio = await decode(image)
      assert.equal(await dialog.getByRole("button", { name: "适应屏幕", exact: true }).getAttribute("aria-pressed"), "true")
      const fit = async () => {
        const box = await image.boundingBox()
        const size = await viewport.evaluate((node) => {
          const style = getComputedStyle(node)
          return { width: node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight), overflowsX: node.scrollWidth > node.clientWidth + 1 }
        })
        assert(Math.abs(box.width - size.width) <= 1, "Fit mode fills the available width")
        assert(Math.abs(box.height / box.width - ratio) < .01, "Fit mode preserves the original or crop aspect ratio")
        assert.equal(size.overflowsX, false)
      }
      await fit()
      if (index === 0) {
        await dialog.getByRole("button", { name: "原尺寸", exact: true }).click()
        assert(Math.abs((await image.boundingBox()).width - 896) <= 1)
        assert(await viewport.evaluate((node) => { node.scrollTop = 100; return node.scrollHeight > node.clientHeight && node.scrollTop > 0 }), "The full reference scrolls inside the viewer")
        await dialog.getByRole("button", { name: "适应屏幕", exact: true }).click()
        await fit()
      }
      if (index === 0) await page.keyboard.press("Escape")
      else await dialog.getByRole("button", { name: "关闭", exact: true }).click()
      await dialog.waitFor({ state: "hidden" })
      await page.waitForFunction(({ button, top }) => document.body.style.position !== "fixed" && document.activeElement === button && Math.abs(scrollY - top) < 8, { button, top })
    } finally {
      await button.dispose()
    }
  }
  await page.goto(base + "/articles/form-validation-submit-feedback", { waitUntil: "networkidle" })
  await page.locator("#article-details[open] #article-content").waitFor()
  console.log(`PASS TG screenshots ${width}px: direct video-to-gallery-to-materials layout, removed old modules with nearby historical anchors, real 896×1280 reference and three bounded crops, width-fit/scroll and close restoration; other article details remain open and missing user-original state is unchanged`)
}
