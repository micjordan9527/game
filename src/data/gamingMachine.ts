export type MachinePart = "screen" | "controls" | "logic" | "validator" | "cashbox" | "printer" | "power"
export type MachineScenario = "normal" | "rejected" | "paper-out"

export const machineGuides: Record<string, { demo: string }> = {
  "electronic-gaming-machine": { demo: "machine-demo" },
}

export const machineParts: { id: MachinePart; name: string; purpose: string; observation: string }[] = [
  { id: "screen", name: "显示屏", purpose: "显示游戏画面、余额与设备提示；触摸屏也可以接收操作。", observation: "画面负责呈现。转轴的播放速度不代表结果生成速度，也不决定结果。" },
  { id: "controls", name: "操作按钮", purpose: "接收开始、帮助、出票等操作，再交给控制程序处理。", observation: "按下按钮是提出请求；是否接受，还取决于余额、当前局状态和设备条件。" },
  { id: "logic", name: "控制与记录", purpose: "处理输入、运行游戏逻辑、协调外设，并保存余额和业务记录。", observation: "本图采用软件结果与记录的通用说明；RNG不是一块适用于所有机型的独立芯片。服务器决定结果的设备另有架构。" },
  { id: "validator", name: "纸币识别器", purpose: "送入、识别并接受或退回纸币；确认接受后才进入入账过程。", observation: "纸币进入入口不等于余额已经增加。本例先显示识别，再显示确认入账。" },
  { id: "cashbox", name: "纸币收纳箱", purpose: "保存已经接受的纸币，与识别入口和主控区域分开。", observation: "纸币的物理存放与屏幕上的可用余额是两件事。纸币仍在箱内，余额可能已经结算或转成票据。" },
  { id: "printer", name: "票据打印机", purpose: "将出票记录打印为纸质凭证，供配套系统校验。", observation: "打印机只负责打印；票据金额与有效性还需要出票记录和校验系统配合。打印失败不代表出票记录不存在。" },
  { id: "power", name: "电源与散热", purpose: "为屏幕、控制器与外设供电，并通过通风区域散热。", observation: "本图省略实际线束、电气规格和维修结构，不用于接线或拆机。" },
]

export const machineSteps: { title: string; part: MachinePart; explanation: string }[] = [
  { title: "待机", part: "screen", explanation: "设备等待输入。可用余额为0，尚未接受纸币或开始游戏。" },
  { title: "识别纸币", part: "validator", explanation: "面值100的示例纸币进入识别通道。此时尚未确认接受，可用余额仍为0。" },
  { title: "确认入账", part: "cashbox", explanation: "本例确认接受100，并将纸币送入收纳箱；余额记录增加100。" },
  { title: "开始一局", part: "controls", explanation: "本例开始请求被接受，扣除10，可用余额从100变为90。" },
  { title: "确认结果", part: "logic", explanation: "读取固定的讲解结果：本局返还15，尚未计入余额。此处没有运行真实RNG，也不表示中奖概率。" },
  { title: "结算余额", part: "screen", explanation: "将本局返还15计入余额：100 − 10 + 15 = 105。画面与余额记录分别说明。" },
  { title: "生成票据", part: "printer", explanation: "本例将105转入原出票记录EGM-DEMO-T001，可用余额变为0；票据待打印，尚未交付。" },
  { title: "打印完成", part: "printer", explanation: "同一张105的示例票据打印完成。票据实际兑付还需要配套系统校验；本页不提供兑付。" },
]

export const MACHINE_TICKET_ID = "EGM-DEMO-T001"

// Fixed teaching snapshots, not a wallet, game engine, RNG or printer integration.
// All quantities are integer demonstration units, without currency or exchange rate.
export function machineSnapshot(requestedStep: number, scenario: MachineScenario = "normal", recovered = false) {
  const maxStep = scenario === "rejected" ? 1 : scenario === "paper-out" && !recovered ? 6 : 7
  const step = Math.max(0, Math.min(maxStep, Math.floor(Number.isFinite(requestedStep) ? requestedStep : 0)))
  const rejected = scenario === "rejected" && step === 1
  const paperOut = scenario === "paper-out" && !recovered && step === 6
  const accepted = step >= 2 ? 100 : 0
  const spent = step >= 3 ? 10 : 0
  const returned = step >= 5 ? 15 : 0
  const pending = step === 6 ? 105 : 0
  const printed = step === 7 ? 105 : 0
  const available = accepted - spent + returned - pending - printed
  return {
    step, rejected, paperOut, accepted, spent, returned, pending, printed, available,
    candidate: step === 1 && !rejected ? 100 : 0,
    result: step >= 4 ? 15 : null,
    ticketId: step >= 6 ? MACHINE_TICKET_ID : null,
    status: rejected ? "纸币已退回 · 未入账" : paperOut ? "缺纸 · 原票据待处理" : step === 6 ? "原票据待打印" : step === 7 ? "原票据已打印 · 未兑付" : machineSteps[step].title,
    canAdvance: step < maxStep,
  }
}
