"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { toast } from "sonner";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");

    return <div className="w-full max-w-md">
        <div className="text-3xl text-[#002970] pt-8 mb-6 font-bold">
            Send money
        </div>
        <Card title="Send to a phone number">
            <div className="pt-2">
                <TextInput placeholder={"Phone number"} label="Number" onChange={(value) => {
                    setNumber(value.trim())
                }} />
                <TextInput placeholder={"Amount in ₹"} label="Amount" onChange={(value) => {
                    setAmount(value)
                }} />
                <div className="pt-4 flex justify-center">
                    <Button onClick={async () => {
                        const rupees = Number(amount);
                        if (!number) {
                            toast.error("Enter the recipient's number");
                            return;
                        }
                        if (!rupees || rupees <= 0) {
                            toast.error("Enter an amount greater than 0");
                            return;
                        }
                        try {
                            const res = await p2pTransfer(number, Math.round(rupees * 100));
                            if (!res.ok) {
                                toast.error(res.message);
                                return;
                            }
                            toast.success(`₹${rupees} sent to ${number}`);
                        } catch (e) {
                            toast.error("Something went wrong. Try again.");
                        }
                    }}>Send</Button>
                </div>
            </div>
        </Card>
    </div>
}