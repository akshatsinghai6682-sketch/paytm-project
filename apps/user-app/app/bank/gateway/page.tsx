"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { payTransaction, failTransaction } from "../../lib/actions/mockBank";

type BankTheme = {
    name: string;
    primaryColor: string;
    accentColor: string;
    logoBg: string;
    bankShort: string;
    portalName: string;
};

const BANK_THEMES: Record<string, BankTheme> = {
    "HDFC Bank": {
        name: "HDFC Bank",
        primaryColor: "bg-[#004c8f]",
        accentColor: "text-[#004c8f]",
        logoBg: "bg-[#004c8f]",
        bankShort: "HDFC",
        portalName: "HDFC NetBanking Direct Pay"
    },
    "Axis Bank": {
        name: "Axis Bank",
        primaryColor: "bg-[#97144d]",
        accentColor: "text-[#97144d]",
        logoBg: "bg-[#97144d]",
        bankShort: "AXIS",
        portalName: "Axis Bank Internet Banking"
    },
    "State Bank of India": {
        name: "State Bank of India",
        primaryColor: "bg-[#280071]",
        accentColor: "text-[#280071]",
        logoBg: "bg-[#280071]",
        bankShort: "SBI",
        portalName: "State Bank Anywhere NetBanking"
    },
    "ICICI Bank": {
        name: "ICICI Bank",
        primaryColor: "bg-[#b02a30]",
        accentColor: "text-[#b02a30]",
        logoBg: "bg-[#b02a30]",
        bankShort: "ICICI",
        portalName: "ICICI Bank e-Payments Gateway"
    }
};

function BankGatewayContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token") || "";
    const provider = searchParams.get("provider") || "HDFC Bank";
    const amountStr = searchParams.get("amount") || "500";
    const amount = Number(amountStr);

    const theme = BANK_THEMES[provider] || BANK_THEMES["HDFC Bank"]!;

    const [otp, setOtp] = useState("123456");
    const [status, setStatus] = useState<"ready" | "processing" | "success" | "cancelled">("ready");
    const [errorMessage, setErrorMessage] = useState("");

    const handleApprove = async () => {
        if (!token) {
            setErrorMessage("Invalid transaction token");
            return;
        }

        setStatus("processing");

        try {
            // Simulated 1.2s bank processing animation
            await new Promise(r => setTimeout(r, 1200));

            const res = await payTransaction(token);
            if (res.ok) {
                setStatus("success");
                setTimeout(() => {
                    router.push("/transfer?status=success&amount=" + amount);
                }, 1500);
            } else {
                setErrorMessage(res.message || "Bank authorization failed");
                setStatus("ready");
            }
        } catch (e) {
            setErrorMessage("Transaction authorization error. Please retry.");
            setStatus("ready");
        }
    };

    const handleCancel = async () => {
        if (token) {
            await failTransaction(token);
        }
        setStatus("cancelled");
        setTimeout(() => {
            router.push("/transfer?status=cancelled");
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#f1f4f8] flex flex-col items-center justify-center p-4 font-sans">
            {/* Top Security Banner */}
            <div className="w-full max-w-xl mb-4 flex items-center justify-between text-xs text-slate-500 px-2">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    256-Bit SSL Secured Sandbox Gateway
                </span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
                    Simulated Bank Environment
                </span>
            </div>

            {/* Main Bank Card */}
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Bank Header */}
                <div className={`${theme.primaryColor} text-white px-6 py-5 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg tracking-wider text-white border border-white/30">
                            {theme.bankShort.slice(0, 4)}
                        </div>
                        <div>
                            <h2 className="font-extrabold text-base tracking-tight leading-tight">
                                {theme.name}
                            </h2>
                            <p className="text-[11px] text-white/80">
                                {theme.portalName}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-white/70 block uppercase tracking-wider">Reference</span>
                        <span className="font-mono text-xs font-semibold text-white/95">
                            {token ? token.slice(0, 8).toUpperCase() : "DEMO-TXN"}
                        </span>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8">
                    {status === "processing" ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="relative h-16 w-16 mb-4">
                                <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
                                <div className="absolute inset-0 rounded-full border-4 border-[#002970] border-t-transparent animate-spin" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Authorizing Payment...</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Communicating with {theme.name} core banking switch. Please do not close or refresh this tab.
                            </p>
                        </div>
                    ) : status === "success" ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl font-bold mb-4 shadow-sm animate-bounce">
                                ✓
                            </div>
                            <h3 className="text-xl font-extrabold text-green-700">Payment Authorized!</h3>
                            <p className="text-sm font-semibold text-slate-700 mt-1">
                                ₹{amount.toLocaleString("en-IN")} credited to your PayFlow Wallet.
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                                Redirecting you back to your wallet dashboard...
                            </p>
                        </div>
                    ) : status === "cancelled" ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold mb-4">
                                ✕
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Transaction Cancelled</h3>
                            <p className="text-xs text-slate-500 mt-1">Returning you to PayFlow...</p>
                        </div>
                    ) : (
                        <div>
                            {/* Merchant & Amount Box */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-xs text-slate-500">Merchant</span>
                                    <span className="text-xs font-bold text-slate-800">PayFlow Digital Wallet Pvt Ltd</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-t border-slate-200/60 mt-1.5 pt-1.5">
                                    <span className="text-xs text-slate-500">Debit Account</span>
                                    <span className="text-xs font-semibold text-slate-700 font-mono">•••• 8492 (Savings A/C)</span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-t border-slate-200/60 mt-1.5 pt-1.5">
                                    <span className="text-sm font-bold text-slate-800">Deposit Amount</span>
                                    <span className="text-xl font-extrabold text-[#002970]">
                                        ₹ {amount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            {/* OTP Simulation Section */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            One-Time Password (OTP)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setOtp("123456")}
                                            className="text-[11px] font-semibold text-[#004c8f] hover:underline"
                                        >
                                            Auto-Fill Demo OTP
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter 6-digit OTP"
                                            className="w-full tracking-widest text-center text-lg font-mono font-bold py-2.5 px-3 rounded-xl border-2 border-slate-300 focus:border-[#004c8f] focus:outline-none transition"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
                                        <span>Demo OTP: <strong className="text-slate-700">123456</strong> (or any 6 digits)</span>
                                        <span className="text-green-600 font-medium">✓ Validated</span>
                                    </p>
                                </div>

                                {errorMessage && (
                                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                                        {errorMessage}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={handleApprove}
                                        className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 shadow-md transition active:scale-[0.98] flex items-center justify-center gap-1.5"
                                    >
                                        <span>✓ Approve &amp; Pay ₹{amount.toLocaleString("en-IN")}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="py-3 px-5 rounded-xl font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Disclaimer */}
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-[11px] text-slate-400">
                    Safe Fintech Sandbox Simulation • Zero real banking funds are accessed or debited.
                </div>
            </div>
        </div>
    );
}

export default function BankGatewayPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading Bank Gateway...</div>}>
            <BankGatewayContent />
        </Suspense>
    );
}
