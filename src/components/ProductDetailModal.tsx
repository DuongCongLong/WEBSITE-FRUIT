import React, { useState, useEffect } from "react";
import { X, MapPin, Inbox, Tag, ShieldAlert, Star, MessageSquare, Check, Sparkles } from "lucide-react";
import { Product } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onRefreshProducts?: () => void;
}

export default function ProductDetailModal({ product, onClose, onAddToCart, onRefreshProducts }: ProductDetailModalProps) {
  const [localProduct, setLocalProduct] = useState<Product | null>(null);
  
  // Review form states
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync state with product prop
  useEffect(() => {
    if (product) {
      setLocalProduct(product);
      setAuthor("");
      setRating(5);
      setComment("");
      setErrorMessage(null);
      setSuccessMessage(null);
    } else {
      setLocalProduct(null);
    }
  }, [product]);

  if (!localProduct) return null;

  const isOutOfStock = localProduct.stock <= 0;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ tên và bình luận!");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/products/${localProduct.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, rating, comment }),
      });

      const updatedProd = await res.json();
      if (res.ok) {
        setLocalProduct(updatedProd);
        setAuthor("");
        setRating(5);
        setComment("");
        setSuccessMessage("Cảm ơn bạn đã gửi đánh giá thành công!");
        if (onRefreshProducts) {
          onRefreshProducts();
        }
      } else {
        setErrorMessage(updatedProd.message || "Lỗi khi gửi đánh giá");
      }
    } catch (err) {
      setErrorMessage("Không thể kết nối máy chủ để gửi đánh giá!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" id="product-detail-overlay">
      {/* Backdrop */}
      <div className="fixed inset-0 transition-opacity" onClick={onClose} />

      {/* Content box */}
      <div className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-150 z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header containing close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            Chi tiết sản phẩm & Nhận xét
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Image & Buying */}
            <div className="space-y-6">
              <div className="aspect-4/3 relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                <img
                  src={localProduct.image}
                  alt={localProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-2xs flex items-center justify-center">
                    <span className="bg-rose-500 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg">
                      Tạm hết hàng trong kho
                    </span>
                  </div>
                )}
              </div>

              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-3">
                  <Tag className="w-3 h-3 text-emerald-600" />
                  {localProduct.category}
                </span>

                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-2">
                  {localProduct.name}
                </h2>

                {/* Rating display overview */}
                {localProduct.rating !== undefined && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(localProduct.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-800 text-sm font-extrabold">{localProduct.rating}/5.0</span>
                    <span className="text-slate-400 text-xs">({localProduct.reviews?.length || 0} lượt đánh giá thực tế)</span>
                  </div>
                )}

                {/* Attributes block */}
                <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-150/50">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Xuất xứ</span>
                    <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      {localProduct.origin}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sẵn có trong kho</span>
                    <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                      <Inbox className="w-4 h-4 text-amber-600" />
                      {localProduct.stock} {localProduct.unit}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thông tin chi tiết</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {localProduct.description || "Chưa có mô tả bổ sung cho loại trái cây thơm mát chuẩn tự nhiên này."}
                  </p>
                </div>

                {/* Buying section */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Đơn giá bán lẻ</span>
                      <span className="text-slate-900 font-extrabold text-2xl">
                        {formatVND(localProduct.price)}
                        <span className="text-xs font-semibold text-slate-500">/{localProduct.unit}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(localProduct);
                      onClose();
                    }}
                    disabled={isOutOfStock}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      isOutOfStock
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100 active:scale-98"
                    }`}
                  >
                    Thêm vào giỏ hàng
                  </button>

                  {localProduct.stock <= 5 && !isOutOfStock && (
                    <p className="text-amber-600 text-[11px] font-bold flex items-center gap-1.5 justify-center animate-pulse">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      Kho hàng còn rất ít! Đặt hàng ngay trước khi hết.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Customer Reviews */}
            <div className="space-y-6">
              <div className="border-b border-slate-150 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  Ý kiến khách hàng ({localProduct.reviews?.length || 0})
                </h3>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                {!localProduct.reviews || localProduct.reviews.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-150/40 text-slate-400 text-xs font-semibold">
                    Chưa có bình luận nào cho sản phẩm này. Hãy là người đầu tiên chia sẻ cảm nhận!
                  </div>
                ) : (
                  localProduct.reviews.map((rev, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-950 text-sm">{rev.author}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(rev.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Viết phản hồi của bạn</h4>
                
                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Họ và tên</label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="VD: Anh Tuấn"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Đánh giá sao</label>
                      <div className="flex items-center gap-1.5 h-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="text-amber-400 hover:scale-110 transition-transform cursor-pointer focus:outline-hidden"
                          >
                            <Star
                              className={`w-5.5 h-5.5 ${
                                star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Nội dung nhận xét</label>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Sản phẩm rất tươi ngon, giao hàng chu đáo, nhân viên thân thiện..."
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs font-semibold focus:outline-hidden focus:border-emerald-500 leading-relaxed resize-none"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-rose-600 font-semibold">{errorMessage}</p>
                  )}

                  {successMessage && (
                    <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      {successMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-xs disabled:bg-slate-300"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
