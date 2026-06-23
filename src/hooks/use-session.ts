"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/session";
import type { AuthSession } from "@/types/auth";

export function useSession() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const update = () => setSession(getSession());
    update();
    window.addEventListener("betwatch-session-change", update);
    return () => window.removeEventListener("betwatch-session-change", update);
  }, []);

  return session;
}
