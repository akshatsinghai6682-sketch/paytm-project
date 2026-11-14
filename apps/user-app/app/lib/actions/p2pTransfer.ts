"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return { ok: false, message: "You're logged out. Log in and retry." }
    }
    if (!Number.isInteger(amount) || amount <= 0) {
        return { ok: false, message: "Enter a valid amount" }
    }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return { ok: false, message: "User not found" }
    }
    if (toUser.id === Number(from)) {
        return { ok: false, message: "You can't send money to yourself" }
    }

    const fromId = Number(from);
    const toId = toUser.id;
    const [firstId, secondId] = [fromId, toId].sort((a, b) => a - b);

    try {
        await prisma.$transaction(async (tx) => {
            // Lock balances in deterministic order by userId to prevent deadlocks
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" IN (${firstId}, ${secondId}) ORDER BY "userId" FOR UPDATE`;

            const fromBalance = await tx.balance.findUnique({
                where: { userId: fromId },
            });
            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error('Insufficient funds');
            }

            // Ensure recipient balance record exists
            const toBalance = await tx.balance.findUnique({
                where: { userId: toId },
            });
            if (!toBalance) {
                await tx.balance.create({
                    data: {
                        userId: toId,
                        amount: 0,
                        locked: 0
                    }
                });
            }

            await tx.balance.update({
                where: { userId: fromId },
                data: { amount: { decrement: amount } },
            });

            await tx.balance.update({
                where: { userId: toId },
                data: { amount: { increment: amount } },
            });
            await tx.p2pTransfer.create({
                data: {
                    fromUserId: fromId,
                    toUserId: toId,
                    amount,
                    timestamp: new Date()
                }
            })
        });
        return { ok: true, message: "Success" }
    } catch (e) {
        if (e instanceof Error && e.message === 'Insufficient funds') {
            return { ok: false, message: "Not enough balance" }
        }
        console.error(e);
        return { ok: false, message: "Transfer failed. Try again." }
    }
}