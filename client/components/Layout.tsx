import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Fireworks } from "./Fireworks";
import { FloatingSparks } from "./FloatingSparks";

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-[100dvh] overflow-x-hidden bg-white">
    {/* Light background */}
    <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent_45%),radial-gradient(circle_at_100%_70%,rgba(236,72,153,0.05),transparent_35%)]" />

    <Fireworks />
    <Navbar />

    <main className="relative z-10 pt-[76px]">
      {children}
    </main>

    <Footer />

    {/* Floating sparks */}
    <div className="fixed inset-0 pointer-events-none z-[45]">
      <FloatingSparks count={16} />
    </div>
  </div>
);