import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@repo/ui/card";
import { authOptions } from "../../lib/auth";
import { Button3D } from "../../../components/Button3D";

type Activity = {
    title: string;
    time: Date;
    amount: number;
    sign: "+" | "-";
    status: string;
};

async function getData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/signin");
    }
    const userId = Number(session.user.id);

    const [user, balance, onRamp, sent, received] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.balance.findFirst({ where: { userId } }),
        prisma.onRampTransaction.findMany({ where: { userId }, orderBy: { startTime: "desc" } }),
        prisma.p2pTransfer.findMany({ where: { fromUserId: userId }, orderBy: { timestamp: "desc" }, take: 5 }),
        prisma.p2pTransfer.findMany({ where: { toUserId: userId }, orderBy: { timestamp: "desc" }, take: 5 })
    ]);

    // look up the other person's name/number for each transfer
    const otherIds = Array.from(new Set([
        ...sent.map(t => t.toUserId),
        ...received.map(t => t.fromUserId)
    ]));
    const others = await prisma.user.findMany({ where: { id: { in: otherIds } } });
    const label = (id: number) => {
        const u = others.find(o => o.id === id);
        return u?.name || u?.number || "user";
    };

    const activity: Activity[] = [
        ...onRamp.map(t => ({
            title: `Added from ${t.provider}`,
            time: t.startTime,
            amount: t.amount,
            sign: "+" as const,
            status: t.status
        })),
        ...sent.map(t => ({
            title: `Sent to ${label(t.toUserId)}`,
            time: t.timestamp,
            amount: t.amount,
            sign: "-" as const,
            status: "Success"
        })),
        ...received.map(t => ({
            title: `Received from ${label(t.fromUserId)}`,
            time: t.timestamp,
            amount: t.amount,
            sign: "+" as const,
            status: "Success"
        }))
    ]
        .sort((a, b) => b.time.getTime() - a.time.getTime())
        .slice(0, 6);

    const success = onRamp.filter(t => t.status === "Success");

    return {
        name: session?.user?.name || "there",
        phone: user?.number || "",
        amount: balance?.amount ?? 0,
        totalAdded: success.reduce((s, t) => s + t.amount, 0),
        successCount: success.length,
        pendingCount: onRamp.filter(t => t.status === "Processing").length,
        activity
    };
}

const rupees = (paise: number) => (paise / 100).toLocaleString("en-IN");

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

const pill: Record<string, string> = {
    Success: "bg-green-50 text-green-700 border-green-200",
    Processing: "bg-amber-50 text-amber-700 border-amber-200",
    Failure: "bg-red-50 text-red-700 border-red-200"
};

export default async function () {
    const { name, phone, amount, totalAdded, successCount, pendingCount, activity } = await getData();

    return <div className="w-full">
        {/* Apple-style clean header */}
        <div className="pt-2 mb-8">
            <div className="text-xs font-semibold tracking-wider uppercase text-[#86868b]">
                {greeting()}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mt-1">
                {name}
            </h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* LEFT COLUMN */}
            <div className="xl:col-span-3 space-y-8">
                {/* Apple Card Titanium Wallet */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#fbfbfd] to-[#eff1f5] p-7 text-[#1d1d1f] border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    {/* Iridescent shimmer */}
                    <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gradient-to-br from-amber-200/25 via-pink-200/25 to-indigo-200/25 blur-2xl pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-amber-200 via-amber-300 to-amber-100 border border-amber-400/50 shadow-inner flex items-center justify-center">
                                    <div className="h-3 w-5 border border-amber-500/40 rounded-xs" />
                                </div>
                                <span className="text-xs font-semibold tracking-wider uppercase text-[#86868b]">
                                    PayFlow  Card
                                </span>
                            </div>
                            {phone && <div className="text-xs font-mono tracking-widest text-[#86868b]">
                                •••• {phone.slice(-4)}
                            </div>}
                        </div>

                        <div className="mt-8">
                            <div className="text-xs font-medium uppercase tracking-wider text-[#86868b]">
                                Available Balance
                            </div>
                            <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] mt-1">
                                ₹ {rupees(amount)}
                            </div>
                        </div>

                        {/* Apple-style quick action pills */}
                        <div className="flex flex-wrap items-center gap-3 mt-8 pt-5 border-t border-black/[0.05]">
                            <Link href="/transfer" className="inline-flex items-center gap-1.5 bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-sm">
                                <span>+</span> Add Money
                            </Link>
                            <Link href="/p2p" className="inline-flex items-center gap-1.5 bg-black/[0.05] hover:bg-black/[0.08] text-[#1d1d1f] text-xs font-medium px-5 py-2.5 rounded-full transition-all active:scale-95">
                                <span>↑</span> Send Cash
                            </Link>
                            <Link href="/shop" className="inline-flex items-center gap-1.5 bg-black/[0.05] hover:bg-black/[0.08] text-[#1d1d1f] text-xs font-medium px-5 py-2.5 rounded-full transition-all active:scale-95">
                                Store
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Action Tiles */}
                <div className="grid grid-cols-3 gap-4">
                    <Button3D href="/transfer" label="Deposit" icon={<PlusIcon />} />
                    <Button3D href="/p2p" label="Transfer" icon={<SendIcon />} />
                    <Button3D href="/transactions" label="History" icon={<ClockIcon />} />
                </div>

                {/* Recent Activity */}
                <div>
                    <Card title="Latest Activity">
                        {activity.length === 0
                            ? <div className="text-center py-10 text-xs font-medium text-[#86868b]">No activity yet</div>
                            : <div className="divide-y divide-black/[0.04]">
                                {activity.map((a, i) => <div key={i} className="flex justify-between items-center py-3.5 first:pt-1 last:pb-1">
                                    <div className="flex items-center gap-3.5">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                                            a.sign === "-" ? "bg-black/[0.04] text-[#1d1d1f]" : "bg-emerald-50 text-emerald-600"
                                        }`}>
                                            {a.sign === "-" ? "↑" : "↓"}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium tracking-tight text-[#1d1d1f]">{a.title}</div>
                                            <div className="text-[#86868b] text-xs mt-0.5">{a.time.toDateString()}</div>
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
                                </div>)}
                            </div>}
                    </Card>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="xl:col-span-2 space-y-6">
                <StatCard label="Total Deposited" value={`₹ ${rupees(totalAdded)}`} />
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Completed" value={String(successCount)} subtitle="Transactions" />
                    <StatCard label="In Progress" value={String(pendingCount)} subtitle="Pending" />
                </div>

                {/* Apple Card Daily Cash offer banner */}
                <div className="rounded-3xl p-7 bg-[#1d1d1f] text-white shadow-sm relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 h-32 w-32 bg-white/[0.06] rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                        <span></span> Daily Cash
                    </div>
                    <div className="text-xl font-semibold tracking-tight mt-2">
                        Get instant rewards on deposits
                    </div>
                    <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
                        Add ₹500 or more via simulated NetBanking to enjoy instant simulated balance credits with zero fees.
                    </p>
                    <Link href="/transfer" className="inline-block mt-4 text-xs font-medium text-white underline underline-offset-4 hover:text-white/80">
                        Deposit now →
                    </Link>
                </div>
            </div>
        </div>
    </div>
}

function StatCard({ label, value, subtitle }: { label: string; value: string; subtitle?: string }) {
    return <div className="bg-white rounded-3xl border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="text-xs uppercase tracking-wider font-semibold text-[#86868b]">{label}</div>
        <div className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mt-1.5">{value}</div>
        {subtitle && <div className="text-[11px] text-[#86868b] mt-0.5">{subtitle}</div>}
    </div>
}

function PlusIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
}
function SendIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
}
function ClockIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
}