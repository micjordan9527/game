// Anatomy by Ryan (MIT), build-time geometry only. See vendor/anatomy/LICENSE.
import fs from "node:fs"
import assert from "node:assert/strict"
import * as k from "./vendor/anatomy/iso-kit.mjs"
import * as A from "./vendor/anatomy/audit.mjs"

const width = 560, height = 640
const P = k.fitProjection(k.boxCorners({ x: -82, y: -58, w: 164, d: 146 }, 0, 246), width, height, { pad: 45, azimuth: 54, elevation: 24 })
const R = A.recorder(P)
const bounds = {}, parts = []

function box(name, part, x, y, z, w, d, h, extra = "") {
  const plan = { x, y, w, d, r: 0 }
  const paths = k.slabOf(plan, z, h, P, 1, Math.min(0.65, h / 4, d / 4, w / 4))
  const corners = k.boxCorners(plan, z, z + h).map((p) => k.iso(p, P))
  const shape = R.solid(A.slab(plan, z, h, { name, ground: name.startsWith("foot-") }, 1))
  const svg = k.solidSvg(paths, { tone: part ? "hi" : "lo", className: extra || undefined })
  const item = R.put({ name, at: [x + w / 2, y + d / 2, z + h / 2], svg, shapes: [shape], piece: "cabinet" })
  item.part = part
  item.extra = extra
  parts.push({ name, part, box: [x, y, z, w, d, h] })
  if (part) bounds[part] = [...(bounds[part] ?? []), ...corners]
}

// Base and open cabinet: physical support, no disconnected decorative parts.
for (const [i, x, y] of [[0, -65, -40], [1, 52, -40], [2, -65, 42], [3, 52, 42]]) box(`foot-${i}`, null, x, y, 0, 13, 13, 5)
box("base-plinth", null, -78, -55, 5, 156, 116, 5)
box("cabinet-floor", null, -70, -48, 10, 140, 96, 4)
box("rear-wall", null, -70, -48, 14, 140, 4, 220)
for (const x of [-70, 64]) for (const y of [-44, 40]) box(`upright-${x}-${y}`, null, x, y, 14, 6, 8, 220)
box("top-cap", null, -70, -48, 234, 140, 96, 7)
box("upper-fascia", null, -64, 32, 224, 128, 8, 10)
box("front-threshold", null, -64, 40, 14, 128, 8, 7)

// Upper display on two supports. Front face is y-positive.
for (const x of [-55, 23]) box(`display-support-${x}`, "screen", x, -35, 122, 8, 60, 7)
box("display-tray", "screen", -60, -35, 129, 100, 63, 4)
box("display-housing", "screen", -60, -25, 133, 100, 53, 91)
box("display-bezel", "screen", -60, 28, 133, 100, 5, 91)
box("display-glass", "screen", -54, 33, 143, 88, 0.7, 72, "machine-glass")
for (let i = 0; i < 3; i++) {
  box(`reel-window-${i}`, "screen", -47 + i * 26, 33.7, 163, 21, 0.5, 33, "machine-reel")
  box(`symbol-${i}`, "screen", -42 + i * 26, 34.2, 173, 11, 0.5, 13, "machine-symbol")
}
box("display-lower-strip", "screen", -47, 33.7, 150, 73, 0.5, 6, "machine-strip")

// Controls, all bases physically touch the deck.
box("button-deck", "controls", -64, 24, 115, 128, 42, 7)
for (let i = 0; i < 3; i++) {
  box(`button-base-${i}`, "controls", -47 + i * 29, 40, 122, 22, 16, 3)
  box(`button-cap-${i}`, "controls", -45 + i * 29, 42, 125, 18, 12, 2.5, "machine-button")
}

// Logic board mounted vertically inside the open right side, not an RNG icon.
box("logic-tray", "logic", 46, -40, 99, 4, 62, 80)
for (const z of [100, 174]) box(`logic-mount-${z}`, "logic", 50, -40, z, 14, 4, 4)
for (const y of [-34, 18]) for (const z of [105, 168]) box(`board-standoff-${y}-${z}`, "logic", 50, y, z, 4, 4, 4)
box("logic-board", "logic", 54, -34, 105, 1.5, 56, 67, "machine-board")
box("controller-package", "logic", 55.5, -19, 129, 3.5, 23, 22, "machine-chip")
box("memory-package", "logic", 55.5, -28, 111, 2, 14, 8, "machine-chip")
for (let i = 0; i < 4; i++) box(`connector-${i}`, "logic", 55.5, -30 + i * 13, 159, 3, 9, 8)

// Validator and secure storage are separate assemblies; accepted note stays in box.
box("cashbox-body", "cashbox", -55, -12, 14, 55, 51, 53)
box("cashbox-lid", "cashbox", -55, -12, 67, 55, 51, 3)
box("cashbox-lock-plate", "cashbox", -34, 39, 31, 14, 2, 14)
box("validator-cradle", "validator", -55, -12, 70, 55, 51, 3)
box("validator-body", "validator", -52, -8, 73, 49, 43, 33)
box("validator-entry-bottom", "validator", -52, 35, 88, 49, 9, 4)
box("validator-entry-top", "validator", -52, 35, 101, 49, 9, 5)
for (const x of [-52, -7]) box(`validator-guide-${x}`, "validator", x, 35, 92, 4, 9, 9)
box("validator-slot", "validator", -48, 35, 92, 41, 0.8, 9, "machine-slot")
box("note-candidate", "validator", -46, 35.8, 96, 37, 34, 0.7, "machine-note")

// Printer to the right of the validator, with an exit slot and a supported ticket.
box("printer-shelf", "printer", 8, -3, 14, 50, 43, 5)
box("printer-body", "printer", 10, 0, 19, 46, 36, 49)
box("printer-paper-compartment", "printer", 12, 1, 68, 42, 32, 9)
box("printer-lid", "printer", 12, 1, 77, 42, 32, 2)
box("printer-exit-bottom", "printer", 12, 36, 60, 42, 8, 4)
box("printer-exit-top", "printer", 12, 36, 65, 42, 8, 5)
box("printer-ticket", "printer", 17, 44, 64, 32, 30, 0.7, "machine-ticket")

// Power supply and ventilation, away from note and ticket paths.
box("power-unit", "power", 8, -40, 14, 34, 29, 22)
box("power-terminal-cover", "power", 8, -11, 18, 34, 3, 12)
box("ventilation-panel", "power", 64, -36, 22, 2, 60, 57)
for (let i = 0; i < 6; i++) box(`vent-slot-${i}`, "power", 66, -31, 28 + i * 7, 0.3, 49, 2, "machine-slot")

assert(parts.length >= 40 && parts.length <= 80)
A.settle(R, P)
R.items.sort((a, b) => a.key - b.key)
A.auditOrExit(R, P, {})
if (process.exitCode) process.exit(process.exitCode)
const zoom = Object.fromEntries(Object.entries(bounds).map(([id, pts]) => {
  const xs = pts.map(([x]) => x), ys = pts.map(([, y]) => y)
  const x = Math.min(...xs) - 22, y = Math.min(...ys) - 22
  return [id, [x, y, Math.max(...xs) - x + 22, Math.max(...ys) - y + 22].map((v) => Math.round(v * 10) / 10).join(" ")]
}))
const output = { width, height, solidCount: parts.length, source: "Anatomy / Ryan / MIT / 1482e8469b0a9e0d8cc18ea2740a01423d29ae80", zoom, parts: R.items.map((item) => ({ name: item.name, part: item.part, extra: item.extra, svg: item.svg })) }
fs.writeFileSync("src/data/gamingMachineGeometry.json", JSON.stringify(output) + "\n")
console.log(`Gaming machine: ${parts.length} solids, seven selectable assemblies; precomputed SVG written.`)
