import React from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import LiveOrderHeader from "../components/LiveOrderHeader";
import CartBar from "../components/CartBar";
import { useLiveOrder } from "../context/LiveOrderContext";

export default function CategoriesPage() {
  const { categories, loading } = useLiveOrder();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LiveOrderHeader />

      <div className="max-w-2xl mx-auto px-4 py-5">
        <h2 className="text-lg font-bold text-foreground mb-4">What would you like to order?</h2>

        {categories.length == 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">No categories yet</p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 pb-24">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/live-order/products?category=${cat._id}&name=${encodeURIComponent(cat.name)}`}
              className="group relative block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-44 overflow-hidden">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full gradient-brand opacity-80" />
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
                />
              </div>
              <div className="absolute inset-0 flex items-end p-3">
                <span className="text-white font-semibold text-base drop-shadow-md">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <CartBar />
    </div>
  );
}
