import type { ReactNode } from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}): JSX.Element {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h1 className="text-lg font-semibold text-[#002970] border-b border-slate-100 pb-3">
        {title}
      </h1>
      <div>{children}</div>
    </div>
  );
}