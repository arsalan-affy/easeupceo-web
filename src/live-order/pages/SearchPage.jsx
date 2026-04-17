import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MenuItemCard from "../components/MenuItemCard";
import CartBar from "../components/CartBar";
import { useLiveOrder } from "../context/LiveOrderContext";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { products } = useLiveOrder();
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return products.filter((item) =>
      item.name?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, products]);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-input rounded-lg pl-9 pr-3 py-2 text-sm bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        {query.trim() === "" ? (
          <p className="text-center text-sm text-muted-foreground py-12">Start typing to search the menu</p>
        ) : results.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">No items found for &ldquo;{query}&rdquo;</p>
        ) : (
          results.map((item) => <MenuItemCard key={item._id} product={item} />)
        )}
      </div>

      <CartBar />
    </div>
  );
}
