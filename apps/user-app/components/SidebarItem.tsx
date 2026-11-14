"use client"
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export const SidebarItem = ({ href, title, icon }: { href: string; title: string; icon: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname()
    const selected = pathname === href

    return <div
        className={`flex items-center gap-3 mx-3 my-1 px-4 py-3 rounded-xl cursor-pointer transition ${
            selected
                ? "bg-[#e6f7fd] text-[#002970] border-l-4 border-[#00baf2]"
                : "text-slate-500 hover:bg-slate-100 hover:text-[#002970]"
        }`}
        onClick={() => {
            router.push(href);
        }}>
        <div className={selected ? "text-[#00baf2]" : ""}>
            {icon}
        </div>
        <div className="font-semibold text-sm">
            {title}
        </div>
    </div>
}