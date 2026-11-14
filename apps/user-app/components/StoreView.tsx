"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { shopPurchase } from "../app/lib/actions/shopPurchase";

type Product = {
  id: string;
  name: string;
  category: "electronics" | "fashion" | "vouchers" | "essentials";
  tag: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  iconBg: string;
  icon: string;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Apple AirPods Pro (2nd Gen)",
    category: "electronics",
    tag: "Best Seller",
    price: 249,
    originalPrice: 299,
    rating: 4.9,
    reviews: 1240,
    iconBg: "from-blue-500/20 to-indigo-500/20 text-blue-600",
    icon: "🎧",
    description: "Active Noise Cancellation, Transparency mode, and Spatial Audio.",
  },
  {
    id: "p2",
    name: "Amazon Pay Gift Card ₹100",
    category: "vouchers",
    tag: "Instant Delivery",
    price: 95,
    originalPrice: 100,
    rating: 4.8,
    reviews: 8400,
    iconBg: "from-amber-500/20 to-orange-500/20 text-amber-600",
    icon: "🎁",
    description: "Instant digital voucher redeemable on Amazon.in across 10M+ products.",
  },
  {
    id: "p3",
    name: "Nike Air Zoom Pegasus 40",
    category: "fashion",
    tag: "Trending",
    price: 180,
    originalPrice: 220,
    rating: 4.7,
    reviews: 620,
    iconBg: "from-purple-500/20 to-pink-500/20 text-purple-600",
    icon: "👟",
    description: "Responsive cushioning for everyday road running and lightweight comfort.",
  },
  {
    id: "p4",
    name: "Starbucks e-Gift Voucher",
    category: "vouchers",
    tag: "Flat 10% Off",
    price: 45,
    originalPrice: 50,
    rating: 4.9,
    reviews: 3100,
    iconBg: "from-emerald-500/20 to-teal-500/20 text-emerald-600",
    icon: "☕",
    description: "Enjoy your favorite artisanal brew and bites at any Starbucks outlet.",
  },
  {
    id: "p5",
    name: "Anker 65W Fast Charger",
    category: "electronics",
    tag: "Tech Pick",
    price: 40,
    originalPrice: 55,
    rating: 4.8,
    reviews: 1890,
    iconBg: "from-cyan-500/20 to-blue-500/20 text-cyan-600",
    icon: "⚡",
    description: "High-speed GaN III charging for MacBook, iPhone, and Android devices.",
  },
  {
    id: "p6",
    name: "Cult.fit 1-Month Pass",
    category: "essentials",
    tag: "Exclusive",
    price: 75,
    originalPrice: 120,
    rating: 4.6,
    reviews: 430,
    iconBg: "from-rose-500/20 to-red-500/20 text-rose-600",
    icon: "🏋️",
    description: "Unlimited access to gym sessions, yoga classes, and premium workouts.",
  },
  {
    id: "p7",
    name: "Swiggy Gourmet Voucher ₹50",
    category: "vouchers",
    tag: "Hot Deal",
    price: 42,
    originalPrice: 50,
    rating: 4.8,
    reviews: 5200,
    iconBg: "from-orange-500/20 to-red-500/20 text-orange-600",
    icon: "🍔",
    description: "Order from top-rated restaurants and gourmet food stores with instant discount.",
  },
  {
    id: "p8",
    name: "Logitech MX Master 3S",
    category: "electronics",
    tag: "Top Rated",
    price: 110,
    originalPrice: 135,
    rating: 4.9,
    reviews: 2150,
    iconBg: "from-slate-500/20 to-gray-500/20 text-slate-700",
    icon: "🖱️",
    description: "Quiet clicks, 8K DPI sensor, and hyper-fast MagSpeed electromagnetic scroll.",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Items" },
  { key: "electronics", label: "Electronics" },
  { key: "vouchers", label: "Gift Cards" },
  { key: "fashion", label: "Fashion" },
  { key: "essentials", label: "Fitness & Life" },
] as const;

export function StoreView({ initialBalance }: { initialBalance: number }) {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState<string[]>([]);

  const filteredProducts = PRODUCTS.filter(
    (p) => activeCategory === "all" || p.category === activeCategory
  );

  const rupees = (paise: number) => (paise / 100).toLocaleString("en-IN");

  const handleCheckout = async (product: Product) => {
    setIsProcessing(true);
    try {
      const res = await shopPurchase(product.name, product.price);
      if (!res.ok) {
        toast.error(res.message);
        return;
      }

      // Update live local balance state
      setBalance((prev) => Math.max(0, prev - product.price * 100));
      setPurchasedProducts((prev) => [...prev, product.id]);
      toast.success(res.message);
      setSelectedProduct(null);
    } catch (e) {
      toast.error("Something went wrong with the purchase.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      {/* APPLE STORE HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1d1d1f] text-white p-7 sm:p-9 shadow-sm mt-2">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/80 bg-white/10 backdrop-blur-md rounded-full mb-3">
              <span></span> Store
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Curated Essentials & Electronics
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
              Instant 1-tap checkout powered by your PayFlow Wallet balance. Zero gateway fees, instant confirmation.
            </p>
          </div>

          {/* WALLET BALANCE BADGE */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-white shrink-0 min-w-[200px]">
            <div className="text-[11px] uppercase tracking-wider text-white/60 font-medium">
              Available Balance
            </div>
            <div className="text-2xl sm:text-3xl font-semibold mt-1">
              ₹ {rupees(balance)}
            </div>
            <Link
              href="/transfer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium bg-white text-[#1d1d1f] px-3.5 py-1.5 rounded-full hover:bg-white/90 transition active:scale-95 shadow-xs"
            >
              + Deposit Funds
            </Link>
          </div>
        </div>
      </div>

      {/* CATEGORY SELECTOR */}
      <div className="mt-8 flex gap-1.5 overflow-x-auto p-1 bg-[#f5f5f7] rounded-full max-w-fit scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all active:scale-95 ${
              activeCategory === cat.key
                ? "bg-[#1d1d1f] text-white shadow-xs"
                : "text-[#86868b] hover:text-[#1d1d1f]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((p) => {
          const isPurchased = purchasedProducts.includes(p.id);

          return (
            <div
              key={p.id}
              className="group flex flex-col justify-between bg-white rounded-3xl border border-black/[0.05] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:scale-[1.01] transition-all duration-200 p-6"
            >
              <div>
                {/* ICON & BADGE */}
                <div className="flex items-start justify-between">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-3xl shadow-xs`}
                  >
                    {p.icon}
                  </div>
                  <span className="text-[10px] font-medium tracking-wide bg-black/[0.04] text-[#1d1d1f] px-2.5 py-1 rounded-full">
                    {p.tag}
                  </span>
                </div>

                {/* PRODUCT TITLE & DESC */}
                <h3 className="font-semibold text-[#1d1d1f] mt-4 text-base tracking-tight line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs text-[#86868b] mt-1 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                {/* RATING */}
                <div className="flex items-center gap-1.5 mt-3 text-xs text-[#86868b]">
                  <span className="text-amber-500 font-semibold">★ {p.rating}</span>
                  <span>•</span>
                  <span>{p.reviews.toLocaleString()} reviews</span>
                </div>
              </div>

              {/* PRICE & BUY BUTTON */}
              <div className="mt-5 pt-4 border-t border-black/[0.04] flex items-center justify-between">
                <div>
                  <div className="text-[11px] line-through text-[#86868b]">
                    ₹{p.originalPrice}
                  </div>
                  <div className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
                    ₹{p.price}
                  </div>
                </div>

                {isPurchased ? (
                  <span className="bg-emerald-50 text-emerald-700 font-medium text-xs px-3.5 py-2 rounded-full flex items-center gap-1">
                    ✓ Purchased
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="bg-[#1d1d1f] hover:bg-black text-white font-medium text-xs px-4 py-2.5 rounded-full transition-all active:scale-95 shadow-sm"
                  >
                    Buy with  Pay
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CHECKOUT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-black/[0.06]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 text-[#86868b] hover:text-[#1d1d1f] h-8 w-8 rounded-full flex items-center justify-center hover:bg-black/[0.04] transition"
            >
              ✕
            </button>

            <div className="flex items-center gap-3.5">
              <div
                className={`h-14 w-14 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-3xl`}
              >
                {selectedProduct.icon}
              </div>
              <div>
                <h3 className="font-semibold text-[#1d1d1f] text-base tracking-tight">
                  {selectedProduct.name}
                </h3>
                <span className="text-xs text-[#86868b] capitalize">
                  {selectedProduct.category}
                </span>
              </div>
            </div>

            {/* ORDER BREAKDOWN */}
            <div className="mt-6 bg-[#f5f5f7] rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#86868b]">
                <span>Item Subtotal</span>
                <span>₹{selectedProduct.originalPrice}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Wallet Instant Savings</span>
                <span>-₹{selectedProduct.originalPrice - selectedProduct.price}</span>
              </div>
              <div className="border-t border-black/[0.05] pt-2 flex justify-between font-semibold text-[#1d1d1f] text-sm">
                <span>Total Due</span>
                <span>₹{selectedProduct.price}</span>
              </div>
            </div>

            {/* WALLET BALANCE CHECK */}
            <div className="mt-4 p-4 rounded-2xl border border-black/[0.06] flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#86868b] font-semibold uppercase tracking-wider">
                  Payment Method
                </div>
                <div className="text-xs font-semibold text-[#1d1d1f] mt-0.5 flex items-center gap-1.5">
                  <span> PayFlow Wallet</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#86868b]">Available Balance</div>
                <div className="text-xs font-semibold text-[#1d1d1f]">
                  ₹{rupees(balance)}
                </div>
              </div>
            </div>

            {balance < selectedProduct.price * 100 ? (
              <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                <span>Insufficient balance.</span>
                <Link
                  href="/transfer"
                  className="font-semibold underline text-amber-900"
                >
                  + Add ₹{Math.ceil(selectedProduct.price - balance / 100)}
                </Link>
              </div>
            ) : null}

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-3 px-4 rounded-full border border-black/[0.08] font-medium text-xs text-[#1d1d1f] hover:bg-black/[0.02] transition active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  isProcessing || balance < selectedProduct.price * 100
                }
                onClick={() => handleCheckout(selectedProduct)}
                className="flex-1 py-3 px-4 rounded-full bg-[#1d1d1f] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs text-white shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Confirming…</span>
                  </>
                ) : (
                  <span>Authorize ₹{selectedProduct.price}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
