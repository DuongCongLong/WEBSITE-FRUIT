import React, { useState } from "react";
import { X, Search, Clock, ShieldCheck, CheckCircle2, ShoppingBag, Landmark, ArrowRight, Truck } from "lucide-react";
import { Order } from "../types";

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export default function OrderLookupModal({ isOpen, onClose, orders }: OrderLookupModalProps) {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  const cleanSearch = searchTerm.trim().toLowerCase();
  
  // Find matching orders by phone number or order ID
  const matchedOrders = orders.filter((order) => {
    if (!cleanSearch) return false;
    return (
      order.phone.includes(cleanSearch) ||
      order.id.toLowerCase().includes(cleanSearch) ||
      order.customerName.toLowerCase().includes(cleanSearch)
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Chờ xử lý":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Chờ xử lý (Xác nhận)
          </span>
        );
      case "Đã bàn giao":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5 text-blue-500" />
            Đang giao hàng
          </span>
        );
      case "Hoàn thành":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Đã hoàn thành
          </span>
        );
      case "Đã hủy":
        default:
        return (
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <X className="w-3.5 h-3.5 text-rose-500" />
            Đã hủy đơn
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" id="order-lookup-modal">
      {/* Backdrop */}
      <div className="fixed inset-0 transition-opacity" onClick={onClose} />

      {/* Content Box */}
      <div className="relative bg-white rounded-3xl max-w-2xl w-full text-slate-900 shadow-2xl border border-slate-100 z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-none">
              Tra Cứu Đơn Hàng Của Bạn
            </h3>
            <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
              GreenFruit Instant Tracking System
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Nhập **Số điện thoại** bạn dùng khi đặt hàng, hoặc **Mã đơn hàng** (VD: ORD-9842) để kiểm tra tình trạng vận đơn và lịch sử mua hàng lập tức:
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!e.target.value) setHasSearched(false);
                  }}
                  placeholder="Nhập số điện thoại, mã đơn hàng..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-50"
              >
                Tra cứu
              </button>
            </div>
          </form>

          {/* Results Block */}
          {hasSearched && (
            <div className="space-y-5 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Kết quả tìm thấy ({matchedOrders.length} đơn hàng)
              </h4>

              {matchedOrders.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-150 border-dashed text-slate-500 space-y-2">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">Không tìm thấy đơn hàng nào!</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Vui lòng kiểm tra lại chính xác số điện thoại hoặc mã đơn hàng của bạn. Đơn hàng mới đặt cần 1-2 giây để đồng bộ trên hệ thống.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchedOrders.map((order) => (
                    <div key={order.id} className="bg-slate-50/50 rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-emerald-200 transition-colors">
                      {/* Order general header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Mã đơn hàng</span>
                          <h5 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                            {order.id}
                            <span className="text-xs font-medium text-slate-400">| {new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                          </h5>
                        </div>
                        <div>{getStatusBadge(order.status)}</div>
                      </div>

                      {/* Customer Summary details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                        <div>
                          <p><strong>Khách hàng:</strong> {order.customerName}</p>
                          <p><strong>Số điện thoại:</strong> {order.phone}</p>
                        </div>
                        <div>
                          <p><strong>Địa chỉ:</strong> {order.address}</p>
                          <p><strong>Phương thức:</strong> {order.paymentMethod}</p>
                        </div>
                      </div>

                      {/* Item list in order */}
                      <div className="bg-white rounded-xl border border-slate-150 p-3 space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-xs text-slate-700">
                            <span className="font-semibold truncate max-w-[70%]">
                              {item.name} <span className="text-slate-400 font-mono">x{item.quantity}</span>
                            </span>
                            <span className="font-extrabold text-slate-900 font-mono">{formatVND(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total Amount in order footer */}
                      <div className="flex justify-between items-center bg-emerald-50/40 px-4 py-2.5 rounded-xl border border-emerald-100/30">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Tổng thanh toán</span>
                        <span className="text-rose-600 font-black text-base">{formatVND(order.totalAmount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info text */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Hệ thống mã hóa bảo mật khách hàng của GreenFruit Store.</span>
        </div>
      </div>
    </div>
  );
}
