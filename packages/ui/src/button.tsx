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
      className="inline-flex items-center justify-center gap-2 text-white bg-[#002970] hover:bg-[#0a3a8a] focus:outline-none focus:ring-4 focus:ring-[#00baf2]/40 font-semibold rounded-lg text-sm px-6 py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {loading ? "Processing…" : children}
    </button>
  );
};