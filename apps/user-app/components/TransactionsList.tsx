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
    Success: "bg-green-50 text-green-700 border-green-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Failure: "bg-red-50 text-red-700 border-red-200"
};

const filters = [
    { key: "all", label: "All" },
    { key: "added", label: "Added" },
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

    return <Card title="All activity">
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 flex-wrap">
                {filters.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`text-sm px-4 py-1.5 rounded-full border transition ${
                            filter === f.key
                                ? "bg-[#002970] text-white border-[#002970]"
                                : "bg-white text-slate-600 border-slate-300 hover:border-[#002970]"
                        }`}>
                        {f.label}
                    </button>
                ))}
            </div>
            <button
                onClick={exportCsv}
                className="text-sm px-4 py-1.5 rounded-lg border border-slate-300 text-[#002970] hover:bg-[#e6f7fd] transition">
                Download CSV
            </button>
        </div>

        <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name"
            className="mt-4 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#00baf2] focus:border-[#00baf2] p-2.5"
        />

        {visible.length === 0
            ? <div className="text-center py-10 text-slate-500 text-sm">
                No activity matches. Try another filter.
            </div>
            : <div className="pt-2">
                {visible.map((a, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${a.sign === "-" ? "bg-red-50 text-red-600" : "bg-[#e6f7fd] text-[#002970]"}`}>
                                {a.sign === "-" ? "↑" : "↓"}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-800">{a.title}</div>
                                <div className="text-slate-500 text-xs mt-0.5">{new Date(a.time).toDateString()}</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <div className={`font-semibold ${a.sign === "-" ? "text-red-600" : a.status === "Success" ? "text-green-600" : "text-slate-400"}`}>
                                {a.sign} ₹ {rupees(a.amount)}
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pill[a.status] || ""}`}>
                                {a.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>}
    </Card>
}