import { Logo } from "./logo";
import { Link } from "wouter";
import { Button } from "../ui/button";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function Navbar() {
  const { items } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <Link href="/">
          <a className="hover:opacity-80">
            <Logo />
          </a>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/orders">
            <a>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </a>
          </Link>
          
          <Button variant="outline" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
