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
        <div className="min-h-screen bg-gradient-to-br from-[#001845] via-[#002970] to-[#004e92] flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <Toaster position="top-center" richColors />

            {/* Decorative background blur lights */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00baf2]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#002970]/40 rounded-full blur-3xl pointer-events-none" />

            {/* Header Brand */}
            <div className="mb-6 flex flex-col items-center text-center">
                <Link href="/" className="group flex items-center gap-3 transition">
                    <div className="relative h-12 w-12">
                        <div className="absolute inset-0 translate-y-1 rounded-2xl bg-[#0084b4]" />
                        <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-[#00baf2] text-2xl font-black text-[#002970] shadow-lg group-hover:scale-105 transition-transform">
                            P
                        </div>
                    </div>
                    <div className="text-left">
                        <div className="text-2xl font-extrabold text-white tracking-tight">
                            Pay<span className="text-[#00baf2]">TM</span>
                        </div>
                        <div className="text-[11px] uppercase tracking-[0.25em] text-white/70 font-semibold">
                            Digital Wallet
                        </div>
                    </div>
                </Link>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10 relative backdrop-blur-xl">
                {/* Tab switch */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setIsSignUp(false)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                            !isSignUp ? "bg-white text-[#002970] shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(true)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                            isSignUp ? "bg-white text-[#002970] shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        Create Account
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {isSignUp ? "Open PayTM Wallet" : "Welcome back"}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        {isSignUp
                            ? "Enter your mobile number to create your digital wallet with ₹0 balance."
                            : "Enter your registered mobile number and password to access your wallet."}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                            Mobile Number
                        </label>
                        <div className="relative flex rounded-xl border border-slate-200 focus-within:border-[#00baf2] focus-within:ring-2 focus-within:ring-[#00baf2]/20 transition overflow-hidden">
                            <span className="inline-flex items-center px-3 bg-slate-50 border-r border-slate-200 text-xs font-semibold text-slate-600">
                                🇮🇳 +91
                            </span>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="10-digit mobile number"
                                className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                Password
                            </label>
                        </div>
                        <div className="relative rounded-xl border border-slate-200 focus-within:border-[#00baf2] focus-within:ring-2 focus-within:ring-[#00baf2]/20 transition overflow-hidden">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#002970] to-[#00baf2] hover:opacity-95 shadow-lg shadow-[#00baf2]/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        )}
                        <span>{loading ? "Verifying..." : isSignUp ? "Create Wallet Account" : "Sign In to Wallet"}</span>
                    </button>
                </form>

                {/* Quick 1-click Test Accounts */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-2.5">
                        Quick Demo Logins (For Reviewers)
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            onClick={() => handleQuickLogin("1111111111", "alice")}
                            className="bg-slate-50 hover:bg-[#e6f7fd] border border-slate-200 hover:border-[#00baf2] text-[#002970] text-xs font-semibold py-2 px-2.5 rounded-xl transition text-left flex flex-col"
                        >
                            <span className="font-bold flex items-center justify-between">
                                Alice <span>₹195</span>
                            </span>
                            <span className="text-[10px] text-slate-500">1111111111</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickLogin("2222222222", "bob")}
                            className="bg-slate-50 hover:bg-[#e6f7fd] border border-slate-200 hover:border-[#00baf2] text-[#002970] text-xs font-semibold py-2 px-2.5 rounded-xl transition text-left flex flex-col"
                        >
                            <span className="font-bold flex items-center justify-between">
                                Bob <span>₹25</span>
                            </span>
                            <span className="text-[10px] text-slate-500">2222222222</span>
                        </button>
                    </div>
                </div>

                {/* Security footer badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                        🔒 256-Bit SSL
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        🛡️ Row-Level Lock
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        ⚡ Instant Transfer
                    </span>
                </div>
            </div>

            {/* Bottom copyright */}
            <div className="mt-6 text-xs text-white/60">
                PayTM Digital Wallet & E-Commerce Platform
            </div>
        </div>
    );
}
