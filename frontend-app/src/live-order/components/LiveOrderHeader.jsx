import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveOrder } from "../context/LiveOrderContext";

export default function LiveOrderHeader() {
  const { tableName, supportNumber, mode } = useLiveOrder();
  const navigate = useNavigate();
  const isDelivery = mode == "delivery";

  return (
    <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/live-order/search")}>
            <Search className="size-5 text-muted-foreground" />
          </Button>

          <div className="flex items-center gap-3">
            {supportNumber && (
              <a href={`tel:${supportNumber}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="size-4" />
                <span className="hidden sm:inline">Support</span>
              </a>
            )}
            <div className="text-sm font-semibold text-foreground bg-secondary px-3 py-1 rounded-full">
              {isDelivery ? "Delivery Order" : `Table: ${tableName}`}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
