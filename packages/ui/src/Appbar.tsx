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
    return <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 py-3.5">
            <a href={user ? "/dashboard" : "/"} className="group flex items-center gap-2.5 cursor-pointer">
                {/* Apple-style minimalist logo */}
                <div className="h-8 w-8 rounded-xl bg-[#1d1d1f] flex items-center justify-center text-white text-sm font-semibold shadow-sm transition-transform duration-200 group-hover:scale-105">
                    
                </div>

                {/* Wordmark */}
                <div className="leading-tight">
                    <div className="text-base font-semibold tracking-tight text-[#1d1d1f]">
                        Pay<span className="text-[#0071e3]">Flow</span>
                    </div>
                    <div className="text-[10px] tracking-wide text-[#86868b] font-medium">
                        Wallet
                    </div>
                </div>
            </a>

            <div className="flex items-center gap-3">
                {user?.name && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/[0.04] rounded-full text-xs font-medium text-[#1d1d1f]">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="hidden sm:inline text-[#86868b]">Signed in as</span>
                        <span className="font-semibold">{user.name}</span>
                    </div>
                )}
                <button
                    onClick={user ? onSignout : onSignin}
                    className="rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium text-xs px-4 py-2 transition-all active:scale-95 shadow-sm"
                >
                    {user ? "Sign Out" : "Sign In"}
                </button>
            </div>
        </div>
    </header>
}