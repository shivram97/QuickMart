import { SearchBar } from "@/components/search/search-bar";
import { ProductGrid } from "@/components/products/product-grid";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Fresh Groceries</h1>
          <SearchBar />
        </div>
        <ProductGrid />
      </div>
    </div>
  );
}
