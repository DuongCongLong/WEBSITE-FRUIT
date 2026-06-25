import { useState, useEffect } from "react";
import { Search, Sparkles, Filter, Info, ChevronRight, MessageSquareCode } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import VoucherSection from "./components/VoucherSection";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import AdminSection from "./components/AdminSection";
import SpringBootViewer from "./components/SpringBootViewer";
import OrderLookupModal from "./components/OrderLookupModal";
import { Product, CartItem, Order } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"shop" | "admin" | "springboot">("shop");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState(false);

  // Filter and Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

  // Notifications
  const [notification, setNotification] = useState<{ text: string; type: "success" | "warning" } | null>(null);

  // Fetch products and orders
  const fetchProductsAndOrders = async () => {
    try {
      const prodRes = await fetch("/api/products");
      const prodData = await prodRes.json();
      if (prodRes.ok) {
        setProducts(prodData);
      }

      const orderRes = await fetch("/api/orders");
      const orderData = await orderRes.json();
      if (orderRes.ok) {
        setOrders(orderData);
      }
    } catch (err) {
      console.error("Gặp lỗi khi đồng bộ dữ liệu với máy chủ Express:", err);
    }
  };

  useEffect(() => {
    fetchProductsAndOrders();
  }, []);

  const triggerNotification = (text: string, type: "success" | "warning" = "success") => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleAddToCart = (product: Product) => {
    // Check stock
    if (product.stock <= 0) {
      triggerNotification("Sản phẩm đã hết hàng trong hệ thống!", "warning");
      return;
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          triggerNotification(`Chỉ có thể mua tối đa ${product.stock} ${product.unit} cho sản phẩm này!`, "warning");
          return prevItems;
        }
        triggerNotification(`Đã tăng số lượng ${product.name} trong giỏ hàng!`);
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      triggerNotification(`Đã thêm ${product.name} vào giỏ hàng thành công!`);
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    const productInDb = products.find((p) => p.id === id);
    if (!productInDb) return;

    if (newQty > productInDb.stock) {
      triggerNotification(`Kho hàng chỉ còn lại ${productInDb.stock} ${productInDb.unit}!`, "warning");
      return;
    }

    setCartItems((prevItems) =>
      prevItems
        .map((item) => (item.product.id === id ? { ...item, quantity: newQty } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
    triggerNotification("Đã loại bỏ sản phẩm khỏi giỏ hàng");
  };

  // Admin: Create product
  const handleCreateProduct = async (payload: any) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Lỗi tạo mới sản phẩm");
    }
    await fetchProductsAndOrders();
    triggerNotification("Thêm sản phẩm trái cây mới thành công!");
  };

  // Admin: Update product
  const handleUpdateProduct = async (id: string, payload: any) => {
    const res = await fetch("/api/products/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Lỗi cập nhật sản phẩm");
    }
    await fetchProductsAndOrders();
    triggerNotification("Cập nhật thông tin thành công!");
  };

  // Admin: Delete product
  const handleDeleteProduct = async (id: string) => {
    const res = await fetch("/api/products/" + id, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Không thể xóa sản phẩm");
    }
    await fetchProductsAndOrders();
    triggerNotification("Đã xóa nông sản khỏi danh mục thành công!");
  };

  // Admin: Update Status of placing order
  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      throw new Error("Lỗi cập nhật đơn hàng");
    }
    await fetchProductsAndOrders();
    triggerNotification(`Đơn hàng ${id} đã chuyển trạng thái sang -> ${status}`);
  };

  // Category filter trigger Helper
  const categoriesList = ["Tất cả", "Trái cây nội địa", "Trái cây nhập khẩu", "Hộp quà tặng"];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "Tất cả" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col relative" id="app-wrapper">
      
      {/* Dynamic Pop-up alert system */}
      {notification && (
        <div className="fixed top-22 right-4 z-50 animate-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl shadow-xl flex items-center gap-2.5 border text-xs font-bold ${
              notification.type === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-emerald-50 border-emerald-200 text-emerald-900"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${notification.type === "warning" ? "text-amber-500" : "text-emerald-500"}`} />
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
      />

      {/* Main body Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" id="main-content">
        
        {/* SHOP TAB VIEW */}
        {activeTab === "shop" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Banner block */}
            <Hero />

            {/* Voucher Section */}
            <VoucherSection />

            {/* Catalog header controls */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white border border-slate-200 p-4.5 rounded-2xl shadow-sm">
              
              {/* Category pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <Filter className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                      selectedCategory === cat
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-100"
                        : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Keyword Search field */}
              <div className="relative md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên trái cây, quốc gia..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Products grid */}
            <div>
              <div className="flex items-center justify-between mb-5.5">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 leading-none mb-1">
                    Danh mục Trái cây tươi chất lượng
                  </h2>
                  <p className="text-slate-500 text-xs font-medium">Bao tiêu từ các nông trại tiêu chuẩn chất lượng VietGAP, GlobalGAP</p>
                </div>
                <div className="text-xs bg-emerald-50 text-emerald-800 font-extrabold px-3 py-1 rounded-full border border-emerald-100">
                  Phát hiện {filteredProducts.length} sản phẩm
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 font-semibold text-xs sm:text-sm shadow-sm">
                  Không tìm thấy sản phẩm trái cây nào khớp với bộ lọc ứng dụng của bạn!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetail={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Dev tip panel explaining how Spring boot integration can be used */}
            <div className="bg-indigo-50/30 border border-indigo-150/40 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
              <div className="bg-indigo-100/60 p-2.5 rounded-xl text-indigo-700 font-bold shrink-0">
                <MessageSquareCode className="w-5.5 h-5.5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-extrabold text-indigo-950">Muốn kết hợp ứng dụng này với mã nguồn Java Spring Boot của bạn?</p>
                <p className="text-indigo-900 leading-relaxed font-medium">
                  Chúng tôi đã dựng sẵn bộ Rest API trong thư mục <strong className="font-mono bg-white px-1 py-0.2 select-all">/springboot-backend</strong> tương đồng cấu trúc dữ liệu với máy chủ Node.js này. Click vào tab Spring Boot để lấy code!
                </p>
              </div>
              <button
                onClick={() => setActiveTab("springboot")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-4 rounded-lg flex items-center gap-1 shrink-0 self-start sm:self-center transition-all shadow-xs cursor-pointer"
              >
                Khám phá ngay
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ADMIN TAB VIEW */}
        {activeTab === "admin" && (
          <div className="animate-in fade-in duration-200">
            <AdminSection
              products={products}
              orders={orders}
              onCreateProduct={handleCreateProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          </div>
        )}

        {/* SPRINGBOOT TAB VIEW */}
        {activeTab === "springboot" && (
          <div className="animate-in fade-in duration-200">
            <SpringBootViewer />
          </div>
        )}

      </main>

      {/* Interactive Detail Modal stage */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onRefreshProducts={fetchProductsAndOrders}
      />

      {/* Interactive Slide Cart Panel */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Interactive Checkout Modal flow */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onClearCart={() => setCartItems([])}
        onOrderSuccess={(id) => {
          console.log(`Đã lưu thành công order ID: ${id}`);
        }}
        onRefreshProducts={fetchProductsAndOrders}
      />

      {/* Interactive Order Lookup Modal */}
      <OrderLookupModal
        isOpen={isOrderLookupOpen}
        onClose={() => setIsOrderLookupOpen(false)}
        orders={orders}
      />

      {/* Premium Footer section */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Column 1: Info and brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 p-2 rounded-xl text-white">
                  <span className="font-extrabold text-base">GF</span>
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">GreenFruit Store</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống bán lẻ trái cây sạch nhập khẩu cao cấp & trái cây organic nội địa loại 1. Mang lại bữa ăn an toàn vệ sinh, ngập tràn sức khỏe cho mọi tổ ấm gia đình Việt.
              </p>
              <div className="pt-2 text-xs font-bold text-slate-400">
                <span className="block">Giờ mở cửa: 07:00 - 22:00</span>
                <span className="block text-emerald-400 mt-1">Làm việc cả thứ 7 & Chủ Nhật</span>
              </div>
            </div>

            {/* Column 2: Policies */}
            <div>
              <h4 className="text-sm font-black uppercase text-white tracking-wider mb-4 border-l-3 border-emerald-500 pl-2.5">
                Chính sách vàng
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#store-hero" className="hover:text-emerald-400 hover:underline transition-all flex items-center gap-1.5">
                    • Bảo hành hoàn tiền 24H
                  </a>
                </li>
                <li>
                  <a href="#store-hero" className="hover:text-emerald-400 hover:underline transition-all flex items-center gap-1.5">
                    • Vận chuyển siêu tốc 2H
                  </a>
                </li>
                <li>
                  <a href="#store-hero" className="hover:text-emerald-400 hover:underline transition-all flex items-center gap-1.5">
                    • Cam kết GlobalGAP organic
                  </a>
                </li>
                <li>
                  <a href="#store-hero" className="hover:text-emerald-400 hover:underline transition-all flex items-center gap-1.5">
                    • Hỗ trợ thanh toán tiện lợi
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick links */}
            <div>
              <h4 className="text-sm font-black uppercase text-white tracking-wider mb-4 border-l-3 border-emerald-500 pl-2.5">
                Hỗ trợ mua sắm
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => setActiveTab("shop")} className="hover:text-emerald-400 hover:underline text-left cursor-pointer">
                    • Danh sách trái cây tươi sạch
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsOrderLookupOpen(true)} className="hover:text-emerald-400 hover:underline text-left cursor-pointer">
                    • Tra cứu lịch trình đơn hàng
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("admin")} className="hover:text-emerald-400 hover:underline text-left cursor-pointer">
                    • Đăng ký làm Nhà Cung Cấp
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("springboot")} className="hover:text-emerald-400 hover:underline text-left cursor-pointer">
                    • Kết nối API Java Spring Boot
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Hotline & Store location */}
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase text-white tracking-wider border-l-3 border-emerald-500 pl-2.5">
                Thông tin liên hệ
              </h4>
              <div className="space-y-2 text-xs">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-slate-400 shrink-0">Hà Nội:</span>
                  <span>182 Lê Duẩn, Hai Bà Trưng, HN</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-slate-400 shrink-0">Sài Gòn:</span>
                  <span>450 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-slate-400 shrink-0">Hotline:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">1900.8198</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-slate-400 shrink-0">Email:</span>
                  <span>lienhe@greenfruit.vn</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} GreenFruit Premium Store. Tất cả quyền được bảo lưu.</p>
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
              <span>Mã nguồn chuẩn chỉnh ReactJS + Java Spring Boot 3</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
