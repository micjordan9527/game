import assert from "node:assert/strict"

export async function checkTgOperations(page, base, prefix, width) {
  const articlePath = "/articles/tg-message-media"
  const mediaPath = "/videos/operations/tg-message-demo.mp4"
  const posterPath = "/images/operations/tg-message-poster.jpg"
  const articleCard = () => page.locator("#article-results article").filter({ has: page.locator(`a[href="${prefix}${articlePath}"]`) })
  const noOverflow = async () => {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, page.url())
  }
  const imageLoaded = async (image) => {
    await image.scrollIntoViewIfNeeded()
    assert(await image.evaluate(async (node) => { await node.decode(); return node.naturalWidth > 0 && node.naturalHeight > 0 }), "Poster loads")
    assert.equal(new URL(await image.getAttribute("src"), base).pathname, prefix + posterPath)
  }
  const originalImageLoaded = async (image, expected) => {
    assert.equal(await image.count(), 1, "The original-post section has one actual image")
    await image.scrollIntoViewIfNeeded()
    const actual = await image.evaluate(async (node) => {
      await node.decode()
      return { src: node.currentSrc, width: node.naturalWidth, height: node.naturalHeight, declaredWidth: Number(node.getAttribute("width")), declaredHeight: Number(node.getAttribute("height")) }
    })
    const url = new URL(actual.src)
    assert.equal(url.origin, new URL(base).origin, "The supplied original screenshot is a local asset")
    assert(url.pathname.startsWith(prefix + "/"), "The original screenshot respects the site base path")
    assert.equal(new URL(await image.getAttribute("src"), base).href, actual.src, "The displayed image uses its actual source")
    assert(/\.(?:png|jpe?g|webp|avif)$/i.test(url.pathname), "The original is an image file")
    assert(!/\/tg-message-(?:poster|cover)\./i.test(url.pathname), "A video frame or generated cover cannot stand in for the original post")
    assert(actual.width > 0 && actual.height > 0, "The original image decodes")
    assert.deepEqual([actual.width, actual.height], [actual.declaredWidth, actual.declaredHeight], "Original dimensions match the supplied file")
    const result = { src: actual.src, width: actual.width, height: actual.height }
    if (expected) assert.deepEqual(result, expected, "Enlargement uses the same original file")
    return result
  }
  const videoLoaded = async (video) => {
    await video.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
    const handle = await video.elementHandle()
    const owner = await handle.ownerFrame()
    try {
      try {
        await owner.waitForFunction((node) => node.readyState >= 1 && node.videoWidth > 0, handle)
      } catch (error) {
        const diagnostics = await video.evaluate((node) => ({
          readyState: node.readyState,
          networkState: node.networkState,
          currentSrc: node.currentSrc,
          errorCode: node.error?.code ?? null,
          errorMessage: node.error?.message ?? null,
          canPlayType: node.canPlayType('video/mp4; codecs="avc1.64001f, mp4a.40.2"'),
          userAgent: navigator.userAgent,
        })).catch((diagnosticError) => ({ diagnosticError: String(diagnosticError) }))
        throw new Error("TG video metadata timeout: " + JSON.stringify(diagnostics), { cause: error })
      }
      const metadata = await video.evaluate((node) => ({ src: node.currentSrc, poster: node.poster, width: node.videoWidth, height: node.videoHeight, duration: node.duration, controls: node.controls }))
      assert.equal(new URL(metadata.src).pathname, prefix + mediaPath)
      assert.equal(new URL(metadata.poster).pathname, prefix + posterPath)
      assert.deepEqual([metadata.width, metadata.height], [1280, 720])
      assert(Math.abs(metadata.duration - 9.056) < .15, `Expected the original nine-second clip, got ${metadata.duration}s`)
      assert.equal(metadata.controls, true)
    } finally {
      await handle.dispose()
    }
  }
  const progress = async (video) => {
    const handle = await video.elementHandle()
    const owner = await handle.ownerFrame()
    try {
      const before = await video.evaluate((node) => node.currentTime)
      await owner.waitForFunction(({ node, before }) => !node.paused && Math.abs(node.currentTime - before) > .2, { node: handle, before })
    } finally {
      await handle.dispose()
    }
  }
  const staysPaused = async (video) => {
    const pausedAt = await video.evaluate((node) => node.currentTime)
    await page.waitForTimeout(300)
    assert(await video.evaluate((node) => node.paused), "Paused video is not restarted")
    assert(Math.abs(await video.evaluate((node) => node.currentTime) - pausedAt) < .08, "Paused video stops advancing")
  }
  const playAndPause = async (video) => {
    await videoLoaded(video)
    // Space uses the native media control, including inside the material iframe.
    if (!(await video.evaluate((node) => node.paused))) await video.press("Space")
    await video.press("Space")
    await progress(video)
    await video.press("Space")
    await staysPaused(video)
  }
  const scrollAwayAndBack = async (video) => {
    const handle = await video.elementHandle()
    try {
      await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }))
      await page.waitForFunction((node) => {
        const box = node.getBoundingClientRect()
        return (box.bottom <= 0 || box.top >= innerHeight) && node.paused
      }, handle)
      await video.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
      await staysPaused(video)
    } finally {
      await handle.dispose()
    }
  }
  const uniqueScenes = async () => {
    const scenes = page.locator("section[data-operation-scenes]")
    assert.equal(await scenes.count(), 1, "One operation-scene entry section")
    const hrefs = await scenes.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    assert.equal(new Set(hrefs).size, hrefs.length, "Each operation scene has one entry")
    assert.equal(await scenes.locator(`a[href="${prefix}${articlePath}#tg-message-demo"]`).count(), 1)
    return scenes
  }
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto(base, { waitUntil: "networkidle" })
  await page.getByRole("navigation", { name: "按角色看图解", exact: true }).getByRole("link", { name: "运营", exact: true }).click()
  await page.waitForURL((url) => url.pathname === prefix + "/articles" && url.searchParams.get("role") === "operation")
  await page.locator('#article-results[data-selected-role="运营"][data-selected-tag="全部"]').waitFor()
  await uniqueScenes()
  assert.equal(await articleCard().count(), 1, "Operations readers can find the TG article")

  const tagDetails = page.locator("details[data-article-tags]")
  if (!(await tagDetails.evaluate((node) => node.open))) await tagDetails.locator("summary").click()
  await page.getByRole("group", { name: "标签筛选", exact: true }).locator('button[data-filter-value="TG推送"]').click()
  await page.waitForURL((url) => url.searchParams.get("role") === "operation" && url.searchParams.get("tag") === "TG推送")
  const filtered = '#article-results[data-selected-role="运营"][data-selected-tag="TG推送"]'
  await page.locator(filtered).waitFor()
  assert.equal(await page.locator("[data-operation-scenes]").count(), 0, "Tag filtering keeps the matching article list")
  const cover = articleCard().locator("img")
  await cover.scrollIntoViewIfNeeded()
  assert.deepEqual(await cover.evaluate(async (node) => { await node.decode(); return [node.naturalWidth, node.naturalHeight] }), [1600, 1000], "TG card has its actual message preview")
  const heading = articleCard().locator("h3")
  await heading.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const returnTop = await page.evaluate(() => scrollY)
  assert(returnTop > 0, "Reading-position check starts scrolled")
  await heading.click()
  await page.waitForURL((url) => url.pathname === prefix + articlePath)
  await page.locator("#tg-message-demo").waitFor()
  const articleText = await page.locator("main").innerText()
  assert(!/豆包|生成工具/.test(articleText), "Public copy describes the content without generation-tool labels")
  assert(!/运营素材示例|海洋主题素材更新|三份运营产出/.test(articleText), "The invented channel, message and output copy has been removed")

  const demo = page.locator("#tg-message-demo")
  const modes = demo.getByRole("group", { name: "媒体展示方式", exact: true })
  const still = modes.getByRole("button", { name: "静态封面", exact: true })
  const dynamic = modes.getByRole("button", { name: "动态视频", exact: true })
  assert.equal(await dynamic.getAttribute("aria-pressed"), "true", "Video is the default media mode")
  assert.equal(await demo.getByText("U Game｜官方频道", { exact: true }).count(), 1)
  const messageButtons = demo.locator('[aria-label="原截图的五个按钮"]').getByRole("button")
  assert.equal(await messageButtons.count(), 5)
  const buttonNames = await messageButtons.allTextContents()
  assert.deepEqual(buttonNames.map((text) => text.trim()), ["🌐 官方网址", "💌 官方客服", "📱 APP下载", "🤝 官方代理", "🤖 官方飞投"])
  const buttonBoxes = await messageButtons.evaluateAll((nodes) => nodes.map((node) => {
    const box = node.getBoundingClientRect()
    return { top: box.top, bottom: box.bottom, left: box.left, right: box.right, width: box.width }
  }))
  assert(Math.abs(buttonBoxes[0].top - buttonBoxes[1].top) < 2 && Math.abs(buttonBoxes[2].top - buttonBoxes[3].top) < 2, "The first two button rows each contain two buttons")
  assert(buttonBoxes[2].top >= buttonBoxes[0].bottom && buttonBoxes[4].top >= buttonBoxes[2].bottom, "The five buttons occupy three rows")
  assert(Math.abs(buttonBoxes[4].left - buttonBoxes[0].left) < 2 && Math.abs(buttonBoxes[4].right - buttonBoxes[1].right) < 2, "The last button spans the full row")
  const video = demo.getByLabel("TG推送动态视频示例", { exact: true })
  await videoLoaded(video)
  assert(await video.evaluate((node) => node.muted), "First-visible playback is muted")
  // Scrolling the default player into view must start the real clip without a play call.
  await progress(video)
  await scrollAwayAndBack(video)
  await playAndPause(video)
  await scrollAwayAndBack(video)

  const enlarged = page.getByRole("dialog", { name: "TG素材放大预览", exact: true })
  const checkViewer = async (isVideo, trigger = demo.getByRole("button", { name: "放大查看", exact: true }), checkImage = imageLoaded) => {
    await trigger.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    const top = await page.evaluate(() => scrollY)
    const button = await trigger.elementHandle()
    try {
      await trigger.click()
      await enlarged.waitFor({ state: "visible" })
      if (isVideo) await videoLoaded(enlarged.locator("video"))
      else await checkImage(enlarged.locator("img"))
      assert(await enlarged.evaluate((node) => { const box = node.getBoundingClientRect(); return box.left >= -1 && box.right <= innerWidth + 1 && node.scrollWidth <= node.clientWidth + 1 }), "Enlarged media fits the viewport")
      await noOverflow()
      if (isVideo) await page.keyboard.press("Escape")
      else await enlarged.getByRole("button", { name: "关闭放大预览", exact: true }).click()
      await enlarged.waitFor({ state: "hidden" })
      await page.waitForFunction(({ button, top }) => document.activeElement === button && Math.abs(scrollY - top) < 8, { button, top })
    } finally {
      await button.dispose()
    }
  }
  await checkViewer(true)
  assert(await video.evaluate((node) => node.paused), "Closing enlargement does not restart the main player")
  await still.click()
  assert.equal(await still.getAttribute("aria-pressed"), "true")
  await imageLoaded(demo.locator(`img[src="${prefix}${posterPath}"]`))
  assert.equal(await demo.locator("video").count(), 0, "Static mode replaces the player with the poster")
  await checkViewer(false)
  await dynamic.click()
  assert.equal(await dynamic.getAttribute("aria-pressed"), "true")
  await videoLoaded(video)
  await noOverflow()
  await demo.screenshot({ path: `/tmp/tg-message-demo-${width}.png`, style: "body > header { visibility: hidden !important; }" })
  for (const id of ["tg-case-details", "tg-materials"]) {
    await page.locator("#" + id).scrollIntoViewIfNeeded()
    await noOverflow()
  }
  const originalPost = page.locator("#tg-original-post")
  let originalScreenshot = null
  if (await originalPost.count()) {
    assert.equal(await originalPost.count(), 1)
    originalScreenshot = await originalImageLoaded(originalPost.locator("img"))
    await checkViewer(false, originalPost.getByRole("button", { name: "放大原TG截图", exact: true }), async (image) => {
      await originalImageLoaded(image, originalScreenshot)
      assert(await image.evaluate((node) => {
        const box = node.getBoundingClientRect()
        const dialog = node.closest("dialog")
        return Math.abs(box.width - dialog.clientWidth) < 4 && Math.abs(box.height / box.width - node.naturalHeight / node.naturalWidth) < .01
      }), "The original fits the viewer width while preserving its full aspect ratio")
    })
    await noOverflow()
  } else {
    console.log(`PENDING TG original screenshot ${width}px: no supplied original image; source, dimensions and enlargement have not been verified`)
  }

  await page.goBack({ waitUntil: "networkidle" })
  const returned = new URL(page.url())
  assert.equal(returned.pathname, prefix + "/articles")
  assert.equal(returned.searchParams.get("role"), "operation")
  assert.equal(returned.searchParams.get("tag"), "TG推送")
  await page.locator(filtered).waitFor()
  assert.equal(await page.getByRole("group", { name: "角色筛选", exact: true }).locator('button[data-filter-value="运营"]').getAttribute("aria-pressed"), "true")
  await page.waitForFunction((top) => Math.abs(scrollY - top) < 8 && document.querySelector("details[data-article-tags]")?.open === true, returnTop)

  let directory
  if (width < 1280) {
    await page.locator("body > header").getByRole("button", { name: "打开导航", exact: true }).click()
    directory = page.getByRole("dialog", { name: "知识库导航", exact: true }).locator("[data-context-navigation]")
  } else directory = page.locator("aside [data-context-navigation]")
  const topics = directory.locator("section").filter({ has: page.getByRole("heading", { name: "按主题浏览", exact: true }) })
  const topicHrefs = await topics.locator(":scope > ul > li > a").evaluateAll((links) => links.map((link) => link.getAttribute("href")))
  assert.equal(topicHrefs.length, 8, "Keep the eight existing knowledge topics")
  assert.equal(new Set(topicHrefs).size, 8, "No duplicate knowledge topics")
  const operationTopic = topics.locator(`a[href="${prefix}/operation"]`)
  assert.equal(await operationTopic.count(), 1)
  assert((await operationTopic.innerText()).includes("运营场景"))
  await operationTopic.click()
  await page.getByRole("heading", { level: 1, name: "运营场景", exact: true }).waitFor()
  if (width < 1280) await page.getByRole("dialog", { name: "知识库导航", exact: true }).waitFor({ state: "hidden" })
  const scenes = await uniqueScenes()
  await noOverflow()
  await scenes.locator(`a[href="${prefix}${articlePath}#tg-message-demo"]`).click()
  await page.locator("#tg-message-demo").waitFor()
  await page.locator(`#tg-materials a[href="${prefix}/design/material-standards?module=tg-assets"]`).click()

  const workspace = page.locator("[data-material-workspace]")
    assert.equal(await workspace.getByRole("link", { name: "新窗口打开", exact: true }).getAttribute("href"), `${prefix}/design/material-standards?module=tg-assets`, "TG opens the same video-enabled workspace in a new window")
  const iframe = workspace.locator("iframe")
  const frame = workspace.frameLocator("iframe")
  await frame.locator("#material-workspace-style").waitFor({ state: "attached" })
  await iframe.waitFor({ state: "visible" })
  await frame.locator('[data-tg-message-media] video').waitFor()
  const selectModule = async (slug, group, title) => {
    if (width <= 800 && await frame.locator(".material-menu-toggle").getAttribute("aria-expanded") !== "true") {
      await frame.getByRole("button", { name: "素材目录", exact: true }).click()
    }
    const target = frame.locator(`.nav [data-target="${slug}"]`)
    const parent = frame.locator(`.nav .nav-parent[data-target="${group}"]`)
    if (await parent.getAttribute("aria-expanded") !== "true") {
      await parent.click()
      await frame.locator(`.nav .nav-parent[data-target="${group}"][aria-expanded="true"]`).waitFor()
    }
    await target.click()
    if (width <= 800) await frame.locator('.material-menu-toggle[aria-expanded="false"]').waitFor()
    // bannerPage() has its own renderer; only TG uses detailPage's attribute.
    await frame.locator(".heading h1").filter({ hasText: new RegExp("^" + title + "$") }).waitFor({ state: "visible" })
    assert.equal(await frame.locator(".page").evaluate(() => location.hash), "#" + slug)
    if (slug === "tg-assets") await frame.locator('[data-detail-spec="tg-assets"]').waitFor()
  }
  const materialVideo = frame.locator("[data-tg-message-media] video")
  assert.equal(await frame.locator("[data-tg-message-media]").count(), 1)
  await playAndPause(materialVideo)
  await selectModule("banner", "home", "首页 Banner")
  assert.equal(await frame.locator("[data-tg-message-media]").count(), 0)
  await selectModule("tg-assets", "operations", "TG推送素材")
  await frame.locator('[data-tg-message-media] video').waitFor()
  assert.equal(await frame.locator("[data-tg-message-media]").count(), 1, "Returning to TG creates one shared player")
  await videoLoaded(materialVideo)
  await noOverflow()
  assert.equal(await frame.locator("body").evaluate((node) => node.scrollWidth > innerWidth + 1), false, "Material frame has no horizontal overflow")
  await workspace.screenshot({ path: `/tmp/tg-materials-${width}.png` })
  const articleLink = frame.locator(`[data-tg-message-media] a[href="${prefix}${articlePath}#tg-message-demo"]`)
  assert.equal(await articleLink.getAttribute("target"), "_top")
  await articleLink.click()
  await page.waitForURL((url) => url.pathname === prefix + articlePath && url.hash === "#tg-message-demo")
  await page.locator("#tg-message-demo").waitFor()
  await noOverflow()
  console.log(`PASS TG functional checks ${width}px: default video and first-visible playback, offscreen/manual pause retention, static/video switching, viewer focus/position return, role/tag return, scenes/topics and shared material video/backlink; original screenshot ${originalScreenshot ? "VERIFIED" : "PENDING"}`)
  return { functional: true, originalScreenshot: originalScreenshot ? { status: "verified", ...originalScreenshot } : { status: "missing" } }
}
