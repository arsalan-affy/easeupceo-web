import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import MenuItemCard from "../components/MenuItemCard";
import CartBar from "../components/CartBar";
import { useLiveOrder } from "../context/LiveOrderContext";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const categoryName = searchParams.get("name");

  const { categories, products, supportNumber } = useLiveOrder();
  const [selectedCategory, setSelectedCategory] = useState(categoryId || categories[0]?._id);

  const filteredProducts = products.filter(
    (item) => item.item_category_id?.toLowerCase() === selectedCategory?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/live-order">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {supportNumber && (
              <a href={`tel:${supportNumber}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <Phone className="size-4" />
              </a>
            )}
            <Link to="/live-order/search">
              <Button variant="ghost" size="icon">
                <Search className="size-5 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-2xl mx-auto px-2 pb-2 flex overflow-x-auto gap-1.5 scrollbar-none">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/live-order/products?category=${cat._id}&name=${encodeURIComponent(cat.name)}`}
              onClick={() => setSelectedCategory(cat._id)}
              className={`shrink-0 px-3 py-1 rounded-full text-sm transition-colors ${
                cat._id === selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-2xl mx-auto px-4 py-4 pb-28">
        <h3 className="text-center text-sm font-semibold text-muted-foreground mb-3">{categoryName}</h3>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">No items in this category</p>
        ) : (
          filteredProducts.map((item) => <MenuItemCard key={item._id} product={item} />)
        )}
      </div>

      <CartBar />
    </div>
  );
}
