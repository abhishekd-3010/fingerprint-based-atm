import { useEffect, useRef, useState } from "react";
import { ref, update } from "firebase/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import { listenAtm } from "@/lib/atm";
import { db } from "@/lib/firebase";

type Props = {
  open: boolean;
  onClose: () => void;
  expectedUserId: number;
  onSuccess: () => void;
};

// Re-scan modal for fingerprint users.
// Fix: reset atm/currentUser to 0 on open so the ESP32's next write
// (even with the same user id) is detected as a fresh transition (0 -> id).
// Also track the last processed value to ignore duplicate identical events.
export function FingerprintConfirmModal({ open, onClose, expectedUserId, onSuccess }: Props) {
  const [error, setError] = useState("");
  const lastProcessedRef = useRef<number>(0);

  useEffect(() => {
    if (!open) {
      setError("");
      lastProcessedRef.current = 0;
      return;
    }

    // Reset ATM node so the next ESP32 scan is always seen as a NEW event,
    // even if it's the same user id as before.
    void update(ref(db, "atm"), {
      currentUser: 0,
      loginType: "",
      authenticated: false,
      pinEntered: "",
    });
    lastProcessedRef.current = 0;

    const unsub = listenAtm((s) => {
      const id = Number(s.currentUser);

      // Ignore null / zero / unchanged repeats
      if (!id || id === 0) return;
      if (id === lastProcessedRef.current) return;
      if (s.loginType !== "fingerprint") return;

      lastProcessedRef.current = id;

      if (id === expectedUserId) {
        onSuccess();
      } else {
        setError("Fingerprint does not match the logged-in user.");
      }
    });

    return () => unsub();
  }, [open, expectedUserId, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle>Confirm with fingerprint</DialogTitle>
          <DialogDescription>Place your finger on the sensor to authorize.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative rounded-full bg-primary/10 p-6">
              <Fingerprint className="h-16 w-16 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Waiting for sensor…</p>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </DialogContent>
    </Dialog>
  );
}
