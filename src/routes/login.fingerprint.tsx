import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AtmShell } from "@/components/atm/AtmShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import { fetchUser, listenAtm } from "@/lib/atm";
import { sessionStore } from "@/lib/session";

export const Route = createFileRoute("/login/fingerprint")({
  component: FingerprintLogin,
});

function FingerprintLogin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Place finger on sensor...");

  useEffect(() => {
    let handled = false;
    const unsub = listenAtm(async (s) => {
      if (handled) return;
      if (s.currentUser !== 0 && s.loginType === "fingerprint") {
        handled = true;
        setStatus("Fingerprint detected. Loading account…");
        const user = await fetchUser(s.currentUser);
        if (!user) {
          setStatus("User not found in database.");
          handled = false;
          return;
        }
        sessionStore.set({ userId: s.currentUser, name: user.name, loginType: "fingerprint" });
        setStatus(`Welcome ${user.name}`);
        setTimeout(() => navigate({ to: "/dashboard" }), 800);
      }
    });
    return () => unsub();
  }, [navigate]);

  return (
    <AtmShell>
      <Card className="p-10 max-w-md mx-auto text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative rounded-full bg-primary/10 p-8">
              <Fingerprint className="h-20 w-20 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold">{status}</h2>
          <p className="text-sm text-muted-foreground">Listening to the ESP32 sensor in real-time.</p>
          <Button variant="secondary" onClick={() => navigate({ to: "/" })}>Cancel</Button>
        </div>
      </Card>
    </AtmShell>
  );
}
