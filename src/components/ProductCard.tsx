import { Plus, Tag, MapPin, Inbox } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetail }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 group transition-all duration-300 flex flex-col h-full"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-4/3 cursor-pointer overflow-hidden bg-slate-50" onClick={() => onViewDetail(product)}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Category Label */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-850 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
          <Tag className="w-2.5 h-2.5 text-emerald-605" />
          {product.category}
        </span>

        {/* Origin Label */}
        <span className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1.5">
          <MapPin className="w-2.5 h-2.5 text-slate-300" />
          {product.origin}
        </span>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-rose-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg">
              Tạm hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3
            onClick={() => onViewDetail(product)}
            className="text-slate-900 font-bold text-base line-clamp-2 hover:text-emerald-600 transition-colors cursor-pointer mb-1.5 leading-snug"
          >
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating !== undefined && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-amber-500 text-sm font-bold">★</span>
              <span className="text-slate-800 text-xs font-extrabold">{product.rating}</span>
              <span className="text-slate-400 text-[11px] font-medium">({product.reviews?.length || 0} đánh giá)</span>
            </div>
          )}

          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-3">
            {product.description || "Chưa có mô tả chi tiết cho sản phẩm sành điệu này."}
          </p>
        </div>

        {/* Stock status indicator */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-3.5">
          <Inbox className="w-3.5 h-3.5 text-slate-400" />
          <span>Còn lại: </span>
          <span className={`font-bold ${product.stock <= 5 ? "text-amber-600 animate-pulse" : "text-emerald-700"}`}>
            {product.stock} {product.unit}
          </span>
        </div>

        {/* Footer info: Price & CTAs */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block leading-none">
              Giá bán lẻ
            </span>
            <span className="text-slate-900 font-extrabold text-lg">
              {formatVND(product.price)}
              <span className="text-xs text-slate-500 font-semibold lowercase">/{product.unit}</span>
            </span>
          </div>

          <button
            id={`btn-add-to-cart-${product.id}`}
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 border border-slate-300/30 cursor-not-allowed"
                : "bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 shadow-sm shadow-emerald-55 hover:shadow-emerald-200"
            }`}
          >
            <Plus className="w-4 h-4" />
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
