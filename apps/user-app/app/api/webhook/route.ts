import db from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const token = body?.token;

        if (!token || typeof token !== "string") {
            return NextResponse.json({ message: "token is required" }, { status: 400 });
        }

        const webhookSecret = process.env.BANK_WEBHOOK_SECRET;
        if (webhookSecret && req.headers.get("x-webhook-secret") !== webhookSecret) {
            return NextResponse.json({ message: "Unauthorized webhook" }, { status: 401 });
        }

        const result = await db.$transaction(async (tx) => {
            const txn = await tx.onRampTransaction.findUnique({
                where: { token }
            });

            if (!txn) {
                return { code: 404, message: "Unknown token" };
            }
            if (txn.status !== "Processing") {
                return { code: 200, message: "Already processed" };
            }

            await tx.balance.upsert({
                where: { userId: txn.userId },
                update: { amount: { increment: txn.amount } },
                create: { userId: txn.userId, amount: txn.amount, locked: 0 }
            });
            await tx.onRampTransaction.update({
                where: { token },
                data: { status: "Success" }
            });

            return { code: 200, message: "Captured" };
        });

        return NextResponse.json({ message: result.message }, { status: result.code });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Error while processing webhook" }, { status: 500 });
    }
}
