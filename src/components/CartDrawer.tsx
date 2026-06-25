import { X, Trash2, Plus, Minus, ShoppingBag, Truck, Gift } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShipThreshold = 300000;
  const isEligibleForFreeShip = totalAmount >= freeShipThreshold;
  const deliveryFee = totalAmount > 0 && !isEligibleForFreeShip ? 30000 : 0;
  const finalTotal = totalAmount + deliveryFee;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xs" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5.5 h-5.5 text-emerald-600" />
            <span className="font-extrabold text-slate-900 text-lg">Giỏ hàng của bạn</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {cartItems.length} sản phẩm
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-250 hover:bg-slate-200 text-slate-500 hover:text-slate-850 cursor-pointer"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Freeship Progress Indicator */}
        {cartItems.length > 0 && (
          <div className="bg-emerald-50 border-b border-emerald-100 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1.5">
              <Truck className="w-4 h-4 text-emerald-600 animate-bounce" />
              {isEligibleForFreeShip ? (
                <span>Chúc mừng! Đơn hàng của bạn đã đủ điều kiện **Miễn phí vận chuyển** !</span>
              ) : (
                <span>Mua thêm <span className="text-emerald-600">{formatVND(freeShipThreshold - totalAmount)}</span> nữa để nhận Freeship!</span>
              )}
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${Math.min((totalAmount / freeShipThreshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <ShoppingBag className="w-16 h-16 text-slate-300 stroke-[1.2]" />
              </div>
              <p className="text-slate-800 font-bold text-base mb-1">Giỏ hàng rỗng!</p>
              <p className="text-slate-400 text-xs max-w-[240px] leading-relaxed mb-6">
                Hãy quay lại trang cửa hàng và lựa chọn các sản phẩm trái cây tươi ngon cho bạn và gia đình nhé.
              </p>
              <button
                onClick={onClose}
                className="bg-emerald-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-emerald-700 cursor-pointer shadow-sm shadow-emerald-100"
              >
                Tiếp tục mua hàng
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              const hasReachedMaxStock = item.quantity >= item.product.stock;

              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-emerald-200 shadow-2xs transition-all relative group"
                >
                  <div className="w-18 h-18 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm truncate pr-4 leading-tight">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Đơn giá: {formatVND(item.product.price)} / {item.product.unit}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800 focus:outline-hidden min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={hasReachedMaxStock}
                          className="px-2 py-1 text-slate-500 hover:text-emerald-700 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-extrabold text-slate-950 text-sm">
                        {formatVND(itemTotal)}
                      </span>
                    </div>

                    {hasReachedMaxStock && (
                      <span className="text-[9px] text-rose-500 font-semibold absolute top-12 left-24">
                        Giới hạn tồn kho ({item.product.stock})
                      </span>
                    )}
                  </div>

                  {/* Remove CTA */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Xóa khỏi giỏ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Grand summary and checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3 shrink-0">
            <div className="space-y-1.5 pb-3.5 border-b border-slate-200 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Tổng giá trị hàng hóa</span>
                <span className="text-slate-900 font-bold">{formatVND(totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1">
                  Phí vận chuyển tốc hành
                  {isEligibleForFreeShip && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">
                      Freeship
                    </span>
                  )}
                </span>
                <span className={`font-bold ${isEligibleForFreeShip ? "text-emerald-600 line-through" : "text-slate-900"}`}>
                  {formatVND(30000)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 pb-2">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block leading-none">
                  Tổng tiền thanh toán
                </span>
                <span className="text-rose-600 hover:text-rose-700 font-black text-xl tracking-tight mt-0.5 block leading-none">
                  {formatVND(finalTotal)}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium text-right leading-relaxed">
                Đã bao gồm VAT (8%)
              </div>
            </div>

            <button
              id="checkout-trigger-btn"
              onClick={onCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-50 cursor-pointer"
            >
              <Gift className="w-4.5 h-4.5" />
              Tiến hành thanh toán
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
