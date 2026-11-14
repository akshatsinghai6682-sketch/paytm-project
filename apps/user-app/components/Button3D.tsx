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
    return <Link href={href} className="group block [perspective:600px]">
        <div className="relative h-24 transition-transform duration-300 ease-out [transform-style:preserve-3d] group-hover:[transform:translateY(-6px)_rotateX(8deg)]">
            {/* bottom/side face gives the thickness */}
            <div className="absolute inset-0 translate-y-2 rounded-xl bg-[#002970] transition-all duration-300 group-hover:translate-y-3" />
            {/* top face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-100 bg-white text-[#002970] shadow-md transition-colors duration-300 group-hover:bg-[#00baf2] group-hover:text-white group-active:translate-y-1">
                <div className="h-6 w-6">{icon}</div>
                <div className="text-sm font-semibold">{label}</div>
            </div>
        </div>
    </Link>
}