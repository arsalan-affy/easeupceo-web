import React from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveOrder } from "../context/LiveOrderContext";

export default function MenuItemCard({ product }) {
  const { cart, addToCart, updateQuantity } = useLiveOrder();
  const cartItem = cart.find((item) => item._id == product._id);
  const inCart = cartItem && cartItem.quantity >= 1;
  const kotSent = +cartItem?.kot_sent_quantity || 0;
  const kotDisabled = kotSent >= (+cartItem?.quantity || 0) && kotSent > 0;

  return (
    <div className="flex items-start justify-between py-4 border-b border-dashed border-border last:border-b-0">
      <div className="flex-1 min-w-0 pr-3">
        <h3 className="text-sm font-semibold text-foreground leading-6">{product.name}</h3>
        <span className="text-sm font-semibold text-brand">
          {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(product.sales_rate)}
        </span>
        {product.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 shrink-0">
        {product.image_urls?.[0]?.url ? (
          <img
            src={product.image_urls[0].url}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fb = e.currentTarget.nextSibling;
              if (fb) fb.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="w-16 h-16 rounded-lg bg-secondary text-foreground items-center justify-center text-lg font-semibold"
          style={{ display: product.image_urls?.[0]?.url ? 'none' : 'flex' }}
        >
          {(product.name || '?').trim().charAt(0).toUpperCase()}
        </div>

        {inCart ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-7 rounded-full"
                disabled={kotDisabled}
                onClick={() => updateQuantity(product._id, "subtract")}
              >
                <Minus className="size-3" />
              </Button>
              <span className="w-6 text-center text-sm font-medium">
                {cartItem.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-7 rounded-full"
                onClick={() => updateQuantity(product._id, "add")}
              >
                <Plus className="size-3" />
              </Button>
            </div>
            {kotSent > 0 && (
              <span className="text-[10px] text-muted-foreground">{kotSent} sent to kitchen</span>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold px-5 shadow-sm"
            onClick={() => addToCart(product)}
          >
            ADD
          </Button>
        )}
      </div>
    </div>
  );
}
