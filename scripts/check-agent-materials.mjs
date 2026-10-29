import assert from "node:assert/strict"

export async function checkAgentMaterials(page, base, prefix, width) {
  const materialUrl = base.replace(/\/$/, "") + "/design/material-standards?module=banner"
  const assetPath = `${prefix}/case-assets/material-standards/index.html`
  const workspace = page.locator("[data-material-workspace]")
  const iframe = workspace.locator("iframe")
  const frame = workspace.frameLocator("iframe")
  const ready = async () => {
    await frame.locator("#material-workspace-style").waitFor({ state: "attached" })
    await iframe.waitFor({ state: "visible" })
    await frame.locator(".page").waitFor({ state: "visible" })
  }
  const currentModule = () => frame.locator(".page").evaluate(() => location.hash)
  const assertFits = async () => {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "Material workspace stays within the host viewport")
    const dimensions = await frame.locator("body").evaluate((body) => ({
      overflowsX: body.scrollWidth > innerWidth + 1,
      overflowsY: body.scrollHeight > innerHeight + 1,
      contentOverflow: getComputedStyle(body.querySelector(".page")).overflowY,
    }))
    assert.equal(dimensions.overflowsX, false, "Embedded material center has no horizontal overflow")
    assert.equal(dimensions.overflowsY, false, "Only the inner content scrolls vertically")
    assert.equal(dimensions.contentOverflow, "auto")
  }

  const response = await page.goto(materialUrl, { waitUntil: "networkidle" })
  assert.equal(response.status(), 200)
  await ready()
  await workspace.getByRole("heading", { name: "代理素材规范", exact: true }).waitFor()
  assert.equal(await page.locator("aside [data-context-navigation]").count(), 0, "No duplicate knowledge sidebar beside the material center")
  assert.equal(await iframe.getAttribute("src"), assetPath + "#banner", "Legacy module query maps to the iframe hash")
  assert.equal(await currentModule(), "#banner")
  const completeLink = workspace.getByRole("link", { name: "新窗口打开", exact: true })
  assert.equal(await completeLink.getAttribute("href"), assetPath + "#banner")
  assert.equal(await completeLink.getAttribute("target"), "_blank")
  await assertFits()
  const bounds = await iframe.boundingBox()
  const viewport = page.viewportSize()
  assert(bounds.height > 0 && Math.abs(bounds.y + bounds.height - viewport.height) < 2, "Iframe fills the remaining viewport height")

  if (width <= 800) {
    await frame.getByRole("button", { name: "素材目录", exact: true }).click()
    await frame.getByRole("button", { name: "品牌标识", exact: true }).click()
    await frame.getByRole("button", { name: "品牌 Logo", exact: true }).click()
    await frame.locator('.material-menu-toggle[aria-expanded="false"]').waitFor()
    assert.equal(await currentModule(), "#brand-logo", "Phone menu reaches a different group and module")
    assert.equal(await frame.locator(".page").evaluate((node) => node.inert), false)
    await frame.getByRole("button", { name: "素材目录", exact: true }).click()
    await page.keyboard.press("Escape")
    await frame.locator('.material-menu-toggle[aria-expanded="false"]').waitFor()
  }

  await frame.locator("[data-site-search]").fill("全民代理")
  await frame.locator('.search-result[data-target="all-agent"]').click()
  assert.equal(await currentModule(), "#all-agent", "Material search opens the matching module")
  const figmaLink = frame.locator('a.figma[href^="https://www.figma.com/"]').first()
  await figmaLink.waitFor()
  const figmaUrl = new URL(await figmaLink.getAttribute("href"))
  assert.equal(figmaUrl.protocol, "https:")
  assert.equal(figmaUrl.hostname, "www.figma.com")
  assert(/^\/(design|file)\/[^/]+/.test(figmaUrl.pathname), "Figma entry points to an actual file")
  assert.equal(await figmaLink.getAttribute("target"), "_blank")
  await frame.locator(".page:not(.page-transition-in)").waitFor()

  const hostTop = await page.evaluate(() => scrollY)
  // Activate the real image handler without scrolling the outer page to center a large image.
  await frame.locator("img.preview-zoomable").first().evaluate(async (image) => {
    await image.decode()
    image.click()
  })
  const lightbox = frame.locator(".image-lightbox")
  await frame.locator(".image-lightbox.is-open").waitFor({ state: "visible" })
  assert(await lightbox.locator("img").evaluate(async (image) => {
    await image.decode()
    return image.naturalWidth > 0
  }), "Image viewer displays a loaded image")
  await page.keyboard.press("Escape")
  await lightbox.waitFor({ state: "hidden" })
  await page.waitForFunction((top) => Math.abs(scrollY - top) < 2, hostTop)
  await assertFits()

  const frameElement = await iframe.elementHandle()
  const embeddedFrame = await frameElement.contentFrame()
  await frameElement.dispose()
  await Promise.all([
    embeddedFrame.waitForNavigation({ waitUntil: "load" }),
    embeddedFrame.evaluate(() => location.reload()),
  ])
  await ready()
  assert.equal(await currentModule(), "#all-agent", "Iframe refresh retains its module")
  await assertFits()

  const interceptAsset = (url) => url.origin === new URL(base).origin && url.pathname === assetPath
  const unavailable = (route) => route.fulfill({ status: 404, contentType: "text/html", body: "<!doctype html><html><body>Unavailable</body></html>" })
  await page.route(interceptAsset, unavailable)
  try {
    await page.goto(materialUrl, { waitUntil: "networkidle" })
    const fallback = workspace.getByRole("status")
    await fallback.getByText("素材中心暂时无法显示，可以在新窗口打开完整规范。", { exact: true }).waitFor()
    const fallbackLink = fallback.getByRole("link", { name: "打开完整规范", exact: true })
    assert.equal(await fallbackLink.getAttribute("href"), assetPath + "#banner")
    assert.equal(await fallbackLink.getAttribute("target"), "_blank")
  } finally {
    await page.unroute(interceptAsset, unavailable)
    await page.goto(materialUrl, { waitUntil: "networkidle" })
    await ready()
  }
  assert.equal(await currentModule(), "#banner", "Temporary failure interception is removed")
  console.log(`PASS agent materials ${width}px: legacy module URL, one directory, viewport workspace, phone navigation, search/Figma, image viewer, iframe refresh and recoverable 404 fallback`)
}
