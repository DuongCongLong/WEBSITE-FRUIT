import React, { useState } from "react";
import { X, HandCoins, Landmark, CheckCircle, ArrowRight, ShieldCheck, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { CartItem } from "../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (orderId: string) => void;
  onClearCart: () => void;
  onRefreshProducts: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  onClearCart,
  onRefreshProducts
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Coupon promo code states
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isShipWaived, setIsShipWaived] = useState(false);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShipThreshold = 300000;
  const isEligibleForFreeShip = totalAmount >= freeShipThreshold || isShipWaived;
  const deliveryFee = totalAmount > 0 && !isEligibleForFreeShip ? 30000 : 0;
  const finalTotal = Math.max(0, totalAmount - discountAmount + deliveryFee);

  const handleApplyCoupon = () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Vui lòng nhập mã giảm giá!");
      return;
    }
    if (code === "GREENFRUIT10") {
      const discount = Math.round(totalAmount * 0.1);
      setDiscountAmount(discount);
      setAppliedCoupon("GREENFRUIT10 (Giảm 10%)");
      setIsShipWaived(false);
      setCouponInput("");
    } else if (code === "KHACHVIP") {
      const discount = Math.round(totalAmount * 0.15);
      setDiscountAmount(discount);
      setAppliedCoupon("KHACHVIP (Giảm 15%)");
      setIsShipWaived(false);
      setCouponInput("");
    } else if (code === "FREESHIP") {
      setIsShipWaived(true);
      setDiscountAmount(0);
      setAppliedCoupon("FREESHIP (Miễn phí ship)");
      setCouponInput("");
    } else {
      setCouponError("Mã giảm giá không chính xác hoặc đã hết hạn!");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setIsShipWaived(false);
    setCouponInput("");
    setCouponError(null);
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ các thông tin bắt buộc (*)");
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    const orderPayload = {
      customerName,
      email,
      phone,
      address,
      paymentMethod: paymentMethod === "COD" ? "COD (Thanh toán khi nhận hàng)" : "Chuyển khoản Ngân hàng",
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      discount: discountAmount,
      deliveryFee: deliveryFee
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Đã xảy ra lỗi bất thường khi đặt hàng.");
      }

      setCompletedOrder(data);
      onClearCart();
      onRefreshProducts();
      onOrderSuccess(data.id);
    } catch (err: any) {
      setErrorMsg(err.message || "Không thể kết nối với máy chủ API. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="checkout-modal-root">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl max-w-4xl w-full text-slate-900 shadow-2xl border border-slate-100 z-10 overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Success Screen */}
        {completedOrder ? (
          <div className="p-8 sm:p-12 text-center flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50/20 to-teal-50/20">
            <div className="bg-emerald-100 p-4.5 rounded-full mb-5 text-emerald-600">
              <CheckCircle className="w-16 h-16" />
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug tracking-tight mb-2">
              Đặt Hàng Thành Công!
            </h3>
            
            <p className="text-slate-500 font-bold text-sm bg-white border border-slate-200 shadow-xs px-4 py-1.5 rounded-full mb-6 max-w-xs flex items-center justify-center gap-1">
              Mã đơn hàng: <span className="text-emerald-700 font-extrabold">{completedOrder.id}</span>
            </p>

            <div className="bg-white rounded-2xl border border-slate-200/60 p-5 max-w-md w-full text-left space-y-3.5 shadow-sm mb-8">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5 text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Thông tin nhận hàng
              </h4>
              <div className="text-xs space-y-2 text-slate-600">
                <p><strong>Khách hàng:</strong> {completedOrder.customerName}</p>
                <p><strong>Số điện thoại:</strong> {completedOrder.phone}</p>
                <p><strong>Địa chỉ nhận hàng:</strong> {completedOrder.address}</p>
                <p><strong>Phương thức:</strong> {completedOrder.paymentMethod}</p>
                <p><strong>Phải thanh toán:</strong> <span className="text-rose-600 font-extrabold text-sm">{formatVND(completedOrder.totalAmount || finalTotal)}</span></p>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mb-6.5 leading-relaxed">
              Nhân viên GreenFruit sẽ gọi điện xác nhận đơn hàng trong vòng 10-15 phút để lấy địa điểm giao hàng chính xác. Cảm ơn bạn đã lựa chọn GreenFruit!
            </p>

            <button
              onClick={() => {
                onClose();
                setCompletedOrder(null);
              }}
              className="bg-slate-900 text-white font-bold text-sm px-8 py-3 rounded-xl hover:bg-slate-800 cursor-pointer shadow-md transition-colors flex items-center gap-2"
            >
              Tiếp tục mua hàng
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        ) : (
          <>
            {/* Main Checkout Grid: Split Form (Left) & Summary (Right) */}
            <div className="md:w-3/5 p-6 sm:p-8 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">
                    Điền hóa đơn & Giao hàng
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold">Tất cả thông tin được bảo mật tại GreenFruit</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 cursor-pointer md:hidden"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-5 bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Order form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Họ và tên khách hàng *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Số điện thoại nhận hàng *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="VD: 0901234567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Địa chỉ Email (Không bắt buộc)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="customer@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Địa chỉ giao hàng chi tiết (Số nhà, Tên đường, Quận, TP) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ nhận trái cây chính xác..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
                  />
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Phương thức thanh toán
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setPaymentMethod("COD")}
                      className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer select-none transition-all ${
                        paymentMethod === "COD"
                          ? "border-emerald-500 bg-emerald-50/20 text-emerald-800"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="accent-emerald-600"
                      />
                      <div className="flex items-center gap-2">
                        <HandCoins className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Thanh toán khi nhận hàng (COD)</p>
                          <p className="text-[10px] text-slate-400">Không cần đặt cọc trước</p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("BANK")}
                      className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer select-none transition-all ${
                        paymentMethod === "BANK"
                          ? "border-emerald-500 bg-emerald-50/20 text-emerald-800"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === "BANK"}
                        onChange={() => setPaymentMethod("BANK")}
                        className="accent-emerald-600"
                      />
                      <div className="flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Chuyển khoản QR Ngân hàng</p>
                          <p className="text-[10px] text-slate-400">Giảm thêm 5K phí và tiện dụng</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submitting Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    Bảo mật giao dịch thanh toán
                  </span>
                  
                  <button
                    id="submit-checkout-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 cursor-pointer shadow-md shadow-emerald-100 transition-colors flex items-center gap-2 disabled:bg-slate-300 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        Đang đặt hàng...
                      </>
                    ) : (
                      <>
                        Xác nhận đặt hàng
                        <ArrowRight className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Summary Information (Right Panel) */}
            <div className="md:w-2/5 bg-slate-50 p-6 sm:p-8 border-l border-slate-200 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 mb-5">
                  <h3 className="font-bold text-slate-800 text-sm">Danh sách hàng đã chọn</h3>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer hidden md:flex"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mini products block */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-2.5 items-center">
                      <div className="w-11 h-11 rounded-md overflow-hidden bg-white border border-slate-200 shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium font-mono">
                          {item.quantity} {item.product.unit} x {formatVND(item.product.price)}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 shrink-0">
                        {formatVND(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon promo code input */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-150 shadow-2xs mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">Mã giảm giá / Quà tặng</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Nhập mã: GREENFRUIT10..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase focus:outline-hidden focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-rose-600 font-bold mt-1">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 text-[10px] sm:text-xs font-bold p-1.5 rounded-md mt-2 border border-emerald-150">
                      <span>Đã áp dụng: {appliedCoupon}</span>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-rose-600 font-bold hover:text-rose-800 text-xs px-1"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t border-slate-200/70 pt-4 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Cộng tiền sản phẩm</span>
                    <span className="text-slate-900 font-bold">{formatVND(totalAmount)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Giảm giá khuyến mãi</span>
                      <span className="font-bold">-{formatVND(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs">
                    <span>Phí vận chuyển giao tốc</span>
                    <span className={`font-bold ${isEligibleForFreeShip ? "text-emerald-600 text-[11px]" : "text-slate-900"}`}>
                      {isEligibleForFreeShip ? "Freetrip (Miễn phí)" : formatVND(deliveryFee)}
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code and Total details */}
              <div className="mt-8 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none pb-1">Thành tiền toán</span>
                    <span className="text-rose-600 font-black text-2xl tracking-tight leading-none">
                      {formatVND(finalTotal)}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">Đã gồm thuế & phí phục vụ</span>
                </div>

                {paymentMethod === "BANK" && (
                  <div className="bg-white p-3.5 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center text-center shadow-2xs space-y-1.5 animate-in slide-in-from-bottom-2">
                    <span className="text-[10px] font-bold text-slate-700 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full mb-1">
                      QUÉT MÃ ĐỂ CHUYỂN KHOẢN
                    </span>
                    <div className="relative p-1 border border-slate-200 rounded-lg bg-white shadow-3xs">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          `ST: VCB, TK: 1029416882676, CT: GreenFruit Mua Hang - Tong tien: ${finalTotal}`
                        )}`}
                        alt="QR Bank Transfer"
                        className="w-28 h-28"
                      />
                    </div>
                    <div className="text-[9px] text-slate-500 max-w-xs space-y-0.5 font-medium leading-relaxed">
                      <p>Số tài khoản: <strong className="text-indigo-600 font-mono">1029416882676</strong></p>
                      <p>Ngân hàng: <strong className="text-slate-800">Vietcombank (VCB)</strong></p>
                      <p>Chủ tài khoản: <strong>GreenFruit Store</strong></p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
