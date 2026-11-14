"use client"
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export const SidebarItem = ({ href, title, icon }: { href: string; title: string; icon: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname()
    const selected = pathname === href

    return <div
        className={`flex items-center gap-3 mx-2 my-1 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
            selected
                ? "bg-black/[0.06] text-[#1d1d1f] font-semibold shadow-xs"
                : "text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.03] font-medium"
        }`}
        onClick={() => {
            router.push(href);
        }}>
        <div className={`h-5 w-5 ${selected ? "text-[#1d1d1f]" : "text-[#86868b]"}`}>
            {icon}
        </div>
        <div className="text-sm tracking-tight">
            {title}
        </div>
    </div>
}