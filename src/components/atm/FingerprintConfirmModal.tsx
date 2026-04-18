import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import { listenAtm } from "@/lib/atm";

type Props = {
  open: boolean;
  onClose: () => void;
  expectedUserId: number;
  onSuccess: () => void;
};

// Re-scan modal for fingerprint users. Watches atm/currentUser for a match.
export function FingerprintConfirmModal({ open, onClose, expectedUserId, onSuccess }: Props) {
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) { setError(""); return; }
    // Snapshot of the currentUser when modal opens — only react to NEW scans.
    let baseline: number | null = null;
    const unsub = listenAtm((s) => {
      if (baseline === null) {
        baseline = s.currentUser;
        return;
      }
      if (s.loginType === "fingerprint" && s.currentUser !== 0 && s.currentUser !== baseline) {
        if (s.currentUser === expectedUserId) {
          onSuccess();
        } else {
          setError("Fingerprint does not match the logged-in user.");
        }
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
