import { useState } from "react";
import { ShieldCheck, Truck, Sparkles, Sprout, Percent, ChevronRight, Apple, Heart, Trophy } from "lucide-react";

export default function Hero() {
  const [activePromo, setActivePromo] = useState(0);

  const promos = [
    {
      badge: "Deal Sốc Hôm Nay",
      title: "Trái Cây Nhập Khẩu Đạt Chuẩn GlobalGAP",
      highlight: "Ưu Đãi Đến 30%",
      desc: "Nho sữa Hàn Quốc, Táo Envy New Zealand, Việt quất Mỹ tươi rói nhập mới mỗi ngày. Giảm ngay cực sốc kèm combo quà tặng hấp dẫn cho đơn hàng gia đình.",
      gradient: "from-emerald-600 to-teal-600 text-white",
      bgImg: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "Sản Phẩm Độc Quyền",
      title: "Hộp Quà Trái Cây Cao Cấp Phú Quý",
      highlight: "Thiết Kế Tinh Tế",
      desc: "Lựa chọn hoàn hảo để bày tỏ lòng tri ân và gửi gắm thành ý đến đối tác, gia đình hay cấp trên trong các dịp đại lễ trọng đại. Hộp gỗ lót lụa sang trọng, chuẩn 5 sao.",
      gradient: "from-amber-600 to-orange-600 text-white",
      bgImg: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    },
    {
      badge: "Chính Sách Vàng",
      title: "Cam Kết Tươi Ngon Hoàn Tiền 100%",
      highlight: "Bao Đổi Trả 24H",
      desc: "Nếu quý khách phát hiện bất kỳ trái cây nào bị dập nát, hư hỏng hoặc không đúng như mô tả ban đầu, GreenFruit sẵn sàng đền bù đổi mới hoặc hoàn tiền ngay lập tức.",
      gradient: "from-rose-600 to-red-500 text-white",
      bgImg: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=800&q=80",
    }
  ];

  return (
    <div className="space-y-6" id="store-hero">
      {/* Main Promo Banner Container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 shadow-md bg-slate-900 text-white min-h-[380px] flex flex-col md:flex-row items-stretch">
        
        {/* Background Decorative Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent)] pointer-events-none"></div>

        {/* Left Interactive Side: Text Details */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between relative z-10">
          <div>
            {/* Promo Selector Tabs */}
            <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 no-scrollbar">
              {promos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePromo(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activePromo === idx
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                      : "bg-white/10 text-slate-300 hover:bg-white/15"
                  }`}
                >
                  {p.badge}
                </button>
              ))}
            </div>

            {/* Animation Wrapper for transitions */}
            <div className="transition-all duration-300 transform translate-y-0 opacity-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{promos[activePromo].badge}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
                {promos[activePromo].title} <br />
                <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  {promos[activePromo].highlight}
                </span>
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mb-6">
                {promos[activePromo].desc}
              </p>
            </div>
          </div>

          {/* Call to action & badges */}
          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="#product-list-container"
              className="inline-flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-450 hover:shadow-emerald-500/30 transition-all cursor-pointer"
            >
              Mua sắm ngay
              <ChevronRight className="w-4 h-4" />
            </a>
            
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 rounded-xl border border-white/10 text-xs text-emerald-400 font-semibold">
              <Percent className="w-3.5 h-3.5 animate-bounce" />
              <span>Nhập mã KHACHVIP giảm 15%</span>
            </div>
          </div>
        </div>

        {/* Right Side: Image with gradient cover */}
        <div className="w-full md:w-[42%] relative min-h-[220px] md:min-h-auto overflow-hidden">
          {/* Subtle overlay transition */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10"></div>
          <img
            src={promos[activePromo].bgImg}
            alt={promos[activePromo].title}
            className="w-full h-full object-cover transition-all duration-750 transform scale-102 hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Absolute floating floating badges */}
          <div className="absolute top-4 right-4 z-20 bg-emerald-600/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-lg flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>GreenFruit Top Seller</span>
          </div>
        </div>
      </div>

      {/* Core Brand Value Promises Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 bg-white border border-slate-150 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3.5 group">
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-3xs">
            <Sprout className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">100% Organic & Fresh</h3>
            <p className="text-[11px] text-slate-500 leading-none mt-1">Đạt chứng nhận GlobalGAP, chuẩn sạch tự nhiên</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 group">
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-3xs">
            <Truck className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Giao Hàng Siêu Tốc 2H</h3>
            <p className="text-[11px] text-slate-500 leading-none mt-1">Nội thành Hà Nội & TP. Hồ Chí Minh giao tức thì</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 group">
          <div className="bg-rose-50 p-3 rounded-xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-3xs">
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Bảo Hành Cam Kết 24H</h3>
            <p className="text-[11px] text-slate-500 leading-none mt-1">Hư hỏng, dập nát bù ngay không cần lý do</p>
          </div>
        </div>
      </div>
    </div>
  );
}
