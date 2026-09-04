import { ImageResponse } from "next/og"

export const dynamic = "force-static"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F8FA",
          color: "#172033",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 18,
              background: "linear-gradient(135deg, #1B2A41, #12665E)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            包
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>包网知识库</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 58, lineHeight: 1.15, fontWeight: 800, maxWidth: 930 }}>用产品、运营、设计、技术视角，理解包网平台</div>
          <div style={{ marginTop: 28, fontSize: 28, lineHeight: 1.45, color: "#667085", maxWidth: 940 }}>后台系统 · 结构图解 · 工作模板 · 术语速查</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#12665E" }}>
          <span>文章</span>
          <span>术语库</span>
          <span>模板库</span>
          <span>流程图</span>
        </div>
      </div>
    ),
    size
  )
}
