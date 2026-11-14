"use server"
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function payTransaction(token: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { ok: false, message: "Unauthenticated" };
    }

    const txn = await prisma.onRampTransaction.findUnique({
        where: { token }
    });
    if (!txn || txn.userId !== Number(session.user.id)) {
        return { ok: false, message: "Transaction not found or unauthorized" };
    }

    try {
        await prisma.$transaction(async (tx) => {
            await tx.balance.upsert({
                where: { userId: txn.userId },
                update: { amount: { increment: txn.amount } },
                create: { userId: txn.userId, amount: txn.amount, locked: 0 }
            });
            await tx.onRampTransaction.update({
                where: { token },
                data: { status: "Success" }
            });
        });
        return { ok: true, message: "Captured" };
    } catch (e) {
        console.error("Payment capture error:", e);
        return { ok: false, message: "Can't complete payment. Please retry." };
    }
}

export async function failTransaction(token: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { ok: false, message: "Unauthenticated" };
    }

    const txn = await prisma.onRampTransaction.findUnique({
        where: { token }
    });
    if (!txn || txn.userId !== Number(session.user.id)) {
        return { ok: false, message: "Transaction not found or unauthorized" };
    }

    const result = await prisma.onRampTransaction.updateMany({
        where: { token, userId: Number(session.user.id), status: "Processing" },
        data: { status: "Failure" }
    });
    if (result.count !== 1) {
        return { ok: false, message: "This payment was already completed" };
    }
    return { ok: true, message: "Payment failed" };
}