"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";

export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      setAuthToken(null);
      return;
    }
    const syncToken = async () => {
      const token = await getToken();
      setAuthToken(token);
    };
    syncToken();
    // Re-sync every 50 seconds to keep token fresh
    const interval = setInterval(syncToken, 50_000);
    return () => clearInterval(interval);
  }, [isSignedIn, getToken]);

  return <>{children}</>;
}
