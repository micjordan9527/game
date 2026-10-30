import { GamingMachineArt } from "./GamingMachineArt"
import { DeviceControlsExplorer } from "./DeviceControlsExplorer"
import geometry from "@/data/gamingMachineGeometry.json"

// Reuse the audited, precomputed cabinet; only the controls and state model ship as client code.
export function DeviceControlsGuide() {
  return <DeviceControlsExplorer
    art={<GamingMachineArt key="device-controls-main" idPrefix="device-controls-main" />}
    overview={<GamingMachineArt key="device-controls-overview" idPrefix="device-controls-overview" />}
    zoom={{ screen: geometry.zoom.screen, controls: geometry.zoom.controls, printer: geometry.zoom.printer }}
  />
}
