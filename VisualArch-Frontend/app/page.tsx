import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { HeroScene } from "@/components/HeroScene";

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <Navbar variant="public" />

      <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <HeroScene />

        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "14px",
            alignItems: "center",
            zIndex: 10,
            animation: "fadeUpIn 0.9s ease 0.6s both",
          }}
        >
          <Link href="/register" style={{ textDecoration: "none" }}>
            <button className="btn-primary">
              Начать проект
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </Link>

          <button className="btn-ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Смотреть демо
          </button>
        </div>
      </section>
    </div>
  );
}
