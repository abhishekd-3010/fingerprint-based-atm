import { createFileRoute } from "@tanstack/react-router";
import { AtmShell, HomeButtons } from "@/components/atm/AtmShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SecureATM — Fingerprint & Card Login" },
      { name: "description", content: "Fingerprint-based ATM system with card and biometric login." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AtmShell>
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Welcome to SecureATM</h1>
        <p className="mt-2 text-muted-foreground">Choose a login method to continue</p>
      </div>
      <HomeButtons />
    </AtmShell>
  );
}
