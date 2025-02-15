import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import Orders from "@/pages/orders";
import { Navbar } from "./components/layout/navbar";
import { CartSheet } from "./components/cart/cart-sheet";
import { CartProvider } from "@/hooks/use-cart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={Auth} />
      <Route path="/orders" component={Orders} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Navbar />
        <Router />
        <CartSheet />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;