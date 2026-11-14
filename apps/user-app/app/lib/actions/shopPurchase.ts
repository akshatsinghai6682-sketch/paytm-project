"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function shopPurchase(productName: string, amountInRupees: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { ok: false, message: "Please log in to purchase" };
    }

    const userId = Number(session.user.id);
    const amountInPaise = Math.round(amountInRupees * 100);

    if (isNaN(amountInPaise) || amountInPaise <= 0) {
        return { ok: false, message: "Invalid product price" };
    }

    try {
        const merchantId = 2;
        await prisma.$transaction(async (tx) => {
            const [firstId, secondId] = userId < merchantId ? [userId, merchantId] : [merchantId, userId];
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" IN (${firstId}, ${secondId}) ORDER BY "userId" ASC FOR UPDATE`;

            const balance = await tx.balance.findUnique({
                where: { userId }
            });

            if (!balance || balance.amount < amountInPaise) {
                throw new Error("Insufficient wallet balance");
            }

            await tx.balance.update({
                where: { userId },
                data: { amount: { decrement: amountInPaise } }
            });

            // Credit store merchant if available
            const storeMerchant = await tx.user.findFirst({
                where: { id: 2 }
            });

            if (storeMerchant && storeMerchant.id !== userId) {
                await tx.balance.upsert({
                    where: { userId: storeMerchant.id },
                    update: { amount: { increment: amountInPaise } },
                    create: { userId: storeMerchant.id, amount: amountInPaise, locked: 0 }
                });

                await tx.p2pTransfer.create({
                    data: {
                        fromUserId: userId,
                        toUserId: storeMerchant.id,
                        amount: amountInPaise,
                        timestamp: new Date()
                    }
                });
            }
        });

        return { ok: true, message: `Successfully purchased ${productName} for ₹${amountInRupees}!` };
    } catch (e) {
        if (e instanceof Error && e.message === "Insufficient wallet balance") {
            return { ok: false, message: "Insufficient wallet balance. Please add money first." };
        }
        console.error("Shop purchase error:", e);
        return { ok: false, message: "Failed to complete purchase. Please try again." };
    }
}
