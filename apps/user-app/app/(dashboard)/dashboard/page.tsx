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
        redirect("/api/auth/signin");
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
        <div className="text-3xl text-[#002970] pt-8 mb-6 font-bold">
            {greeting()}, {name}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* LEFT COLUMN */}
            <div className="xl:col-span-3">
                <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-[#002970] to-[#00baf2] shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <WalletIcon />
                            </div>
                            <div className="text-sm opacity-80">Wallet Balance</div>
                        </div>
                        {phone && <div className="text-sm tracking-widest opacity-80">
                            •••• {phone.slice(-4)}
                        </div>}
                    </div>
                    <div className="text-4xl font-bold mt-4">₹ {rupees(amount)}</div>
                    <div className="flex gap-3 mt-5">
                        <Link href="/transfer" className="bg-white text-[#002970] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#e6f7fd] transition">
                            + Add
                        </Link>
                        <Link href="/p2p" className="bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/30 transition">
                            Send
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-5 mt-8 pb-3">
                    <Button3D href="/transfer" label="Add Money" icon={<PlusIcon />} />
                    <Button3D href="/p2p" label="Send Money" icon={<SendIcon />} />
                    <Button3D href="/transactions" label="History" icon={<ClockIcon />} />
                </div>

                <div className="pt-8">
                    <Card title="Recent Activity">
                        {activity.length === 0
                            ? <div className="text-center py-8 text-slate-500">No activity yet</div>
                            : <div className="pt-2">
                                {activity.map((a, i) => <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${a.sign === "-" ? "bg-red-50 text-red-600" : "bg-[#e6f7fd] text-[#002970]"}`}>
                                            {a.sign === "-" ? "↑" : "↓"}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">{a.title}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{a.time.toDateString()}</div>
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
                                </div>)}
                            </div>}
                    </Card>
                </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="xl:col-span-2 space-y-5">
                <StatCard label="Total added" value={`₹ ${rupees(totalAdded)}`} color="text-[#002970]" />
                <div className="grid grid-cols-2 gap-5">
                    <StatCard label="Successful deposits" value={String(successCount)} color="text-green-600" />
                    <StatCard label="Pending deposits" value={String(pendingCount)} color="text-amber-500" />
                </div>

                <div className="rounded-2xl p-6 bg-gradient-to-br from-[#00baf2] to-[#002970] text-white shadow-md">
                    <div className="text-xs uppercase tracking-widest opacity-80">Offer</div>
                    <div className="text-xl font-bold mt-1">Add ₹500, get a reward</div>
                    <div className="text-sm opacity-80 mt-1">Instant cashback credited to your wallet balance.</div>
                </div>
            </div>
        </div>
    </div>
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
    return <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 transition hover:-translate-y-1 hover:shadow-md">
        <div className="text-xs uppercase tracking-wider text-slate-400">{label}</div>
        <div className={`text-2xl font-bold mt-2 ${color}`}>{value}</div>
    </div>
}

function WalletIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" /></svg>
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