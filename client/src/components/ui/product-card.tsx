import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "./card";
import { Button } from "./button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img 
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
        <p className="font-bold text-lg mt-2">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => addItem(product)}
          className="w-full"
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
