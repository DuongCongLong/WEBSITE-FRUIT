import { useState } from "react";
import { Ticket, Copy, Check, Info, Sparkles, Gift } from "lucide-react";

interface Voucher {
  code: string;
  title: string;
  discount: string;
  description: string;
  expiry: string;
  minOrder?: string;
  type: "percentage" | "freeship";
}

export default function VoucherSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const vouchers: Voucher[] = [
    {
      code: "KHACHVIP",
      title: "Ưu Đãi Khách Hàng Thân Thiết",
      discount: "Giảm 15%",
      description: "Áp dụng giảm trực tiếp 15% vào tổng hóa đơn mua sắm trái cây tươi tại hệ thống GreenFruit.",
      expiry: "HSD: 31/12/2026",
      minOrder: "Mọi giá trị đơn",
      type: "percentage"
    },
    {
      code: "GREENFRUIT10",
      title: "Đại Tiệc Trái Cây Sạch",
      discount: "Giảm 10%",
      description: "Giảm ngay 10% cho tất cả đơn hàng, giúp trải nghiệm trái cây organic nhập khẩu chuẩn sạch dễ dàng hơn.",
      expiry: "HSD: 31/12/2026",
      minOrder: "Mọi giá trị đơn",
      type: "percentage"
    },
    {
      code: "FREESHIP",
      title: "Mã Miễn Phí Vận Chuyển",
      discount: "Freeship Toàn Quốc",
      description: "Miễn phí vận chuyển toàn quốc cho đơn hàng. Tiết kiệm tối đa 30,000đ chi phí giao hàng tận tay.",
      expiry: "HSD: 31/12/2026",
      minOrder: "Mọi đơn hàng",
      type: "freeship"
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 sm:p-8 my-8" id="voucher-section">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-100 rounded-full text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
            <span>Đặc quyền mua sắm</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Gift className="w-6 h-6 text-emerald-600" />
            Mã Giảm Giá & Ưu Đãi Độc Quyền
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lưu ngay các voucher siêu hời dưới đây để được giảm giá trực tiếp khi thanh toán đơn hàng.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <Info className="w-4 h-4 text-emerald-500" />
          <span>Click vào nút mã để tự động sao chép nhanh</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vouchers.map((voucher) => {
          const isCopied = copiedCode === voucher.code;
          return (
            <div
              key={voucher.code}
              className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-300 group"
            >
              {/* Semi-circle cutout punch-outs on left and right for ticket effect */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 border-r border-slate-200/80 z-10"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50 border-l border-slate-200/80 z-10"></div>

              {/* Coupon Top half */}
              <div className="p-5 pb-4 border-b border-dashed border-slate-200 relative">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black tracking-tight ${
                      voucher.type === "freeship"
                        ? "bg-sky-50 text-sky-700 border border-sky-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    {voucher.discount}
                  </span>
                  <Ticket className="w-4.5 h-4.5 text-slate-400 group-hover:text-emerald-500 group-hover:rotate-12 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 leading-snug tracking-tight">
                  {voucher.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  {voucher.description}
                </p>
              </div>

              {/* Coupon Bottom half */}
              <div className="px-5 py-4 bg-slate-50/50 flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {voucher.expiry}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    ĐK: {voucher.minOrder}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(voucher.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isCopied
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-600 shadow-3xs"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-mono">{voucher.code}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
