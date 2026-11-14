"use client"
import { Card } from "@repo/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOnRampTransaction } from "../app/lib/actions/createOnRamptxn";

const SUPPORTED_BANKS = [
    { name: "HDFC Bank", short: "HDFC", color: "bg-[#004c8f] text-white" },
    { name: "Axis Bank", short: "Axis", color: "bg-[#861f41] text-white" },
    { name: "State Bank of India", short: "SBI", color: "bg-[#280071] text-white" },
    { name: "ICICI Bank", short: "ICICI", color: "bg-[#b02a30] text-white" }
];

const QUICK_AMOUNTS = [200, 500, 1000, 2500];

export const AddMoney = () => {
    const router = useRouter();
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "HDFC Bank");
    const [value, setValue] = useState<number | "">("");
    const [loading, setLoading] = useState(false);

    const handleQuickSelect = (amt: number) => {
        setValue(amt);
    };

    const handleDeposit = async () => {
        const numericVal = Number(value);
        if (!numericVal || numericVal <= 0) {
            toast.error("Please enter an amount greater than 0");
            return;
        }
        setLoading(true);
        toast.info(`Connecting to ${provider} NetBanking...`);
        try {
            const res = await createOnRampTransaction(provider, numericVal);
            if (res?.message !== "Done" || !res.token) {
                toast.error("Couldn't initialize deposit. Please log in and retry.");
                setLoading(false);
                return;
            }

            router.push(`/bank/gateway?token=${res.token}&provider=${encodeURIComponent(provider)}&amount=${numericVal}`);
        } catch (e) {
            toast.error("Failed to connect to gateway. Please retry.");
            setLoading(false);
        }
    };

    return <Card title="Deposit via NetBanking">
        <div className="space-y-6">
            {/* Amount input */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-2">
                    Enter Amount
                </label>
                <div className="relative flex items-center bg-[#f5f5f7] rounded-2xl px-5 py-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10 transition-all">
                    <span className="text-2xl font-semibold text-[#86868b] mr-2">₹</span>
                    <input
                        type="number"
                        min="1"
                        value={value}
                        onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="0.00"
                        className="w-full bg-transparent text-3xl font-semibold tracking-tight text-[#1d1d1f] outline-none placeholder:text-[#86868b]/40"
                    />
                </div>

                {/* Quick amount chips */}
                <div className="flex items-center gap-2 mt-3">
                    {QUICK_AMOUNTS.map((amt) => (
                        <button
                            key={amt}
                            type="button"
                            onClick={() => handleQuickSelect(amt)}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all active:scale-95 ${
                                value === amt
                                    ? "bg-[#1d1d1f] text-white shadow-xs"
                                    : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.06]"
                            }`}
                        >
                            ₹{amt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bank Selector Cards */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-2">
                    Select Your Bank
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                    {SUPPORTED_BANKS.map((b) => {
                        const isSelected = provider === b.name;
                        return (
                            <button
                                key={b.name}
                                type="button"
                                onClick={() => setProvider(b.name)}
                                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                                    isSelected
                                        ? "bg-white border-[#1d1d1f] ring-2 ring-[#1d1d1f]/10 shadow-sm"
                                        : "bg-[#f5f5f7] border-transparent hover:bg-[#ebebed] text-[#86868b]"
                                }`}
                            >
                                <div className={`h-8 w-8 rounded-xl ${b.color} flex items-center justify-center font-bold text-[10px] shadow-xs`}>
                                    {b.short}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className={`text-xs font-semibold truncate ${isSelected ? "text-[#1d1d1f]" : "text-[#1d1d1f]/80"}`}>
                                        {b.name}
                                    </div>
                                    <div className="text-[10px] text-[#86868b]">Instant OTP</div>
                                </div>
                                {isSelected && (
                                    <div className="h-4 w-4 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center text-[10px]">
                                        ✓
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Apple-style Pay button */}
            <div className="pt-2">
                <button
                    onClick={handleDeposit}
                    disabled={loading || !value || Number(value) <= 0}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium text-sm py-3.5 transition-all active:scale-[0.98] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            <span>Redirecting to NetBanking...</span>
                        </>
                    ) : (
                        <span>
                            Continue with {provider} {value ? `• ₹${value}` : ""}
                        </span>
                    )}
                </button>
            </div>
        </div>
    </Card>
}