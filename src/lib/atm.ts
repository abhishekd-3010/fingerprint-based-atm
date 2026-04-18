import { ref, get, set, update, onValue, off } from "firebase/database";
import { db, type AtmUser } from "./firebase";

export async function fetchUser(id: number | string): Promise<AtmUser | null> {
  const snap = await get(ref(db, `users/${id}`));
  return snap.exists() ? (snap.val() as AtmUser) : null;
}

export async function resetAtmSession() {
  await update(ref(db, "atm"), {
    currentUser: 0,
    loginType: "",
    authenticated: false,
    pinEntered: "",
  });
}

export async function updateBalance(id: number | string, newBalance: number) {
  await set(ref(db, `users/${id}/balance`), newBalance);
}

export type AtmState = {
  currentUser: number;
  loginType: string;
  authenticated: boolean;
  pinEntered: string;
};

export function listenAtm(cb: (state: AtmState) => void) {
  const r = ref(db, "atm");
  const handler = onValue(r, (snap) => {
    const v = (snap.val() ?? {}) as Partial<AtmState>;
    cb({
      currentUser: Number(v.currentUser ?? 0),
      loginType: String(v.loginType ?? ""),
      authenticated: Boolean(v.authenticated ?? false),
      pinEntered: String(v.pinEntered ?? ""),
    });
  });
  return () => off(r, "value", handler);
}
