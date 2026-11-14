"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import Link from "next/link";

export default function SigninPage() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim() || !password) {
            toast.error("Please enter both phone number and password");
            return;
        }

        setLoading(true);
        try {
            const res = await signIn("credentials", {
                phone: phone.trim(),
                password,
                redirect: false,
            });

            if (res?.error) {
                toast.error(isSignUp ? "Account creation failed. Please try a different phone number." : "Invalid credentials. Please check your phone number and password.");
                setLoading(false);
            } else if (res?.ok) {
                toast.success(isSignUp ? "Account created successfully! Redirecting..." : "Signed in successfully! Redirecting...");
                setTimeout(() => {
                    router.push("/dashboard");
                    router.refresh();
                }, 400);
            } else {
                toast.error("Something went wrong. Please try again.");
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error. Please try again.");
            setLoading(false);
        }
    };

    const handleQuickLogin = (quickPhone: string, quickPass: string) => {
        setPhone(quickPhone);
        setPassword(quickPass);
        setIsSignUp(false);
        toast.info(`Filled demo credentials (${quickPhone})`);
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <Toaster position="top-center" richColors />

            {/* Apple-style subtle ambient glow */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header Brand */}
            <div className="mb-8 flex flex-col items-center text-center">
                <Link href="/" className="group flex items-center gap-3 transition">
                    <div className="h-10 w-10 rounded-2xl bg-[#1d1d1f] flex items-center justify-center text-white text-lg font-semibold shadow-sm group-hover:scale-105 transition-transform">
                        
                    </div>
                    <div className="text-left">
                        <div className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                            Pay<span className="text-[#0071e3]">Flow</span>
                        </div>
                        <div className="text-[10px] tracking-wide text-[#86868b] font-medium uppercase">
                            Digital Wallet
                        </div>
                    </div>
                </Link>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-black/[0.06] p-8 sm:p-10 relative">
                {/* Segmented Pill Switch */}
                <div className="flex bg-[#f5f5f7] p-1 rounded-full mb-6">
                    <button
                        type="button"
                        onClick={() => setIsSignUp(false)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all ${
                            !isSignUp ? "bg-[#1d1d1f] text-white shadow-xs" : "text-[#86868b] hover:text-[#1d1d1f]"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(true)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all ${
                            isSignUp ? "bg-[#1d1d1f] text-white shadow-xs" : "text-[#86868b] hover:text-[#1d1d1f]"
                        }`}
                    >
                        Create Account
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                        {isSignUp ? "Create your Wallet" : "Welcome Back"}
                    </h1>
                    <p className="text-xs text-[#86868b] mt-1 leading-relaxed">
                        {isSignUp
                            ? "Enter your mobile number to open your digital wallet account."
                            : "Enter your phone number and password to access your balance."}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-1.5">
                            Mobile Number
                        </label>
                        <div className="relative flex items-center bg-[#f5f5f7] rounded-2xl px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10 transition-all">
                            <span className="text-xs font-semibold text-[#86868b] mr-2">
                                🇮🇳 +91
                            </span>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="10-digit number"
                                className="w-full bg-transparent text-sm font-medium text-[#1d1d1f] outline-none placeholder:text-[#86868b]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-1.5">
                            Password
                        </label>
                        <div className="relative flex items-center bg-[#f5f5f7] rounded-2xl px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10 transition-all">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full bg-transparent text-sm font-medium text-[#1d1d1f] outline-none placeholder:text-[#86868b] pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-xs text-[#86868b] hover:text-[#1d1d1f] font-medium"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-6 rounded-full font-medium text-sm text-white bg-[#1d1d1f] hover:bg-black active:scale-[0.98] disabled:opacity-40 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            )}
                            <span>{loading ? "Verifying..." : isSignUp ? "Create Wallet Account" : "Sign In to Wallet"}</span>
                        </button>
                    </div>
                </form>

                {/* Quick 1-click Test Accounts */}
                <div className="mt-6 pt-5 border-t border-black/[0.05]">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] text-center mb-2.5">
                        Demo Accounts
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            onClick={() => handleQuickLogin("1111111111", "alice")}
                            className="bg-[#f5f5f7] hover:bg-[#ebebed] text-[#1d1d1f] text-xs font-medium py-2.5 px-3 rounded-2xl transition active:scale-95 text-left flex flex-col"
                        >
                            <span className="font-semibold flex items-center justify-between">
                                Alice <span className="text-[#86868b] font-normal">₹195</span>
                            </span>
                            <span className="text-[10px] text-[#86868b] font-mono mt-0.5">1111111111</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickLogin("2222222222", "bob")}
                            className="bg-[#f5f5f7] hover:bg-[#ebebed] text-[#1d1d1f] text-xs font-medium py-2.5 px-3 rounded-2xl transition active:scale-95 text-left flex flex-col"
                        >
                            <span className="font-semibold flex items-center justify-between">
                                Bob <span className="text-[#86868b] font-normal">₹25</span>
                            </span>
                            <span className="text-[10px] text-[#86868b] font-mono mt-0.5">2222222222</span>
                        </button>
                    </div>
                </div>

                {/* Security footer badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-[#86868b]">
                    <span>🔒 256-Bit SSL</span>
                    <span>•</span>
                    <span>🛡️ Row-Level Lock</span>
                    <span>•</span>
                    <span>⚡ Instant  Pay</span>
                </div>
            </div>

            {/* Bottom copyright & disclaimer */}
            <div className="mt-8 text-center text-xs text-[#86868b] space-y-1">
                <div>PayFlow Digital Wallet Platform</div>
                <div className="text-[11px]">Portfolio Project by Akshat Singhai • Simulated Fintech Demonstration</div>
            </div>
        </div>
    );
}
