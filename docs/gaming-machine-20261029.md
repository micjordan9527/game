# 电子游艺机主要部件与工作过程

## Design and sources

- Continue native Site v31, source fb376cd9765c3d40004de8b724c08b2df6f44284; recoverable native archive retained and local tag checkpoint-before-gaming-machine-20261029.
- Anatomy **Figure**: a generic cabinet with seven selectable assemblies, 40–80 purposeful solid parts, isometric SVG. This is not a manufacturer cutaway, CAD model or engineering drawing.
- Concept: the validator feeds a visible note into its storage area; the controller coordinates input and records; the printer presents the same example voucher after issuance. This explains the separation of physical handling, displayed balance and records.
- Use Anatomy by Ryan, MIT, revision 1482e8469b0a9e0d8cc18ea2740a01423d29ae80. Vendor only the build-time core and license; ship precomputed SVG art, not a geometry engine. No human Anatomy plugin connection.
- Primary facts: GLI-11 v3.0 (2016), sections 2.8, 2.12–2.13, 2.17–2.19 and chapter 3 / section 4.7; JCM iVIZION and GEN5 product descriptions for validator/stacker and thermal printer functions. These sources establish functions, not this cabinet's geometry or a specific transaction protocol.
- Public references: https://gaminglabs.com/wp-content/uploads/2018/09/GLI-11-Gaming-Devices-V3-0.pdf ; https://jcmglobal.com/product/ivizion/ ; https://jcmglobal.com/product/gen5/ ; https://github.com/wheresryan22/anatomy .

## Parts planned before geometry

Base: plinth, four feet, cabinet floor, front threshold (7).
Structure: rear wall, two rear uprights, two front uprights, top cap, upper fascia, monitor tray, two monitor supports, lower service partition (11).
Display: back housing, bezel, screen inset, three reel windows, three static symbol inserts, lower display strip (10).
Controls: deck, three button bases, three button caps (7).
Logic: board tray, board, controller package, memory package, four connector blocks, four stand-offs (12).
Note handling: validator cradle, body, two guide rails, entry bezel, sensor bridge, storage box, box lid, front lock plate, accepted-note stack (10).
Printer: mounting shelf, printer body, paper compartment, lid, exit bezel, paper ticket (6).
Power: power unit, terminal cover, ventilation panel (3).
Total initially planned: 66. Delivered: 75 recorded solids, including support mounts and ventilation slots. Closed seams/slots add visual detail, not fictional components. No external wiring is drawn or implied to be complete.

## Example boundaries

- Eight fixed snapshots from 0 to 7; integer demonstration units, no currency, RNG, external device, account or payment calls.
- Accepted100, spend10, fixed illustrative return15, settled balance105; issuance moves105 into pending voucher, then printed voucher. Conservation: accepted + posted return = available + spend + pending voucher + printed voucher.
- Rejected note never credits. Paper-out preserves one original example voucher and its pending105; recovery enables completing that same voucher, without another issue or debit. This timing is a declared demonstration assumption, not a universal device protocol.
- Manual by default, optional finite auto tour; pause offscreen/hidden and at faults; reduced-motion disables part animation. HTML labels remain readable on mobile; current-part zoom is available.

## Delivery validation

- Content validation: 38 articles, 9 templates, 4 cases, 66 existing registered images. No new raster assets or dependencies.
- TypeScript and whitespace checks passed. Anatomy geometry audit passed: 75 solids, zero unsupported solids, zero sunk pairs and zero depth-order problems. All seven zoom regions inspected in a contact sheet; desktop and mobile article screenshots reviewed. No open decorative lines were added (upstream line check reports zero eligible ends).
- Root and GitHub Pages `/game` builds and 101-page export integrity passed. The new browser scope passed at 1440/390 in both paths: seven selections and local zoom, SVG click and keyboard controls, all eight normal states, rejected note, original-ticket paper-out recovery, automatic step/pause, reduced-motion styling, readable controls, no page overflow, article details open, product/tag library entry, search keyword/type/position return, release and demonstration links.
- Existing release-log regression passed at 1440/390: v32/current and archived v31, shared links, historical anchors/expansion/back position, 18 demonstrations in the same three groups. Existing v31 GitHub Actions both completed successfully before this release.
- The site retains its public audience and saved v31 recovery version. Current release metadata is v32; source and publication identifiers are recorded outside the source tree after deployment.
- No real device, printer, wallet, RNG, exchange rate or redemption system was connected or tested; no measured learning or business improvement is claimed.
