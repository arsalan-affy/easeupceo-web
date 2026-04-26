import React from "react";
import { Outlet } from "react-router-dom";
import { QrCode } from "lucide-react";
import { LiveOrderProvider, useLiveOrder } from "./context/LiveOrderContext";

function LiveOrderGate() {
  const { tableId, loading, error } = useLiveOrder();

  if (!tableId && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="flex justify-center mb-4">
            <div className="size-16 rounded-full bg-secondary flex items-center justify-center">
              <QrCode className="size-8 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Scan QR Code</h1>
          <p className="text-muted-foreground">
            Please scan the QR code available on your table to start ordering.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            If you&apos;re unable to scan, please contact the staff for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-600 text-white text-sm px-4 py-2 text-center">
          {error}
        </div>
      )}
      <Outlet />
    </>
  );
}

export default function LiveOrderLayout() {
  return (
    <LiveOrderProvider>
      <LiveOrderGate />
    </LiveOrderProvider>
  );
}
