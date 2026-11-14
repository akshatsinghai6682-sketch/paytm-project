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
      className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-150 ${
        selected ? "text-[#1d1d1f] font-semibold" : "text-[#86868b] hover:text-[#1d1d1f]"
      }`}
    >
      <div className={`h-5 w-5 ${selected ? "text-[#1d1d1f]" : "text-[#86868b]"}`}>{icon}</div>
      <span className="text-[10px] mt-1 font-medium tracking-tight">{title}</span>
    </Link>
  );
};
