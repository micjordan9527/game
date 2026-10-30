import type { MachineScenario } from "@/data/gamingMachine"

// Screen-space travel along the paper's existing isometric feed axis. The SVG
// clips these sheets at the physical mouths; no cabinet geometry is rebuilt.
export function machineMotion(step: number, scenario: MachineScenario) {
  if (step === 1 && scenario === "rejected") return {
    type: "note-return", target: "note", duration: 2000,
    frames: [
      { transform: "translate(-28px, 15.7px)", offset: 0 },
      { transform: "translate(-2px, 1.1px)", offset: 0.42 },
      { transform: "translate(-2px, 1.1px)", offset: 0.58 },
      { transform: "translate(-38px, 21.3px)", offset: 1 },
    ],
    finalTransform: "translate(-38px, 21.3px)",
    paperDuring: "识别后退回中", paperAfter: "入口外，未接受", ticketDuring: "未生成", ticketAfter: "未生成",
  }
  if (step === 1) return {
    type: "note-feed", target: "note", duration: 1600,
    frames: [{ transform: "translate(-28px, 15.7px)" }, { transform: "translate(0px, 0px)" }],
    finalTransform: "translate(0px, 0px)",
    paperDuring: "送入识别口", paperAfter: "识别口，待确认", ticketDuring: "未生成", ticketAfter: "未生成",
  }
  if (step === 2) return {
    type: "note-accept", target: "note", duration: 1600,
    frames: [{ transform: "translate(0px, 0px)" }, { transform: "translate(42px, -23.5px)" }],
    finalTransform: "translate(42px, -23.5px)",
    paperDuring: "进入收纳通道", paperAfter: "收纳箱内", ticketDuring: "未生成", ticketAfter: "未生成",
  }
  if (step === 7) return {
    type: "ticket-print", target: "ticket", duration: 1800,
    frames: [{ transform: "translate(45px, -25.2px)" }, { transform: "translate(0px, 0px)" }],
    finalTransform: "translate(0px, 0px)",
    paperDuring: "收纳箱内", paperAfter: "收纳箱内", ticketDuring: "正在送出票据", ticketAfter: "已打印，未兑付",
  }
  return null
}

export function restingPaperPosition(step: number, scenario: MachineScenario) {
  return step === 0 ? "尚未送入" : step === 1 ? scenario === "rejected" ? "入口外，未接受" : "识别口，待确认" : "收纳箱内"
}

export function restingTicketPosition(step: number, paperOut: boolean) {
  return step < 6 ? "未生成" : step === 6 ? paperOut ? "缺纸，保留原记录" : "原票据待打印" : "已打印，未兑付"
}
