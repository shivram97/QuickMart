import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatus } from "@/components/orders/order-status";
import { Skeleton } from "@/components/ui/skeleton";

export default function Orders() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="space-y-4">
        {orders?.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Order #{order.id}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <OrderStatus status={order.status} />
              <p className="font-medium mt-4">
                Total: ₹{(order.total / 100).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
