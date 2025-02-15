import { Search } from "lucide-react";
import { Input } from "../ui/input";

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search for groceries..."
        className="pl-9 w-full md:w-[300px]"
      />
    </div>
  );
}
