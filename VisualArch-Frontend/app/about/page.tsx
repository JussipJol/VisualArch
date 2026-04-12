"use client";

import { Navbar } from "@/components/Navbar";
import { UnicornBackground } from "@/components/UnicornBackground";

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#1A1A2E", minHeight: "100vh" }}>
      <Navbar variant="public" />

      <section style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <UnicornBackground overlayOpacity={0.5} />

        <div style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 24px",
          animation: "fadeUpSimple 0.7s ease 0.3s both",
        }}>
          <h1 style={{
            fontFamily: "var(--font-geist), sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
            background: "linear-gradient(135deg, #F0F4FF 0%, #8B7CF6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 16,
          }}>
            VisualArch AI
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(240,244,255,0.5)", lineHeight: 1.6 }}>
            Coming soon
          </p>
        </div>
      </section>

      <style>{`
        @keyframes fadeUpSimple {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
