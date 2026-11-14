"use server"
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

const WEBHOOK_URL = process.env.BANK_WEBHOOK_URL || "http://localhost:3003";

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
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (process.env.BANK_WEBHOOK_SECRET) {
            headers["x-webhook-secret"] = process.env.BANK_WEBHOOK_SECRET;
        }

        const res = await fetch(`${WEBHOOK_URL}/hdfcWebhook`, {
            method: "POST",
            headers,
            body: JSON.stringify({ token }),
            cache: "no-store"
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            return { ok: false, message: data.message || "Payment failed" };
        }
        return { ok: true, message: data.message || "Captured" };
    } catch (e) {
        return { ok: false, message: "Can't reach the bank server. Start bank-webhook and retry." };
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