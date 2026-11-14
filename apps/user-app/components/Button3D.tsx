import Link from "next/link";
import React from "react";

export const Button3D = ({
    href,
    label,
    icon
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
}) => {
    return <Link href={href} className="group block">
        <div className="bg-white hover:bg-[#fafafc] active:scale-[0.97] rounded-3xl p-5 flex flex-col items-center justify-center gap-2.5 border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200">
            <div className="h-11 w-11 rounded-full bg-[#f5f5f7] text-[#1d1d1f] group-hover:bg-[#1d1d1f] group-hover:text-white flex items-center justify-center transition-colors duration-200">
                <div className="h-5 w-5">{icon}</div>
            </div>
            <div className="text-xs font-semibold tracking-tight text-[#1d1d1f]">{label}</div>
        </div>
    </Link>
}