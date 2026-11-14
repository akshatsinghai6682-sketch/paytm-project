import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { StoreView } from "../../../components/StoreView";

export default async function ShopPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    const userId = Number(session.user.id);
    const balance = await prisma.balance.findUnique({
        where: { userId }
    });

    return (
        <div className="w-full">
            <StoreView initialBalance={balance?.amount || 0} />
        </div>
    );
}
