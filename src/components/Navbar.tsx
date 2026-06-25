import { ShoppingBag, Landmark, Settings, Flame, Apple, ClipboardList, Phone, MapPin, BadgePercent, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: "shop" | "admin" | "springboot";
  setActiveTab: (tab: "shop" | "admin" | "springboot") => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrderLookup: () => void;
}

export default function Navbar({ activeTab, setActiveTab, cartCount, onOpenCart, onOpenOrderLookup }: NavbarProps) {
  return (
    <div className="sticky top-0 z-40" id="app-header-container">
      {/* Top Banner Ticker/Info Bar */}
      <div className="bg-slate-900 text-slate-100 text-[11px] font-semibold py-2 px-4 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-1.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            ĐẠI LỄ KHAI TRƯƠNG:
          </span>
          <p className="text-slate-300">
            Nhập mã <strong className="font-mono bg-white/10 px-1 py-0.5 rounded text-amber-300 select-all">KHACHVIP</strong> giảm ngay 15% tổng hóa đơn!
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400 font-medium">
          <span className="flex items-center gap-1 hover:text-white transition-colors">
            <Phone className="w-3 h-3 text-emerald-400" />
            Hotline: 1900.8198
          </span>
          <span className="flex items-center gap-1 hover:text-white transition-colors">
            <MapPin className="w-3 h-3 text-emerald-400" />
            Cửa hàng: 182 Lê Duẩn, Hà Nội
          </span>
        </div>
      </div>

      {/* Main Header navigation */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-transform duration-200" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none group" onClick={() => setActiveTab("shop")}>
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md shadow-emerald-200 flex items-center justify-center group-hover:bg-emerald-700 transition-all">
              <Apple className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                Green<span className="text-emerald-600">Fruit</span>
              </h1>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-0.5">
                Organic & Premium
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
            <button
              id="nav-btn-shop"
              onClick={() => setActiveTab("shop")}
              className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "shop"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
            >
              <Apple className="w-4 h-4 text-emerald-500" />
              Cửa hàng
            </button>
            <button
              id="nav-btn-admin"
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              Quản trị viên
            </button>
            <button
              id="nav-btn-springboot"
              onClick={() => setActiveTab("springboot")}
              className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === "springboot"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
              }`}
            >
              <Landmark className="w-4 h-4 text-indigo-500" />
              Spring Boot Code
            </button>
          </nav>

          {/* Cart & Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Quick category banner indicator for design accent */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100 text-xs font-semibold text-amber-800">
              <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Freeship từ 300K</span>
            </div>

            <button
              onClick={onOpenOrderLookup}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer shadow-3xs"
              title="Tra cứu đơn hàng"
            >
              <ClipboardList className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span className="hidden md:inline">Tra cứu đơn</span>
            </button>

            <button
              id="open-cart-btn"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-center bg-white shadow-3xs group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex border-t border-slate-150 bg-white divide-x divide-slate-100">
          <button
            onClick={() => setActiveTab("shop")}
            className={`flex-1 py-3 text-center text-xs font-bold leading-none flex flex-col items-center gap-1.5 cursor-pointer ${
              activeTab === "shop" ? "text-emerald-600 bg-emerald-50/30" : "text-slate-500"
            }`}
          >
            <Apple className="w-4.5 h-4.5" />
            <span>Cửa hàng</span>
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex-1 py-3 text-center text-xs font-bold leading-none flex flex-col items-center gap-1.5 cursor-pointer ${
              activeTab === "admin" ? "text-emerald-600 bg-emerald-50/30" : "text-slate-500"
            }`}
          >
            <Settings className="w-4.5 h-4.5" />
            <span>Quản trị</span>
          </button>
          <button
            onClick={() => setActiveTab("springboot")}
            className={`flex-1 py-3 text-center text-xs font-bold leading-none flex flex-col items-center gap-1.5 cursor-pointer ${
              activeTab === "springboot" ? "text-indigo-600 bg-indigo-50/30" : "text-slate-500"
            }`}
          >
            <Landmark className="w-4.5 h-4.5" />
            <span>Backend</span>
          </button>
        </div>
      </header>
    </div>
  );
}
