"use client"
import { Card } from "@repo/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

const QUICK_CONTACTS = [
    { name: "Alice", number: "1111111111", avatar: "A", color: "bg-blue-100 text-blue-700" },
    { name: "Bob", number: "2222222222", avatar: "B", color: "bg-purple-100 text-purple-700" },
    { name: "Charlie", number: "3333333333", avatar: "C", color: "bg-emerald-100 text-emerald-700" }
];

const QUICK_AMOUNTS = [50, 100, 500, 1000];

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleSelectContact = (phone: string) => {
        setNumber(phone);
    };

    const handleSend = async () => {
        const rupees = Number(amount);
        if (!number) {
            toast.error("Please enter or select a recipient phone number");
            return;
        }
        if (!rupees || rupees <= 0) {
            toast.error("Please enter an amount greater than 0");
            return;
        }
        setLoading(true);
        try {
            const res = await p2pTransfer(number.trim(), Math.round(rupees * 100));
            if (!res.ok) {
                toast.error(res.message);
                setLoading(false);
                return;
            }
            toast.success(`Successfully sent ₹${rupees} to ${number}!`);
            setAmount("");
        } catch (e) {
            toast.error("Transfer failed. Please check balance and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title=" Pay Cash Transfer">
            <div className="space-y-6">
                {/* Quick Contacts */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-2.5">
                        Recent Contacts
                    </label>
                    <div className="flex items-center gap-3">
                        {QUICK_CONTACTS.map((c) => {
                            const isSelected = number === c.number;
                            return (
                                <button
                                    key={c.number}
                                    type="button"
                                    onClick={() => handleSelectContact(c.number)}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all active:scale-95 ${
                                        isSelected
                                            ? "bg-white border-[#1d1d1f] ring-2 ring-[#1d1d1f]/10 shadow-xs"
                                            : "bg-[#f5f5f7] border-transparent hover:bg-[#ebebed]"
                                    }`}
                                >
                                    <div className={`h-7 w-7 rounded-full ${c.color} flex items-center justify-center font-bold text-xs`}>
                                        {c.avatar}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-semibold text-[#1d1d1f] leading-none">{c.name}</div>
                                        <div className="text-[10px] text-[#86868b] mt-0.5 font-mono">•••{c.number.slice(-4)}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Recipient Phone Input */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-2">
                        Recipient Mobile
                    </label>
                    <div className="flex items-center bg-[#f5f5f7] rounded-2xl px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10 transition-all">
                        <span className="text-xs font-semibold text-[#86868b] mr-2">🇮🇳 +91</span>
                        <input
                            type="tel"
                            maxLength={10}
                            value={number}
                            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter 10-digit number"
                            className="w-full bg-transparent text-sm font-medium text-[#1d1d1f] outline-none placeholder:text-[#86868b]"
                        />
                        {number.length === 10 && (
                            <span className="text-emerald-600 text-xs font-semibold px-2 py-0.5 bg-emerald-50 rounded-full">
                                ✓ Valid
                            </span>
                        )}
                    </div>
                </div>

                {/* Amount input */}
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-2">
                        Transfer Amount
                    </label>
                    <div className="flex items-center bg-[#f5f5f7] rounded-2xl px-5 py-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10 transition-all">
                        <span className="text-2xl font-semibold text-[#86868b] mr-2">₹</span>
                        <input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
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
                                onClick={() => setAmount(String(amt))}
                                className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all active:scale-95 ${
                                    Number(amount) === amt
                                        ? "bg-[#1d1d1f] text-white shadow-xs"
                                        : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.06]"
                                }`}
                            >
                                ₹{amt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Send Button */}
                <div className="pt-2">
                    <button
                        onClick={handleSend}
                        disabled={loading || !number || !amount || Number(amount) <= 0}
                        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium text-sm py-3.5 transition-all active:scale-[0.98] shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                <span>Processing Transfer...</span>
                            </>
                        ) : (
                            <span>
                                Send ₹{amount || "0"} with  Pay
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </Card>
    );
}