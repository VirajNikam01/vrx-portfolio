import { ImageResponse } from "next/og";
import { seoConfig } from "@/config/seo";

export const alt = "Viraj Nikam software developer portfolio";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

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
                    padding: "72px",
                    color: "#f8fafc",
                    background:
                        "linear-gradient(135deg, #09090b 0%, #111827 42%, #0f766e 100%)",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "18px",
                        fontSize: 34,
                        color: "#99f6e4",
                    }}
                >
                    <span>Software Developer Portfolio</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 96,
                            fontWeight: 800,
                            lineHeight: 1,
                            letterSpacing: 0,
                        }}
                    >
                        {seoConfig.name}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 28,
                            maxWidth: 920,
                            fontSize: 34,
                            lineHeight: 1.25,
                            color: "#d1d5db",
                        }}
                    >
                        React, Next.js, TypeScript, Tauri, PostgreSQL, and
                        polished product interfaces.
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 28,
                        color: "#ccfbf1",
                    }}
                >
                    Zybra | Artoon Solutions | virajnikam.in
                </div>
            </div>
        ),
        size,
    );
}
