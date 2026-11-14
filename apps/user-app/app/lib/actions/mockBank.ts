"use server"
import prisma from "@repo/db/client";

const WEBHOOK_URL = process.env.BANK_WEBHOOK_URL || "http://localhost:3003";

export async function payTransaction(token: string) {
    try {
        const res = await fetch(`${WEBHOOK_URL}/hdfcWebhook`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
    const result = await prisma.onRampTransaction.updateMany({
        where: { token, status: "Processing" },
        data: { status: "Failure" }
    });
    if (result.count !== 1) {
        return { ok: false, message: "This payment was already completed" };
    }
    return { ok: true, message: "Payment failed" };
}