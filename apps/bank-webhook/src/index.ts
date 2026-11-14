import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    const webhookSecret = process.env.BANK_WEBHOOK_SECRET;
    if (webhookSecret && req.headers["x-webhook-secret"] !== webhookSecret) {
        return res.status(401).json({ message: "Unauthorized webhook" });
    }

    const token = req.body.token;

    if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "token is required" });
    }

    try {
        const result = await db.$transaction(async (tx) => {
            // Read amount and user from OUR database, not from the request
            const txn = await tx.onRampTransaction.findUnique({
                where: { token }
            });

            if (!txn) {
                return { code: 404, message: "Unknown token" };
            }
            if (txn.status !== "Processing") {
                // Already handled: do nothing, so a repeat call cannot pay twice
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

        res.status(result.code).json({ message: result.message });
    } catch (e) {
        console.error(e);
        res.status(411).json({ message: "Error while processing webhook" });
    }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Bank webhook running on port ${PORT}`);
});