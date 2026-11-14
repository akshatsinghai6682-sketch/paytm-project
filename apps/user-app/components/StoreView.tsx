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
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#002970] via-[#004bb5] to-[#00baf2] p-6 sm:p-8 text-white shadow-xl mt-6">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md rounded-full text-white mb-3">
              PayFlow Store
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Shop & Pay with Your Wallet
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/80">
              Browse top gadgets, brand gift cards, and fashion. Enjoy instant 1-click checkout powered by your secure PayFlow digital balance.
            </p>
          </div>

          {/* WALLET BALANCE BADGE */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 text-white shrink-0 shadow-inner">
            <div className="text-xs uppercase tracking-wider text-white/70">
              Your Wallet Balance
            </div>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-white">
              ₹ {rupees(balance)}
            </div>
            <Link
              href="/transfer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-[#002970] px-3.5 py-1.5 rounded-lg hover:bg-[#e6f7fd] transition"
            >
              + Add Funds
            </Link>
          </div>
        </div>
      </div>

      {/* CATEGORY SELECTOR */}
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeCategory === cat.key
                ? "bg-[#002970] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-[#002970] hover:text-[#002970]"
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
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 p-5 hover:-translate-y-1"
            >
              <div>
                {/* ICON & BADGE */}
                <div className="flex items-start justify-between">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${p.iconBg} flex items-center justify-center text-3xl shadow-sm`}
                  >
                    {p.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                    {p.tag}
                  </span>
                </div>

                {/* PRODUCT TITLE & DESC */}
                <h3 className="font-bold text-slate-900 mt-4 text-base line-clamp-1 group-hover:text-[#002970] transition">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                {/* RATING */}
                <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
                  <span className="text-amber-500 font-bold">★ {p.rating}</span>
                  <span className="text-slate-300">•</span>
                  <span>({p.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>

              {/* PRICE & BUY BUTTON */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs line-through text-slate-400">
                    ₹{p.originalPrice}
                  </div>
                  <div className="text-xl font-extrabold text-[#002970]">
                    ₹{p.price}
                  </div>
                </div>

                {isPurchased ? (
                  <span className="bg-green-100 text-green-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1">
                    ✓ Purchased
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="bg-[#002970] hover:bg-[#004bb5] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CHECKOUT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${selectedProduct.iconBg} flex items-center justify-center text-2xl`}
              >
                {selectedProduct.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {selectedProduct.name}
                </h3>
                <span className="text-xs text-slate-500 capitalize">
                  {selectedProduct.category}
                </span>
              </div>
            </div>

            {/* ORDER BREAKDOWN */}
            <div className="mt-6 bg-slate-50 rounded-2xl p-4 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Item Subtotal</span>
                <span>₹{selectedProduct.originalPrice}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>PayFlow Wallet Discount</span>
                <span>-₹{selectedProduct.originalPrice - selectedProduct.price}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-base">
                <span>Total Amount</span>
                <span className="text-[#002970]">₹{selectedProduct.price}</span>
              </div>
            </div>

            {/* WALLET BALANCE CHECK */}
            <div className="mt-4 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Payment Method
                </div>
                <div className="text-sm font-bold text-[#002970] mt-0.5 flex items-center gap-1.5">
                  <span>💳 PayFlow Wallet</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Available</div>
                <div className="text-sm font-bold text-slate-800">
                  ₹{rupees(balance)}
                </div>
              </div>
            </div>

            {balance < selectedProduct.price * 100 ? (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                <span>Low balance for this order.</span>
                <Link
                  href="/transfer"
                  className="font-bold underline text-amber-900"
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
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-semibold text-sm text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  isProcessing || balance < selectedProduct.price * 100
                }
                onClick={() => handleCheckout(selectedProduct)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#002970] hover:bg-[#004bb5] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm text-white shadow-md transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Processing…</span>
                  </>
                ) : (
                  <span>Pay ₹{selectedProduct.price}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
