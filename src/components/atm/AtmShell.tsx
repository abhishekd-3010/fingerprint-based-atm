import { CreditCard, Fingerprint } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export function AtmShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Fingerprint className="h-5 w-5" />
            </span>
            SecureATM
          </Link>
          <span className="text-xs text-muted-foreground">Fingerprint &amp; Card Banking</span>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-10">{children}</main>
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        ESP32 Linked · Realtime Database
      </footer>
    </div>
  );
}

export function HomeButtons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link to="/login/card">
        <Card className="p-8 hover:border-primary transition cursor-pointer h-full flex flex-col items-center gap-3">
          <CreditCard className="h-12 w-12 text-primary" />
          <h3 className="text-lg font-semibold">Login with Card</h3>
          <p className="text-sm text-muted-foreground text-center">Enter your User ID to sign in.</p>
        </Card>
      </Link>
      <Link to="/login/fingerprint">
        <Card className="p-8 hover:border-primary transition cursor-pointer h-full flex flex-col items-center gap-3">
          <Fingerprint className="h-12 w-12 text-primary" />
          <h3 className="text-lg font-semibold">Login with Fingerprint</h3>
          <p className="text-sm text-muted-foreground text-center">Place your finger on the sensor.</p>
        </Card>
      </Link>
    </div>
  );
}
