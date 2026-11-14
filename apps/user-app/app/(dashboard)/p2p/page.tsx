import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { SendCard } from "../../../components/SendCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { Card } from "@repo/ui/card";

async function getP2PData() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/signin");
    }
    const userId = Number(session.user.id);

    const [balance, sent, received] = await Promise.all([
        prisma.balance.findFirst({ where: { userId } }),
        prisma.p2pTransfer.findMany({
            where: { fromUserId: userId },
            orderBy: { timestamp: "desc" },
            take: 6,
            include: { toUser: true }
        }),
        prisma.p2pTransfer.findMany({
            where: { toUserId: userId },
            orderBy: { timestamp: "desc" },
            take: 6,
            include: { fromUser: true }
        })
    ]);

    const combined = [
        ...sent.map(t => ({
            id: t.id,
            name: t.toUser.name || t.toUser.number,
            number: t.toUser.number,
            amount: t.amount,
            time: t.timestamp,
            type: "sent" as const
        })),
        ...received.map(t => ({
            id: t.id,
            name: t.fromUser.name || t.fromUser.number,
            number: t.fromUser.number,
            amount: t.amount,
            time: t.timestamp,
            type: "received" as const
        }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 6);

    return {
        balance: {
            amount: balance?.amount || 0,
            locked: balance?.locked || 0
        },
        transfers: combined
    };
}

export default async function () {
    const { balance, transfers } = await getP2PData();

    return (
        <div className="w-full">
            <div className="pt-2 mb-8">
                <div className="text-xs font-semibold tracking-wider uppercase text-[#86868b]">
                    Instant Peer-to-Peer
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mt-1">
                     Pay Cash
                </h1>
            </div>
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                <div>
                    <SendCard />
                </div>
                <div className="space-y-6">
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                    <Card title="Transfer History">
                        {transfers.length === 0 ? (
                            <div className="text-center py-10 text-xs font-medium text-[#86868b]">
                                No transfers yet
                            </div>
                        ) : (
                            <div className="divide-y divide-black/[0.04]">
                                {transfers.map(t => (
                                    <div key={t.id} className="flex justify-between items-center py-3.5 first:pt-1 last:pb-1">
                                        <div className="flex items-center gap-3.5">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${
                                                t.type === "sent" ? "bg-black/[0.04] text-[#1d1d1f]" : "bg-emerald-50 text-emerald-600"
                                            }`}>
                                                {t.type === "sent" ? "↑" : "↓"}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium tracking-tight text-[#1d1d1f]">
                                                    {t.type === "sent" ? `Sent to ${t.name}` : `Received from ${t.name}`}
                                                </div>
                                                <div className="text-[#86868b] text-xs mt-0.5">
                                                    {t.time.toDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-semibold tracking-tight ${
                                            t.type === "sent" ? "text-[#1d1d1f]" : "text-emerald-600"
                                        }`}>
                                            {t.type === "sent" ? "-" : "+"} ₹ {(t.amount / 100).toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}