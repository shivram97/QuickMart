import { Order } from "@shared/schema";
import {
  Clock,
  PackageCheck,
  Truck,
  CheckCircle,
  LucideIcon,
} from "lucide-react";

interface OrderStatusProps {
  status: Order["status"];
}

const statusConfig: Record<
  string,
  { icon: LucideIcon; label: string; color: string }
> = {
  pending: {
    icon: Clock,
    label: "Order Confirmed",
    color: "text-yellow-500",
  },
  preparing: {
    icon: PackageCheck,
    label: "Preparing Order",
    color: "text-blue-500",
  },
  delivering: {
    icon: Truck,
    label: "Out for Delivery",
    color: "text-purple-500",
  },
  delivered: {
    icon: CheckCircle,
    label: "Delivered",
    color: "text-green-500",
  },
};

export function OrderStatus({ status }: OrderStatusProps) {
  const config = statusConfig[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-5 w-5 ${config.color}`} />
      <span className="font-medium">{config.label}</span>
    </div>
  );
}
