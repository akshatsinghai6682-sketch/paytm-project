import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { TransactionsList, Activity } from "../../../components/TransactionsList";

async function getActivity(): Promise<Activity[]> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }
    const userId = Number(session.user.id);

    const [onRamp, sent, received] = await Promise.all([
        prisma.onRampTransaction.findMany({ where: { userId } }),
        prisma.p2pTransfer.findMany({ where: { fromUserId: userId } }),
        prisma.p2pTransfer.findMany({ where: { toUserId: userId } })
    ]);

    const otherIds = Array.from(new Set([
        ...sent.map(t => t.toUserId),
        ...received.map(t => t.fromUserId)
    ]));
    const others = await prisma.user.findMany({ where: { id: { in: otherIds } } });
    const label = (id: number) => {
        const u = others.find(o => o.id === id);
        return u?.name || u?.number || "user";
    };

    return [
        ...onRamp.map(t => ({
            title: `Added from ${t.provider}`,
            time: t.startTime.getTime(),
            amount: t.amount,
            sign: "+" as const,
            status: t.status,
            type: "added" as const
        })),
        ...sent.map(t => ({
            title: `Sent to ${label(t.toUserId)}`,
            time: t.timestamp.getTime(),
            amount: t.amount,
            sign: "-" as const,
            status: "Success",
            type: "sent" as const
        })),
        ...received.map(t => ({
            title: `Received from ${label(t.fromUserId)}`,
            time: t.timestamp.getTime(),
            amount: t.amount,
            sign: "+" as const,
            status: "Success",
            type: "received" as const
        }))
    ].sort((a, b) => b.time - a.time);
}

export default async function () {
    const items = await getActivity();

    return <div className="w-full">
        <div className="text-3xl text-[#002970] pt-8 mb-6 font-bold">
            Transactions
        </div>
        <div className="max-w-3xl">
            <TransactionsList items={items} />
        </div>
    </div>
}