import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AtmShell } from "@/components/atm/AtmShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, LogOut, Eye } from "lucide-react";
import { fetchUser, resetAtmSession, updateBalance } from "@/lib/atm";
import { sessionStore, type Session } from "@/lib/session";
import { PINModal } from "@/components/atm/PINModal";
import { FingerprintConfirmModal } from "@/components/atm/FingerprintConfirmModal";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

type Action = "balance" | "deposit" | "withdraw";

function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [pin, setPin] = useState<string>("");
  const [pendingAction, setPendingAction] = useState<Action | null>(null);
  const [amount, setAmount] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showFp, setShowFp] = useState(false);
  const [message, setMessage] = useState<{ kind: "info" | "error"; text: string } | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const s = sessionStore.get();
    if (!s) {
      navigate({ to: "/" });
      return;
    }
    setSession(s);
    fetchUser(s.userId).then((u) => {
      if (u) {
        setPin(u.pin);
        setBalance(u.balance);
      }
    });
  }, [navigate]);

  if (!session) return null;

  const requestVerification = (action: Action) => {
    setMessage(null);
    setPendingAction(action);
    if (action !== "balance" && (!amount || Number(amount) <= 0)) {
      setMessage({ kind: "error", text: "Enter a valid amount first." });
      setPendingAction(null);
      return;
    }
    if (session.loginType === "card") setShowPin(true);
    else setShowFp(true);
  };

  const performAction = async () => {
    if (!pendingAction || !session) return;
    const fresh = await fetchUser(session.userId);
    if (!fresh) {
      setMessage({ kind: "error", text: "User no longer exists." });
      return;
    }
    if (pendingAction === "balance") {
      setBalance(fresh.balance);
      setMessage({ kind: "info", text: `Your balance is ₹${fresh.balance.toLocaleString()}` });
    } else if (pendingAction === "deposit") {
      const amt = Number(amount);
      const next = fresh.balance + amt;
      await updateBalance(session.userId, next);
      setBalance(next);
      setMessage({ kind: "info", text: `Deposited ₹${amt.toLocaleString()}. New balance ₹${next.toLocaleString()}.` });
      setAmount("");
    } else if (pendingAction === "withdraw") {
      const amt = Number(amount);
      if (amt > fresh.balance) {
        setMessage({ kind: "error", text: "Insufficient balance." });
      } else {
        const next = fresh.balance - amt;
        await updateBalance(session.userId, next);
        setBalance(next);
        setMessage({ kind: "info", text: `Withdrew ₹${amt.toLocaleString()}. New balance ₹${next.toLocaleString()}.` });
        setAmount("");
      }
    }
    setPendingAction(null);
  };

  const onPinSuccess = () => {
    setShowPin(false);
    void performAction();
  };
  const onFpSuccess = () => {
    setShowFp(false);
    void performAction();
  };

  const logout = async () => {
    await resetAtmSession();
    sessionStore.clear();
    navigate({ to: "/" });
  };

  return (
    <AtmShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-muted-foreground">Logged in via {session.loginType}</p>
          <h1 className="text-3xl font-bold">Welcome {session.name}</h1>
        </div>
        <Button variant="secondary" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>

      <Card className="p-6 mb-6 bg-gradient-to-br from-primary/15 to-accent/15 border-primary/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Account</p>
            <p className="text-lg font-semibold">User #{session.userId}</p>
          </div>
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">Last known balance</p>
          <p className="text-3xl font-bold">{balance !== null ? `₹${balance.toLocaleString()}` : "•••••"}</p>
        </div>
      </Card>

      {message && (
        <Card className={`p-4 mb-6 ${message.kind === "error" ? "border-destructive text-destructive" : "border-primary"}`}>
          {message.text}
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Button variant="secondary" className="h-20" onClick={() => requestVerification("balance")}>
          <Eye className="h-5 w-5 mr-2" /> Check Balance
        </Button>
        <Button variant="secondary" className="h-20" onClick={() => requestVerification("deposit")}>
          <ArrowDownToLine className="h-5 w-5 mr-2" /> Deposit
        </Button>
        <Button variant="secondary" className="h-20" onClick={() => requestVerification("withdraw")}>
          <ArrowUpFromLine className="h-5 w-5 mr-2" /> Withdraw
        </Button>
      </div>

      <Card className="p-6">
        <label className="text-sm font-medium">Amount (for Deposit / Withdraw)</label>
        <Input
          className="mt-2"
          inputMode="numeric"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
        />
        <p className="text-xs text-muted-foreground mt-2">
          {session.loginType === "card"
            ? "You'll be asked for your PIN to confirm."
            : "You'll be asked to re-scan your fingerprint to confirm."}
        </p>
      </Card>

      <PINModal
        open={showPin}
        onClose={() => { setShowPin(false); setPendingAction(null); }}
        expectedPin={pin}
        onSuccess={onPinSuccess}
      />
      <FingerprintConfirmModal
        open={showFp}
        onClose={() => { setShowFp(false); setPendingAction(null); }}
        expectedUserId={session.userId}
        onSuccess={onFpSuccess}
      />
    </AtmShell>
  );
}
