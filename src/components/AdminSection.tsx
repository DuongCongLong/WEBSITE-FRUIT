import React, { useState } from "react";
import { Plus, Edit2, Trash2, ShieldCheck, Mail, Phone, MapPin, Tag, ListFilter, CalendarDays, Coins } from "lucide-react";
import { Product, Order } from "../types";

interface AdminSectionProps {
  products: Product[];
  orders: Order[];
  onCreateProduct: (product: any) => Promise<void>;
  onUpdateProduct: (id: string, product: any) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (id: string, status: string) => Promise<void>;
}

export default function AdminSection({
  products,
  orders,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus
}: AdminSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<"products" | "orders">("products");

  // Product Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Trái cây nội địa");
  const [formPrice, setFormPrice] = useState("");
  const [formUnit, setFormUnit] = useState("Kg");
  const [formStock, setFormStock] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formOrigin, setFormOrigin] = useState("");
  const [formImage, setFormImage] = useState("");
  
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats
  const totalSales = orders
    .filter(o => o.status !== "Đã hủy")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter(o => o.status === "Chờ xử lý").length;

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormName("");
    setFormCategory("Trái cây nội địa");
    setFormPrice("");
    setFormUnit("Kg");
    setFormStock("");
    setFormDescription("");
    setFormOrigin("");
    setFormImage("");
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(String(product.price));
    setFormUnit(product.unit);
    setFormStock(String(product.stock));
    setFormDescription(product.description);
    setFormOrigin(product.origin);
    setFormImage(product.image);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice.trim() || !formUnit.trim()) {
      setFormError("Vui lòng nhập tên, đơn giá và đơn vị tính của sản phẩm");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    const payload = {
      name: formName,
      category: formCategory,
      price: Number(formPrice),
      unit: formUnit,
      stock: Number(formStock) || 0,
      description: formDescription,
      origin: formOrigin || "Việt Nam",
      image: formImage || "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80"
    };

    try {
      if (editingId) {
        await onUpdateProduct(editingId, payload);
      } else {
        await onCreateProduct(payload);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Gặp lỗi khi xử lý thông tin sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8" id="admin-section-container">
      {/* Sales highlights strip */}
      <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-6">
        Bảng Quản Trị Hệ Thống
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-emerald-50 text-emerald-950 p-5 rounded-2xl border border-emerald-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-2">DOANH THU ƯỚC TÍNH</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">{formatVND(totalSales)}</span>
          </div>
          <span className="text-[10px] text-emerald-600 mt-2 block font-medium">Đã khấu trừ đơn đã hủy</span>
        </div>

        <div className="bg-amber-50 text-amber-950 p-5 rounded-2xl border border-amber-100 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-2">ĐƠN CHỜ XỬ LÝ</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight">{pendingOrdersCount} đơn</div>
          <span className="text-[10px] text-amber-600 mt-2 block font-medium">Bần giao nhanh cho shipper</span>
        </div>

        <div className="bg-slate-50 text-slate-950 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">DANH MỤC TRÁI CÂY</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{products.length} sản phẩm</div>
          <span className="text-[10px] text-slate-500 mt-2 block font-medium">Hỗ trợ đầy đủ chức năng CRUD</span>
        </div>
      </div>

      {/* Tabs selectors with add new product button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveSubTab("products")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "products"
                ? "bg-white text-slate-900 shadow-3xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Danh sách Trái cây ({products.length})
          </button>
          <button
            onClick={() => setActiveSubTab("orders")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === "orders"
                ? "bg-white text-slate-900 shadow-3xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Đơn đặt hàng ({orders.length})
          </button>
        </div>

        {activeSubTab === "products" && (
          <button
            onClick={handleOpenCreate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm mới
          </button>
        )}
      </div>

      {/* Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 p-6 sm:p-8 relative">
            <h3 className="text-lg font-extrabold text-slate-900 mb-5">
              {editingId ? "Cập nhật thông tin Trái cây" : "Thêm mới Trái cây hữu cơ"}
            </h3>

            {formError && (
              <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-lg text-xs font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên trái cây *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: Lê Nam Phi nhập khẩu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Danh mục *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Trái cây nội địa">Trái cây nội địa</option>
                    <option value="Trái cây nhập khẩu">Trái cây nhập khẩu</option>
                    <option value="Hộp quà tặng">Hộp quà tặng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Đơn giá (VND) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="VD: 120000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Đơn vị *</label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="VD: Kg, Hộp, Túi..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Kho hàng tồn *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="VD: 50"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Xuất xứ</label>
                  <input
                    type="text"
                    value={formOrigin}
                    onChange={(e) => setFormOrigin(e.target.value)}
                    placeholder="VD: Úc, Nam Phi, Đà Lạt..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hình ảnh (URL)</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="VD: https://picsum.photos/600"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ghi nhận mùi vị, lượng dưỡng chất hoặc quy trình nuôi cấy..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs cursor-pointer"
                >
                  {isSubmitting ? "Đang lưu..." : "Xác nhận & Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub sections content grid */}
      {activeSubTab === "products" ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 pb-3 text-slate-400 font-bold text-xs">
                <th className="py-3 px-2">Hình ảnh</th>
                <th className="py-3 px-2">Tên Trái Cây</th>
                <th className="py-3 px-2">Phân loại</th>
                <th className="py-3 px-2">Giá tiền</th>
                <th className="py-3 px-2 text-center">Tồn kho / Đơn vị</th>
                <th className="py-3 px-2 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight mb-0.5">{product.name}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span>Xuất xứ: <strong>{product.origin}</strong></span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100/50 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-bold font-mono text-slate-900">
                    {formatVND(product.price)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`font-mono font-bold ${product.stock <= 5 ? "text-rose-600" : "text-slate-700"}`}>
                      {product.stock}
                    </span>{" "}
                    <span className="text-xs text-slate-400">{product.unit}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <Plus className="w-4 h-4 text-emerald-700 bg-emerald-50 rounded-full" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Bạn chắc chắn muốn xóa sản phẩm ${product.name} chứ?`)) {
                            onDeleteProduct(product.id);
                          }
                        }}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Orders list block */
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Hệ thống chưa ghi nhận đơn đặt hàng nào trong phiên này.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="border border-slate-200/80 rounded-2xl bg-white shadow-3xs overflow-hidden"
              >
                {/* Header of single order containing code & status selection */}
                <div className="bg-slate-50 p-4 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{order.id}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Trạng thái: </label>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                      className={`text-[11px] font-extrabold select-none outline-hidden px-2.5 py-1 rounded-full border transition-all ${
                        order.status === "Chờ xử lý"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : order.status === "Đã bàn giao"
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : order.status === "Đã hủy"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : "bg-emerald-100 text-emerald-800 border-emerald-300"
                      }`}
                    >
                      <option value="Chờ xử lý">Chờ xử lý</option>
                      <option value="Đã bàn giao">Đã bàn giao</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                </div>

                {/* Body details of customer and items */}
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  {/* Column 1: Customer */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      KHÁCH HÀNG NHẬN
                    </h5>
                    <p className="font-extrabold text-slate-900 text-sm leading-none">{order.customerName}</p>
                    <p className="text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      {order.phone}
                    </p>
                    {order.email && (
                      <p className="text-slate-600 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        {order.email}
                      </p>
                    )}
                    <p className="text-slate-500 font-medium flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                      {order.address}
                    </p>
                  </div>

                  {/* Column 2: Items list */}
                  <div className="space-y-2 md:border-l md:border-slate-100 md:pl-6">
                    <h5 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      GIỎ SẢN PHẨM MUA
                    </h5>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto w-full">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-700 font-medium pb-1 border-b border-dashed border-slate-100">
                          <span>{it.name} <span className="text-slate-400">x{it.quantity}</span></span>
                          <span className="font-mono text-slate-900 font-bold">{formatVND(it.price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Payment summary */}
                  <div className="space-y-2 md:border-l md:border-slate-100 md:pl-6 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-slate-405 text-slate-400" />
                        HÌNH THỨC THANH TOÁN
                      </h5>
                      <p className="font-bold text-slate-800 leading-snug mb-2">{order.paymentMethod}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block pb-0.5">Tổng số tiền</span>
                        <span className="text-rose-600 font-black text-base leading-none">
                          {formatVND(order.totalAmount)}
                        </span>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Đã xác minh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
