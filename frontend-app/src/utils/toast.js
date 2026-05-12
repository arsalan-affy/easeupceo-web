// src/utils/toast.js
import { toast } from "react-hot-toast";

/**
 * Centralized Toast Utility
 * Usage: showToast("success", "Message");
 * Types: success | error | warning | info
 */
export const showToast = (type, message) => {
  const baseOptions = {
    position: "top-center", // consistent placement
    duration: 3000,
  };

  const styles = {
    success: { background: "#10B981", color: "#fff" },
    error: { background: "#EF4444", color: "#fff" },
    warning: { background: "#F59E0B", color: "#fff" },
    info: { background: "#3B82F6", color: "#fff" },
  };

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const style = {
    ...styles[type],
    fontWeight: 500,
  };

  switch (type) {
    case "success":
      toast.success(message, { ...baseOptions, icon: icons[type], style });
      break;
    case "error":
      toast.error(message, { ...baseOptions, icon: icons[type], style });
      break;
    default:
      toast(message, { ...baseOptions, icon: icons[type] || "🔔", style });
      break;
  }
};
