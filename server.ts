import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  description: string;
  origin: string;
  image: string;
  rating?: number;
  reviews?: Review[];
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Chờ xử lý" | "Đã bàn giao" | "Đã hủy" | "Hoàn thành";
  createdAt: string;
}

// In-memory DB
let products: Product[] = [
  {
    id: "1",
    name: "Táo Envy New Zealand",
    category: "Trái cây nhập khẩu",
    price: 135000,
    unit: "Kg",
    stock: 45,
    description: "Táo Envy nhập khẩu chính ngạch từ New Zealand, giòn ngọt đậm đà, hương thơm tự nhiên đặc trưng, vỏ đỏ thẫm rực rỡ và chứa nhiều vitamin tốt cho sức khỏe.",
    origin: "New Zealand",
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: [
      { author: "Hồng Nhung", rating: 5, comment: "Táo rất giòn ngọt, vỏ đỏ bóng bẩy đẹp mắt. Giao hàng nhanh lắm ạ!", date: "2026-06-20T08:30:00Z" },
      { author: "Quốc Anh", rating: 4, comment: "Trái cây tươi ngon, táo Envy ăn giòn ngọt lịm, rất đáng đồng tiền bát gạo.", date: "2026-06-22T14:15:00Z" }
    ]
  },
  {
    id: "2",
    name: "Sầu Riêng Ri6 Chín Tự Nhiên",
    category: "Trái cây nội địa",
    price: 120000,
    unit: "Kg",
    stock: 18,
    description: "Sầu riêng Ri6 cơm vàng, hạt lép, vị béo ngọt đậm đà từ những vùng trồng chuyên canh miền Tây Nam Bộ, được cắt tuyển già chín tự nhiên, không ngâm thuốc hại sức khỏe.",
    origin: "Bến Tre, Việt Nam",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews: [
      { author: "Anh Tuấn", rating: 5, comment: "Múi sầu riêng béo ngậy, vàng óng, ăn ngon xỉu luôn. Đóng gói rất kỹ càng.", date: "2026-06-18T10:05:00Z" }
    ]
  },
  {
    id: "3",
    name: "Nho Mẫu Đơn Shine Muscat",
    category: "Trái cây nhập khẩu",
    price: 390000,
    unit: "Hộp (500g)",
    stock: 25,
    description: "Nho Mẫu Đơn Shine Muscat Hàn Quốc thượng hạng, quả to tròn láng bóng, thịt giòn dai vừa phải, hương thơm sả mật ong dịu nhẹ cao cấp vô cùng lôi cuốn.",
    origin: "Hàn Quốc",
    image: "https://images.unsplash.com/photo-1601275868399-45bec4f4cd9d?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviews: [
      { author: "Lan Hương", rating: 5, comment: "Nho thơm mùi sữa sả mật ong, ngọt thanh, ăn lạnh cực kì sướng miệng.", date: "2026-06-24T03:40:00Z" }
    ]
  },
  {
    id: "4",
    name: "Bơ Sáp Đắk Lắk",
    category: "Trái cây nội địa",
    price: 45000,
    unit: "Kg",
    stock: 60,
    description: "Bơ sáp hữu cơ Đắk Lắk dẻo mịn béo ngậy, cơm vàng đều ruột dày, rất lý tưởng để làm món sinh tố bổ dưỡng hoặc ăn trực tiếp tăng cường chất béo tốt lành.",
    origin: "Đắk Lắk, Việt Nam",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    reviews: [
      { author: "Minh Quân", rating: 4, comment: "Bơ nhận về còn xanh, để 2 hôm chín đều béo dẻo lắm, không bị xơ xíu nào.", date: "2026-06-15T09:12:00Z" }
    ]
  },
  {
    id: "5",
    name: "Dâu Tây Đà Lạt Cao Cấp",
    category: "Trái cây nội địa",
    price: 180000,
    unit: "Hộp (500g)",
    stock: 30,
    description: "Dâu tây Đà Lạt giống New Zealand hái tươi mỗi sáng, trái mọc căng mọng tươi đỏ chín tự nhiên, vị chua ngọt thanh mát cực kì sảng khoái dịu lưỡi.",
    origin: "Lâm Đồng, Việt Nam",
    image: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviews: [
      { author: "Thùy Linh", rating: 5, comment: "Trái dâu to, đỏ mọng nhìn thích mắt vô cùng. Vị chua ngọt thanh thanh chấm muối ngon đỉnh.", date: "2026-06-21T11:50:00Z" }
    ]
  },
  {
    id: "6",
    name: "Hộp Quà Trái Cây Thuần Khiết",
    category: "Hộp quà tặng",
    price: 650000,
    unit: "Hộp",
    stock: 12,
    description: "Hộp quà tặng trái cây cao cấp kết hợp tinh tế giữa Táo Envy, Nho mẫu đơn, Lê Nam Phi chất lượng tuyển lựa, là món quà sang trọng, chân tình cho người thân và đối tác.",
    origin: "Nhiều quốc gia",
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    reviews: [
      { author: "Văn Đức", rating: 5, comment: "Mua tặng đối tác ai cũng khen hộp quà đẹp sang xịn mịn. Trái cây tươi rói.", date: "2026-06-19T16:00:00Z" }
    ]
  },
  {
    id: "7",
    name: "Măng Cụt Chợ Lách Thượng Hạng",
    category: "Trái cây nội địa",
    price: 110000,
    unit: "Kg",
    stock: 35,
    description: "Măng cụt Chợ Lách vỏ mỏng dễ tách, cơm trắng muốt xếp múi hoàn chỉnh, vị chua chua ngọt ngọt thanh tao tuyệt vời cực kỳ giàu vitamin kháng thể tự nhiên.",
    origin: "Bến Tre, Việt Nam",
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: [
      { author: "Mai Phương", rating: 5, comment: "Cả kg không bị hư hỏng trái nào. Măng cụt ngọt lịm trắng phau dẻo quẹo.", date: "2026-06-23T07:10:00Z" }
    ]
  },
  {
    id: "8",
    name: "Cam Sành Tiền Giang Mọng Nước",
    category: "Trái cây nội địa",
    price: 35000,
    unit: "Kg",
    stock: 120,
    description: "Cam sành chính gốc Tiền Giang, vỏ xanh đậm sần sùi nhưng ruột vàng cam mọng nước dồi dào, vị ngọt thanh thích hợp vắt nước uống giải nhiệt bù khoáng mỗi ngày.",
    origin: "Tiền Giang, Việt Nam",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80",
    rating: 4.4,
    reviews: [
      { author: "Bảo Ngọc", rating: 4, comment: "Cam nhiều nước, vỏ hơi dày tí nhưng mọng nước ngọt thanh rất ok nha.", date: "2026-06-16T15:20:00Z" }
    ]
  },
  {
    id: "9",
    name: "Kiwi Vàng Zespri New Zealand",
    category: "Trái cây nhập khẩu",
    price: 165000,
    unit: "Hộp (500g)",
    stock: 40,
    description: "Kiwi vàng thương hiệu Zespri New Zealand nổi tiếng, quả thon thuôn đều ngọt lịm mát ruột, dồi dào chất xơ và chứa lượng vitamin C cao gấp 3 lần cam chanh thông thường.",
    origin: "New Zealand",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviews: [
      { author: "Khánh Huyền", rating: 5, comment: "Kiwi ngọt lịm không hề bị chua gắt, quả to tròn mọng nước lắm ạ.", date: "2026-06-20T10:45:00Z" }
    ]
  },
  {
    id: "10",
    name: "Việt Quất Mỹ Mỹ Hữu Cơ",
    category: "Trái cây nhập khẩu",
    price: 195000,
    unit: "Hộp (125g)",
    stock: 50,
    description: "Việt quất nhập khẩu trực tiếp từ các trang trại Mỹ, đạt tiêu chuẩn hữu cơ USDA nghiêm ngặt, trái căng giòn thịt chắc chứa chất chống oxy hóa cực đỉnh tốt cho tim mạch.",
    origin: "Hoa Kỳ",
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews: [
      { author: "Ngọc Lan", rating: 5, comment: "Bé nhà mình thích ăn việt quất này lắm, quả mọng ngọt không chát.", date: "2026-06-22T08:15:00Z" }
    ]
  },
  {
    id: "11",
    name: "Bưởi Da Xanh Ruột Hồng",
    category: "Trái cây nội địa",
    price: 85000,
    unit: "Quả (1.2-1.5kg)",
    stock: 30,
    description: "Bưởi da xanh cơm màu hồng đậm đặc trưng, tép bưởi bó chặt mọng nước không dính hạt, vị ngọt đậm thanh khiết cực ngon và bổ dưỡng.",
    origin: "Bến Tre, Việt Nam",
    image: "https://images.unsplash.com/photo-1550828520-4cb496926fc9?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviews: [
      { author: "Trần Long", rating: 4, comment: "Bưởi ráo nước, ngọt mát dễ bóc múi, giao hàng bọc chống sốc kỹ lưỡng.", date: "2026-06-17T11:00:00Z" }
    ]
  },
  {
    id: "12",
    name: "Hộp Quà Trái Cây Phú Quý",
    category: "Hộp quà tặng",
    price: 950000,
    unit: "Hộp",
    stock: 15,
    description: "Sự kết hợp hoàn hảo giữa Nho sữa Hàn Quốc, Lê Hàn, Cam sành, Dâu Tây đỏ rực rỡ tuyển chọn loại 1. Thiết kế hộp gỗ lót lụa tinh tế phù hợp biếu tặng đối tác dịp đại lễ.",
    origin: "Liên lục địa",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    reviews: [
      { author: "Hoàng Yến", rating: 5, comment: "Quá sang trọng luôn nha shop ơi. Thích hợp đi biếu gia đình sếp lớn cực kì.", date: "2026-06-24T15:30:00Z" }
    ]
  }
];

let orders: Order[] = [
  {
    id: "ORD-9842",
    customerName: "Nguyễn Văn Hùng",
    email: "hung.nv@gmail.com",
    phone: "0901234567",
    address: "24/8 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh",
    paymentMethod: "COD (Thanh toán khi nhận hàng)",
    items: [
      { productId: "1", name: "Táo Envy New Zealand", quantity: 2, price: 135000 },
      { productId: "4", name: "Bơ Sáp Đắk Lắk", quantity: 3, price: 45000 }
    ],
    totalAmount: 405000,
    status: "Chờ xử lý",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "ORD-3051",
    customerName: "Lê Thị Hồng",
    email: "hongle92@yahoo.com",
    phone: "0987654321",
    address: "Tòa S2.02 Vinhomes Ocean Park, Gia Lâm, Hà Nội",
    paymentMethod: "Chuyển khoản Ngân hàng",
    items: [
      { productId: "3", name: "Nho Mẫu Đơn Shine Muscat", quantity: 1, price: 390000 }
    ],
    totalAmount: 390000,
    status: "Đã bàn giao",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API - Get all products
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  // API - Get single product
  app.get("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
  });

  // API - Create new product
  app.post("/api/products", (req, res) => {
    const { name, category, price, unit, stock, description, origin, image } = req.body;
    if (!name || !price || !unit || !category) {
      return res.status(400).json({ message: "Các thông tin cơ bản: tên, giá, đơn vị, danh mục là bắt buộc" });
    }
    const newProduct: Product = {
      id: String(Date.now()),
      name,
      category,
      price: Number(price),
      unit,
      stock: Number(stock) || 0,
      description: description || "",
      origin: origin || "Chưa rõ",
      image: image || "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80"
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  });

  // API - Update product
  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    const updated = {
      ...products[index],
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : products[index].price,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : products[index].stock,
    };
    products[index] = updated;
    res.json(updated);
  });

  // API - Delete product
  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa" });
    }
    products.splice(index, 1);
    res.json({ message: "Xóa sản phẩm thành công" });
  });

  // API - Add review to product
  app.post("/api/products/:id/reviews", (req, res) => {
    const { id } = req.params;
    const { author, rating, comment } = req.body;
    if (!author || !rating || !comment) {
      return res.status(400).json({ message: "Thiếu thông tin người đánh giá, số sao hoặc bình luận" });
    }
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    if (!product.reviews) {
      product.reviews = [];
    }
    const newReview: Review = {
      author,
      rating: Number(rating),
      comment,
      date: new Date().toISOString()
    };
    product.reviews.push(newReview);
    // Recalculate rating average
    const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    product.rating = Number((totalRating / product.reviews.length).toFixed(1));
    res.status(201).json(product);
  });

  // API - Get all orders
  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  // API - Place an order
  app.post("/api/orders", (req, res) => {
    const { customerName, email, phone, address, paymentMethod, items, discount, deliveryFee } = req.body;
    if (!customerName || !phone || !address || !items || !items.length) {
      return res.status(400).json({ message: "Thiếu thông tin người mua hàng hoặc giỏ hàng trống" });
    }

    let calculatedTotal = 0;
    const processedItems: OrderItem[] = [];

    // Reduce stock and check availability
    for (const item of items) {
      const dbProduct = products.find(p => p.id === item.productId);
      if (!dbProduct) {
        return res.status(400).json({ message: `Sản phẩm id ${item.productId} không tồn tại!` });
      }
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm '${dbProduct.name}' không đủ hàng tồn kho. Hiện chỉ còn ${dbProduct.stock} ${dbProduct.unit}.` });
      }
      dbProduct.stock -= item.quantity;
      calculatedTotal += dbProduct.price * item.quantity;
      processedItems.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        quantity: item.quantity,
        price: dbProduct.price
      });
    }

    const appliedDiscount = Number(discount) || 0;
    const appliedDeliveryFee = Number(deliveryFee) || 0;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      email: email || "",
      phone,
      address,
      paymentMethod,
      items: processedItems,
      totalAmount: Math.max(0, calculatedTotal - appliedDiscount + appliedDeliveryFee),
      status: "Chờ xử lý",
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    res.status(201).json(newOrder);
  });

  // API - Update order status (Admin)
  app.put("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = orders.find(o => o.id === id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    if (!["Chờ xử lý", "Đã bàn giao", "Đã hủy", "Hoàn thành"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái đơn hàng không hợp lệ" });
    }
    order.status = status;
    res.json(order);
  });

  // Serve static files / Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Backend Server] Chạy thành công trên port ${PORT}`);
  });
}

startServer();
