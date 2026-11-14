"use client";

import { ReactNode, useState } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
}

export const Button = ({ onClick, children, disabled }: ButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      disabled={loading || disabled}
      className="inline-flex items-center justify-center gap-2 text-white bg-[#1d1d1f] hover:bg-black active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-black/10 font-medium rounded-full text-sm px-6 py-3 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}
      {loading ? "Processing…" : children}
    </button>
  );
};