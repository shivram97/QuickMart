import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-muted-foreground text-sm mt-1">{product.description}</p>
        <p className="text-primary font-semibold mt-2">
          ₹{(product.price / 100).toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={() => addItem(product)}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
