import type { ReactNode } from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}): JSX.Element {
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-black/[0.05] p-6 sm:p-7 transition-all">
      <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f] mb-4">
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}