// Static cover from the same precomputed Anatomy geometry used in the article.
// Anatomy by Ryan (MIT). See vendor/anatomy/LICENSE.
import fs from "node:fs"
import assert from "node:assert/strict"

const geometry = JSON.parse(fs.readFileSync("src/data/gamingMachineGeometry.json", "utf8"))
const sourceCss = fs.readFileSync("src/components/article/GamingMachineExplorer.module.css", "utf8")
const license = fs.readFileSync("scripts/vendor/anatomy/LICENSE", "utf8").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
const artRules = [...sourceCss.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
  .filter(([, selector]) => /^(?:\.art :global\(|\.art \[data-active)/.test(selector.trim()))
  .map(([, selector, declarations]) => `${selector.trim().replaceAll(".art ", "").replace(/:global\(([^)]+)\)/g, "$1")} {${declarations}}`)
  .join("\n")
assert(artRules.includes(".iso-fill") && artRules.includes(".machine-glass"))

// Keep the article's painter order, colors and note-recognition view. The
// printed ticket stays hidden so the cover shows a single coherent input state.
const machine = geometry.parts.map((item) => `<g${item.part === "validator" ? ' data-active="true"' : ""}>${item.svg}</g>`).join("\n")
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" role="img" aria-labelledby="title desc">
  <title id="title">电子游艺机整机剖视与纸币识别器局部</title>
  <desc id="desc">复用文章中的通用机柜示意。左侧保留完整设备，右侧放大纸币进入识别器的局部；绿色表示当前观察部件。</desc>
  <metadata>Geometry: ${geometry.source}\n${license}</metadata>
  <style>
${artRules}
.machine-note { display: initial; }
text { font-family: "Noto Sans CJK SC", "Microsoft YaHei", sans-serif; }
  </style>
  <defs>
    <radialGradient id="background" cx="37%" cy="88%" r="75%">
      <stop offset="0" stop-color="#e0e8dd"/>
      <stop offset="1" stop-color="#f5f4ef"/>
    </radialGradient>
    <clipPath id="detail-clip"><rect x="905" y="306" width="600" height="420" rx="14"/></clipPath>
  </defs>
  <rect width="1600" height="1000" fill="url(#background)"/>
  <ellipse cx="447" cy="928" rx="275" ry="28" fill="#bfcfc0" opacity=".42"/>
  <path d="M352 575H772Q802 575 821 548L866 493H905" fill="none" stroke="#618e78" stroke-width="5" stroke-dasharray="12 12"/>
  <svg x="38" y="28" width="820" height="940" viewBox="100 40 400 560">${machine}</svg>
  <circle cx="335" cy="575" r="26" fill="none" stroke="#1c6c54" stroke-width="5"/>
  <rect x="875" y="170" width="660" height="650" rx="28" fill="#fbfcf8" stroke="#b5cbb9" stroke-width="3"/>
  <text x="925" y="263" fill="#245c51" font-size="52" font-weight="700">纸币识别器</text>
  <rect x="905" y="306" width="600" height="420" rx="14" fill="#edf2e8"/>
  <g clip-path="url(#detail-clip)">
    <svg x="905" y="306" width="600" height="420" viewBox="${geometry.zoom.validator}">${machine}</svg>
  </g>
  <text x="925" y="781" fill="#526b5a" font-size="34">局部放大</text>
</svg>
`
assert(geometry.width === 560 && geometry.height === 640 && geometry.zoom.validator)
fs.writeFileSync("public/images/articles/electronic-gaming-machine.svg", svg)
console.log("Static gaming-machine cover: 1600 × 1000, complete cabinet and validator detail.")
