import { Card } from "@repo/ui/card"

const statusPill: Record<string, string> = {
    Success: "bg-green-50 text-green-700 border-green-200",
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
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8 text-slate-500">
                No recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map((t, i) => <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#e6f7fd] text-[#002970] flex items-center justify-center text-xs font-bold">
                        {t.provider.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-800">
                            Added from {t.provider}
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5">
                            {t.time.toDateString()}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className={`font-semibold ${t.status === "Success" ? "text-green-600" : "text-slate-400"}`}>
                        + ₹ {(t.amount / 100).toLocaleString("en-IN")}
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusPill[t.status] || ""}`}>
                        {t.status}
                    </span>
                </div>
            </div>)}
        </div>
    </Card>
}