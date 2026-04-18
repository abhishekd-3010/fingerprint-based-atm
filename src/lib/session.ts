// Tiny client-side session store for the active ATM user.
// Firebase RTDB structure is NOT modified — this only lives in memory + sessionStorage.
import type { LoginType } from "./firebase";

export type Session = {
  userId: number;
  name: string;
  loginType: LoginType;
};

const KEY = "atm_session";

export const sessionStore = {
  get(): Session | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  },
  set(s: Session) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(KEY, JSON.stringify(s));
  },
  clear() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(KEY);
  },
};
