"use client";

import { useState } from "react";
import { Card } from "@repo/ui/card";

export type Activity = {
    title: string;
    time: number;
    amount: number;
    sign: "+" | "-";
    status: string;
    type: "added" | "sent" | "received";
};

const pill: Record<string, string> = {
    Success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Failure: "bg-red-50 text-red-700 border-red-200"
};

const filters = [
    { key: "all", label: "All" },
    { key: "added", label: "Deposits" },
    { key: "sent", label: "Sent" },
    { key: "received", label: "Received" }
] as const;

const rupees = (paise: number) => (paise / 100).toLocaleString("en-IN");

export const TransactionsList = ({ items }: { items: Activity[] }) => {
    const [filter, setFilter] = useState<string>("all");
    const [query, setQuery] = useState("");

    const visible = items.filter(a =>
        (filter === "all" || a.type === filter) &&
        a.title.toLowerCase().includes(query.toLowerCase())
    );

    const exportCsv = () => {
        const rows = [
            ["Date", "Description", "Type", "Status", "Amount (INR)"],
            ...visible.map(a => [
                new Date(a.time).toDateString(),
                a.title,
                a.type,
                a.status,
                `${a.sign}${a.amount / 100}`
            ])
        ];
        const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    return <Card title="Statement Activity">
        <div className="space-y-4">
            {/* Filter pills and CSV button */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 p-1 bg-[#f5f5f7] rounded-full">
                    {filters.map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all active:scale-95 ${
                                filter === f.key
                                    ? "bg-[#1d1d1f] text-white shadow-xs"
                                    : "text-[#86868b] hover:text-[#1d1d1f]"
                            }`}>
                            {f.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={exportCsv}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.08] transition-all active:scale-95">
                    <span>↓</span> Export CSV
                </button>
            </div>

            {/* Apple-style search input */}
            <div className="relative flex items-center bg-[#f5f5f7] rounded-2xl px-4 py-2.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10 transition-all">
                <svg className="h-4 w-4 text-[#86868b] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by name, bank, or transaction..."
                    className="w-full bg-transparent text-xs font-medium text-[#1d1d1f] outline-none placeholder:text-[#86868b]"
                />
                {query && (
                    <button onClick={() => setQuery("")} className="text-[#86868b] text-xs hover:text-[#1d1d1f]">
                        ✕
                    </button>
                )}
            </div>

            {/* Transaction List */}
            {visible.length === 0 ? (
                <div className="text-center py-12 text-[#86868b] text-xs font-medium">
                    No matching activity found
                </div>
            ) : (
                <div className="divide-y divide-black/[0.04]">
                    {visible.map((a, i) => (
                        <div key={i} className="flex justify-between items-center py-3.5 first:pt-1 last:pb-1">
                            <div className="flex items-center gap-3.5">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${
                                    a.sign === "-" ? "bg-black/[0.04] text-[#1d1d1f]" : "bg-emerald-50 text-emerald-600"
                                }`}>
                                    {a.sign === "-" ? "↑" : "↓"}
                                </div>
                                <div>
                                    <div className="text-sm font-medium tracking-tight text-[#1d1d1f]">{a.title}</div>
                                    <div className="text-[#86868b] text-xs mt-0.5">{new Date(a.time).toDateString()}</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className={`text-sm font-semibold tracking-tight ${a.sign === "-" ? "text-[#1d1d1f]" : "text-emerald-600"}`}>
                                    {a.sign} ₹ {rupees(a.amount)}
                                </div>
                                <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${pill[a.status] || "bg-black/[0.03] text-[#86868b] border-transparent"}`}>
                                    {a.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </Card>
}