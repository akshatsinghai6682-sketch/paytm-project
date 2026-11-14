import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";

async function getBalance() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session.user.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session.user.id)
        },
        orderBy: {
            startTime: "desc"
        },
        take: 6
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return <div className="w-full">
        <div className="text-3xl text-[#002970] pt-8 mb-6 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
                <AddMoney />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-6">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}