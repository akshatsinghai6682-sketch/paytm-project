"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export const MobileNavItem = ({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: ReactNode;
}) => {
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center flex-1 py-1.5 transition ${
        selected ? "text-[#002970] font-semibold" : "text-slate-400 hover:text-slate-600"
      }`}
    >
      <div className={`h-5 w-5 ${selected ? "text-[#00baf2]" : ""}`}>{icon}</div>
      <span className="text-[11px] mt-0.5 tracking-tight">{title}</span>
    </Link>
  );
};
