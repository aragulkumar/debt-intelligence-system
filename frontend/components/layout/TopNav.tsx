"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";

interface TopNavProps {
  title: string;
  subtitle?: string;
}

export function TopNav({ title, subtitle }: TopNavProps) {
  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b"
      style={{
        background: "rgba(9,9,11,0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "var(--border)",
      }}
    >
      {/* Title */}
      <div>
        <h1 className="text-lg font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 rounded-lg transition-colors relative"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          }}
          aria-label="Search"
          id="topnav-search-btn"
        >
          <Search size={18} />
        </button>
        <button
          className="p-2 rounded-lg transition-colors relative"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          }}
          aria-label="Notifications"
          id="topnav-notifications-btn"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#ef4444" }}
          />
        </button>
        <div className="w-px h-6" style={{ background: "var(--border)" }} />
        <UserButton
          appearance={{
            variables: {
              colorPrimary: "#6366f1",
            },
          }}
        />
      </div>
    </header>
  );
}
