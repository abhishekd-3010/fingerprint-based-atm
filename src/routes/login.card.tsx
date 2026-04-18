import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AtmShell } from "@/components/atm/AtmShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchUser } from "@/lib/atm";
import { sessionStore } from "@/lib/session";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login/card")({
  component: CardLogin,
});

function CardLogin() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await fetchUser(id);
      if (!user) {
        setError("User not found.");
        return;
      }
      sessionStore.set({ userId: Number(id), name: user.name, loginType: "card" });
      navigate({ to: "/dashboard" });
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AtmShell>
      <Card className="p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Card Login</h2>
        <p className="text-sm text-muted-foreground mb-6">Enter your User ID to continue.</p>
        <form onSubmit={submit} className="space-y-4">
          <Input
            autoFocus
            inputMode="numeric"
            placeholder="User ID (e.g. 1)"
            value={id}
            onChange={(e) => setId(e.target.value.replace(/\D/g, ""))}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={!id || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
          </Button>
        </form>
      </Card>
    </AtmShell>
  );
}
