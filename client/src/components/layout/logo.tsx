import { Truck } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Truck className="h-6 w-6 text-primary" />
      <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        QuickMart
      </span>
    </div>
  );
}
