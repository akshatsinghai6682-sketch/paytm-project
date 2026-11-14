export const BalanceCard = ({ amount, locked }: {
    amount: number;
    locked: number;
}) => {
    const rupees = (paise: number) => (paise / 100).toLocaleString("en-IN");

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#fbfbfd] to-[#f0f2f5] p-7 text-[#1d1d1f] border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
            {/* Apple Card iridescent background glow */}
            <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gradient-to-br from-orange-200/30 via-pink-200/30 to-indigo-200/30 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-100/40 via-sky-100/30 to-transparent blur-xl pointer-events-none" />

            <div className="relative z-10">
                {/* Header with chip and contactless mark */}
                <div className="flex items-center justify-between pb-6">
                    <div className="flex items-center gap-2">
                        {/* Metallic chip */}
                        <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-amber-200 via-amber-300 to-amber-100 border border-amber-400/50 shadow-inner flex items-center justify-center">
                            <div className="h-3 w-5 border border-amber-500/40 rounded-xs" />
                        </div>
                        {/* Contactless waves icon */}
                        <svg className="h-5 w-5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.288 15.038a5.25 5.25 0 0 1 0-6.076M11.603 17.5a8.25 8.25 0 0 0 0-11M14.919 19.962a11.25 11.25 0 0 0 0-15.924" />
                        </svg>
                    </div>
                    <span className="text-xs font-semibold tracking-wider text-[#86868b] uppercase">
                         Card
                    </span>
                </div>

                {/* Balance display */}
                <div className="text-xs font-medium uppercase tracking-wider text-[#86868b]">
                    Total Balance
                </div>
                <div className="text-4xl font-semibold tracking-tight text-[#1d1d1f] mt-1">
                    ₹ {rupees(amount + locked)}
                </div>

                {/* Sub balances */}
                <div className="flex items-center gap-6 mt-6 pt-5 border-t border-black/[0.05] text-xs">
                    <div>
                        <span className="text-[#86868b]">Available</span>
                        <div className="font-semibold text-sm text-[#1d1d1f] mt-0.5">₹ {rupees(amount)}</div>
                    </div>
                    {locked > 0 && <div>
                        <span className="text-[#86868b]">On Hold</span>
                        <div className="font-semibold text-sm text-[#1d1d1f] mt-0.5">₹ {rupees(locked)}</div>
                    </div>}
                    <div className="ml-auto text-right">
                        <span className="text-[#86868b]">Type</span>
                        <div className="font-medium text-xs text-[#1d1d1f] mt-0.5">Titanium Account</div>
                    </div>
                </div>
            </div>
        </div>
    );
}