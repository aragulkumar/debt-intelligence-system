import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Debt Helper",
  description: "Sign in to your Debt Helper account to manage your debts.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}>
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              <span className="text-white text-lg font-bold">D</span>
            </div>
            <span className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Debt Helper
            </span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Welcome back
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Sign in to manage your debt intelligently
          </p>
        </div>

        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#6366f1",
              colorBackground: "#111113",
              colorText: "#fafafa",
              colorTextSecondary: "#a1a1aa",
              colorInputBackground: "#18181b",
              colorInputText: "#fafafa",
              borderRadius: "0.75rem",
            },
          }}
        />
      </div>
    </div>
  );
}
