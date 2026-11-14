"use client";

interface AppbarProps {
    user?: {
        name?: string | null;
    },
    onSignin: () => void,
    onSignout: () => void
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between items-center px-6 py-3 bg-[#002970] shadow-md">
        <div className="group flex items-center gap-3 cursor-pointer">
            {/* 3D logo tile */}
            <div className="relative h-10 w-10">
                <div className="absolute inset-0 translate-y-1 rounded-xl bg-[#0a4fa8] transition-all duration-300 group-hover:translate-y-1.5" />
                <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-[#00baf2] text-lg font-extrabold text-[#002970] shadow-md transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-6 group-hover:bg-white">
                    P
                </div>
            </div>

            {/* wordmark + tagline */}
            <div className="leading-tight">
                <div className="text-xl font-bold text-white tracking-tight">
                    Pay<span className="text-[#00baf2]">TM</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                    Digital Wallet
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            {user?.name && <div className="text-sm text-white/80 hidden sm:block">
                {user.name}
            </div>}
            <button
                onClick={user ? onSignout : onSignin}
                className="bg-[#00baf2] hover:bg-[#00a3d6] text-[#002970] font-semibold text-sm px-4 py-2 rounded-lg transition">
                {user ? "Logout" : "Login"}
            </button>
        </div>
    </div>
}