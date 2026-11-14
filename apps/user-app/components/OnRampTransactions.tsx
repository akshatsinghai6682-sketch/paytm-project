import { Card } from "@repo/ui/card"

const statusPill: Record<string, string> = {
    Success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Failure: "bg-red-50 text-red-700 border-red-200"
};

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Deposits">
            <div className="text-center py-10 text-xs font-medium text-[#86868b]">
                No deposit history yet
            </div>
        </Card>
    }
    return <Card title="Recent Deposits">
        <div className="divide-y divide-black/[0.04]">
            {transactions.map((t, i) => <div key={i} className="flex justify-between items-center py-3.5 first:pt-1 last:pb-1">
                <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-full bg-black/[0.04] text-[#1d1d1f] flex items-center justify-center text-xs font-bold">
                        ↓
                    </div>
                    <div>
                        <div className="text-sm font-medium tracking-tight text-[#1d1d1f]">
                            Added from {t.provider}
                        </div>
                        <div className="text-[#86868b] text-xs mt-0.5">
                            {t.time.toDateString()}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className={`text-sm font-semibold tracking-tight ${t.status === "Success" ? "text-emerald-600" : "text-[#86868b]"}`}>
                        + ₹ {(t.amount / 100).toLocaleString("en-IN")}
                    </div>
                    <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${statusPill[t.status] || "bg-black/[0.03] text-[#86868b] border-transparent"}`}>
                        {t.status}
                    </span>
                </div>
            </div>)}
        </div>
    </Card>
}