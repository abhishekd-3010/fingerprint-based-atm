import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onClose: () => void;
  expectedPin: string;
  onSuccess: () => void;
  title?: string;
  description?: string;
};

export function PINModal({ open, onClose, expectedPin, onSuccess, title = "Enter PIN", description = "Confirm with your 4-digit PIN" }: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === expectedPin) {
      setPin("");
      setError("");
      onSuccess();
    } else {
      setError("Incorrect PIN. Try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setPin(""); setError(""); onClose(); } }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Input
            autoFocus
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="text-center text-2xl tracking-[0.5em]"
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={pin.length < 4}>Confirm</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
