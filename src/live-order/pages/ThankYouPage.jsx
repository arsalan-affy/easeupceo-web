import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveOrder } from "../context/LiveOrderContext";

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useLiveOrder();
  const invoiceNumber = location.state?.invoiceNumber;

  function handleBackToMenu() {
    clearCart();
    navigate("/live-order");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="size-16 rounded-full gradient-brand flex items-center justify-center shadow-brand">
            <CheckCircle className="size-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Thank You!</h1>
        {invoiceNumber && (
          <p className="text-foreground font-semibold mb-2">Order #{invoiceNumber}</p>
        )}
        <p className="text-muted-foreground mb-6">
          Your order has been placed successfully and will be served shortly.
        </p>
        <Button onClick={handleBackToMenu} className="gradient-brand text-white px-8">
          Back to Menu
        </Button>
      </div>
    </div>
  );
}
