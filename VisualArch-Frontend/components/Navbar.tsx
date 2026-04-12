"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Bell, ChevronDown, Settings, LogOut } from "lucide-react";
import { Logo } from "./Logo";

interface NavbarProps {
  variant?: "public" | "auth" | "app";
  userName?: string;
  userEmail?: string;
}

export function Navbar({ variant = "public", userName, userEmail }: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = (userName?.[0] || userEmail?.[0] || "U").toUpperCase();

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    height: 64,
    display: "flex",
    alignItems: "center",
    transition: "background 0.3s ease, border-color 0.3s ease",
    background: scrolled ? "rgba(26,26,46,0.75)" : "transparent",
    backdropFilter: scrolled ? "blur(14px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
  };

  const linkStyle: React.CSSProperties = {
    padding: "6px 14px",
    borderRadius: 10,
    fontSize: "0.875rem",
    color: "rgba(255,255,255,0.65)",
    textDecoration: "none",
    transition: "color 0.15s ease, background 0.15s ease",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    fontFamily: "inherit",
  };

  return (
    <>
      <nav style={navStyle}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <Link href={variant === "auth" ? "/dashboard" : "/"} style={{ textDecoration: "none" }}>
            <Logo />
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {variant === "public" ? (
              <>
                <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Link href="/about" style={linkStyle}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = "#fff"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.target as HTMLElement).style.background = "transparent"; }}
                  >About</Link>
                  <Link href="/login" style={linkStyle}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = "#fff"; (e.target as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.target as HTMLElement).style.background = "transparent"; }}
                  >Login</Link>
                  <Link href="/register" style={{ textDecoration: "none" }}>
                    <button style={{
                      padding: "7px 18px",
                      borderRadius: 10,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#fff",
                      cursor: "pointer",
                      border: "none",
                      background: "linear-gradient(135deg, #5E81F4, #7C6FF7)",
                      boxShadow: "0 2px 16px rgba(94,129,244,0.3)",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                    >Registration</button>
                  </Link>
                </div>

                <button
                  className="nav-mobile"
                  onClick={() => setMobileOpen(true)}
                  style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)" }}
                >
                  <Menu size={20} />
                </button>
              </>
            ) : (
              <>
                <button style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", borderRadius: 10 }}>
                  <Bell size={18} />
                </button>
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: 4, background: "none", border: "none", cursor: "pointer", borderRadius: 10 }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "linear-gradient(135deg, #5CE6FF, #8B7CF6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.8rem", fontWeight: 700, color: "#fff",
                    }}>{initial}</div>
                    <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: "absolute", right: 0, top: "calc(100% + 8px)",
                      width: 224, borderRadius: 16, overflow: "hidden",
                      background: "rgba(22,33,62,0.97)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                    }}>
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#F0F4FF" }}>{userName || "Пользователь"}</p>
                        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</p>
                      </div>
                      <div style={{ padding: 4 }}>
                        <Link href="/settings" onClick={() => setDropdownOpen(false)} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "8px 12px", borderRadius: 10, fontSize: "0.875rem",
                          color: "rgba(255,255,255,0.6)",
                          textDecoration: "none", transition: "background 0.15s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <Settings size={14} />Настройки
                        </Link>
                        <button onClick={() => { setDropdownOpen(false); handleLogout(); }} style={{
                          display: "flex", alignItems: "center", gap: 10, width: "100%",
                          padding: "8px 12px", borderRadius: 10, fontSize: "0.875rem",
                          color: "#f87171", background: "transparent",
                          border: "none", cursor: "pointer", transition: "background 0.15s",
                          fontFamily: "inherit",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <LogOut size={14} />Выйти
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          />
          <div style={{
            position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 51,
            width: 260, display: "flex", flexDirection: "column",
            background: "rgba(22,33,62,0.98)",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 64, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <Logo />
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: 6 }}>
                <X size={18} />
              </button>
            </div>
            <nav style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { label: "About", href: "/about" },
                { label: "Login", href: "/login" },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
                  padding: "12px 16px", borderRadius: 12, fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.65)", textDecoration: "none",
                }}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <Link href="/register" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                <button style={{
                  width: "100%", padding: "12px", borderRadius: 12, fontSize: "0.9rem", fontWeight: 600,
                  color: "#fff", cursor: "pointer", border: "none",
                  background: "linear-gradient(135deg, #5E81F4, #7C6FF7)",
                }}>Registration</button>
              </Link>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 640px) { .nav-desktop { display: none !important; } }
        @media (min-width: 641px) { .nav-mobile { display: none !important; } }
      `}</style>
    </>
  );
}
