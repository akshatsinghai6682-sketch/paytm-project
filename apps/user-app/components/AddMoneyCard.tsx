"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOnRampTransaction } from "../app/lib/actions/createOnRamptxn";
import { payTransaction } from "../app/lib/actions/mockBank";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
}, {
    name: "Axis Bank",
}, {
    name: "State Bank of India",
}, {
    name: "ICICI Bank",
}];

export const AddMoney = () => {
    const router = useRouter();
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "HDFC Bank");
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);

    return <Card title="Add Money">
    <div className="w-full">
        <TextInput label={"Amount"} placeholder={"Amount in ₹"} onChange={(val) => {
            setValue(Number(val))
        }} />
        <div className="py-4 text-left">
            Bank
        </div>
        <Select onSelect={(val) => {
            setProvider(val);
        }} options={SUPPORTED_BANKS.map(x => ({
            key: x.name,
            value: x.name
        }))} />
        <div className="flex justify-center pt-4">
            <Button onClick={async () => {
                if (!value || value <= 0) {
                    toast.error("Enter an amount greater than 0");
                    return;
                }
                setLoading(true);
                toast.info(`Connecting to ${provider} simulated gateway...`);
                try {
                    const res = await createOnRampTransaction(provider, value);
                    if (res?.message !== "Done" || !res.token) {
                        toast.error("Couldn't start the deposit. Please log in and retry.");
                        setLoading(false);
                        return;
                    }

                    // Complete simulated bank authorization and balance credit
                    const payRes = await payTransaction(res.token);
                    if (payRes.ok) {
                        toast.success(`₹${value.toLocaleString("en-IN")} credited to your wallet balance from ${provider}!`);
                        setTimeout(() => {
                            router.refresh();
                        }, 500);
                    } else {
                        toast.error(payRes.message || "Simulated deposit failed");
                    }
                } catch (e) {
                    toast.error("Failed to complete deposit. Please retry.");
                } finally {
                    setLoading(false);
                }
            }}>
            {loading ? "Processing Deposit..." : "Add Money"}
            </Button>
        </div>
    </div>
</Card>
}