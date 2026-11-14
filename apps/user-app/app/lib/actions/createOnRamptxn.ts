"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

import crypto from "crypto";

export async function createOnRampTransaction(provider: string, amount: number) {
    // Ideally the token should come from the banking provider (hdfc/axis)
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
        return {
            message: "Unauthenticated request"
        }
    }
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
        return {
            message: "Invalid amount"
        }
    }
    const token = crypto.randomUUID();
    await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(session.user.id),
            amount: Math.round(amount * 100)
        }
    });

    return {
        message: "Done",
        token
    }
}
