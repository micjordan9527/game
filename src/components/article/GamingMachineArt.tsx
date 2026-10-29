import geometry from "@/data/gamingMachineGeometry.json"

// Static server art: the build-time drawing engine is never sent to the browser.
export function GamingMachineArt() {
  return <svg key="gaming-machine-art" viewBox={`0 0 ${geometry.width} ${geometry.height}`} width={geometry.width} height={geometry.height} role="img" aria-label="电子游艺机通用剖视示意，七组主要部件可通过下方按钮选择" data-machine-art>
    <desc>带屏幕和操作面板的机柜，右侧打开以观察控制板、纸币识别器、收纳箱、票据打印机及电源。尺寸、布局和零件均为讲解示意。</desc>
    {geometry.parts.map((item) => <g key={item.name} data-machine-part={item.part ?? undefined} data-machine-name={item.name} dangerouslySetInnerHTML={{ __html: item.svg }} />)}
  </svg>
}
