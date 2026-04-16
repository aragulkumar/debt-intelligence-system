import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — Debt Helper",
  description: "Create your Debt Helper account to start managing your debts.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-base)" }}>
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-md px-4">
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
            Get started free
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Take control of your financial future today
          </p>
        </div>

        <SignUp
          routing="hash"
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
