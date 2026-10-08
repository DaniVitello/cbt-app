"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-lg border px-4 py-3 shadow-lg",
        type === "success" && "border-green-200 bg-green-50 text-green-800",
        type === "error" && "border-red-200 bg-red-50 text-red-800",
        type === "info" && "border-blue-200 bg-blue-50 text-blue-800",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
