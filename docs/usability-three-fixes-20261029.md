# Device diagram, preview cover and agent material workspace

## Baseline and recovery

- Existing public Site v32, native source `3b2d55cc4602e5dbf7bd4110430f3f0f5262d5ab`, GitHub main `ce537f86371d82c6a4a40f4d981c9f838ba9f1ef`.
- Retain saved native v32 and local `checkpoint-before-three-usability-fixes-20261029` before edits. Preserve audience and existing URLs.

## Delivered changes

1. Device explorer: one viewport-sized panel owns part selection, figure, current explanation, balance and controls. Desktop keeps seven buttons; phone uses a compact selector. Choosing a part displays its purpose without changing the process or amounts; advancing returns to the current step explanation. Controls keep their panel position across all eight states and paper-out. Manual interaction aligns the panel only when its bounds are outside the usable viewport. Existing detailed prose remains open; older `#machine-demo`, `#machine-view` and source anchors remain valid.
2. Article card: explicit cover priority before existing article images. This article reuses its own precomputed SVG as a 1600×1000 cabinet-and-validator preview, with the original drawing order, styling and MIT credit. Card labels explain the seven parts and eight steps, with a direct interactive CTA. The list, category and related cards share this cover. No new image model generation, runtime geometry engine or dependency.
3. Agent materials: one inner material directory and a full-height embedded workspace under a compact toolbar. Remove the outer knowledge directory and design return. The top/mobile/footer entry is “代理素材”. Preserve the original route, module query/hash, search, actual images, Figma links, independent full-page entry and fallback. Add an embedded-only phone directory with group navigation, backdrop/Escape/focus handling. Reapply styling on frame reload and handle a frame completing before React hydration. The large original HTML asset is unchanged.

## Acceptance and related checks

- Assert that the actual figure, part selector, step explanation, balance and controls share the viewport during step transitions. Include 1440×720 and 390×700 as well as normal 1440/390 widths; check the paper-out recovery action too.
- Check actual cover decoding and content, role/tag/disclosure/scroll return, category and related-card reuse, and existing AVIF/PNG cards.
- Check materials in the root and `/game` exports: legacy Banner query/hash, iframe viewport, inner menu, search, source link URL, image viewer, frame reload and recoverable 404 interception.
- Keep historical release anchors, expansion and back position. Native fragment navigation can open an uncontrolled historical `<details>` before hydration; suppress only that browser-managed attribute mismatch, not page errors or descendants.
- Previous v32 GitHub Pages verification timed out in the existing form's rejected-response test after reset. The check now waits for the reset's scheduled focus restoration before filling the next scenario; expected outcomes are unchanged. Verify the existing interaction scope under `/game`.
- No real-device/RNG/payment validation or measured effect improvement is claimed. Figma links are checked as links; this batch does not read or edit their files.

Publication identifiers and final check outcomes are recorded outside the source tree after delivery.

## Completed local validation

- Content, TypeScript and whitespace checks passed; root and `/game` production builds each passed 101-page export integrity.
- The combined device/cover/materials/navigation scope passed at 1440 and 390 in both builds. Device checks also resized to 1440×720 and 390×700, asserting actual selector, SVG, explanation, balance, controls and paper-out action bounds during transitions.
- Root release-history regression passed both widths, including v32 archive links, manual expansion, copied/fresh-tab links, legacy anchors, article return and the existing 18 demonstrations.
- The existing interaction scope passed both widths under `/game` with delayed HTML chunks, including the reset/rejected/accepted form path that timed out in the prior v32 Pages workflow.
- Reviewed desktop, compact-phone device views, the real cover at card size, material desktop and phone workspaces, and the phone directory overlay. No real-device or external Figma-file validation is implied.
