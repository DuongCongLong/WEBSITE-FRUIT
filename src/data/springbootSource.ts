export interface SpringCodeFile {
  name: string;
  path: string;
  language: string;
  code: string;
  description: string;
}

export const springBootFiles: SpringCodeFile[] = [
  {
    name: "pom.xml",
    path: "pom.xml",
    language: "xml",
    description: "Tệp cấu hình Maven định nghĩa các dependency cho một dự án Spring Boot tiêu chuẩn (Web, JPA, H2/PostgreSQL database và Lombok).",
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.fruitecom</groupId>
    <artifactId>fruit-store-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>fruit-store-backend</name>
    <description>Spring Boot Backend for Premium Fruit Store</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Web for Rest API -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- H2 Database for testing/dev (or PostgreSQL/MySQL) -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- PostgreSQL driver for Production -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok to remove boilplate getters/setters -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Spring Boot Starter Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    name: "Fruit.java (Entity)",
    path: "src/main/java/com/fruitecom/fruitstore/model/Fruit.java",
    language: "java",
    description: "Lớp mô hình thực thể (JPA Entity) ánh xạ trực tiếp đến bảng 'fruits' trong cơ sở dữ liệu.",
    code: `package com.fruitecom.fruitstore.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fruits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fruit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private Integer stock;

    @Column(length = 1000)
    private String description;

    private String origin;

    @Column(length = 500)
    private String image;
}`
  },
  {
    name: "Order.java (Entity)",
    path: "src/main/java/com/fruitecom/fruitstore/model/Order.java",
    language: "java",
    description: "Thực thể Đơn hàng gồm quan hệ One-to-Many với tệp chi tiết đơn hàng (OrderItem).",
    code: `package com.fruitecom.fruitstore.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String customerName;

    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(nullable = false)
    private String paymentMethod;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private String status; // Wait, e.g., "Chờ xử lý", "Đã bàn giao", etc.

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}`
  },
  {
    name: "OrderItem.java (Entity)",
    path: "src/main/java/com/fruitecom/fruitstore/model/OrderItem.java",
    language: "java",
    description: "Thực thể mô tả chi tiết của từng loại trái cây trong một đơn hàng.",
    code: `package com.fruitecom.fruitstore.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double price;
}`
  },
  {
    name: "FruitRepository.java",
    path: "src/main/java/com/fruitecom/fruitstore/repository/FruitRepository.java",
    language: "java",
    description: "Lớp giao diện Spring Data JPA kế thừa JpaRepository cung cấp sẵn các hàm truy vấn DB CRUD cơ bản.",
    code: `package com.fruitecom.fruitstore.repository;

import com.fruitecom.fruitstore.model.Fruit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FruitRepository extends JpaRepository<Fruit, Long> {
    // Tìm kiếm sản phẩm theo tên
    List<Fruit> findByNameContainingIgnoreCase(String name);
    
    // Tìm kiếm theo danh mục
    List<Fruit> findByCategory(String category);
}`
  },
  {
    name: "OrderRepository.java",
    path: "src/main/java/com/fruitecom/fruitstore/repository/OrderRepository.java",
    language: "java",
    description: "Giao diện quản lý danh sách truy vấn đơn đặt hàng từ Database.",
    code: `package com.fruitecom.fruitstore.repository;

import com.fruitecom.fruitstore.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Lấy đơn hàng mới nhất lên đầu
    List<Order> findAllByOrderByCreatedAtDesc();
}`
  },
  {
    name: "FruitController.java",
    path: "src/main/java/com/fruitecom/fruitstore/controller/FruitController.java",
    language: "java",
    description: "Lớp phản hồi REST API xử lý các yêu cầu CRUD về Trái Cây bao gồm lấy danh sách, tạo mới, chỉnh sửa, và xóa.",
    code: `package com.fruitecom.fruitstore.controller;

import com.fruitecom.fruitstore.model.Fruit;
import com.fruitecom.fruitstore.repository.FruitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Hỗ trợ kết nối từ mọi frontend (CORS)
public class FruitController {

    @Autowired
    private FruitRepository fruitRepository;

    // Lấy toàn bộ sản phẩm trái cây
    @GetMapping
    public List<Fruit> getAllProducts() {
        return fruitRepository.findAll();
    }

    // Lấy chi tiết trái cây theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Fruit> getProductById(@PathVariable Long id) {
        return fruitRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tạo mới một loại trái cây
    @PostMapping
    public ResponseEntity<Fruit> createProduct(@RequestBody Fruit fruit) {
        Fruit savedFruit = fruitRepository.save(fruit);
        return new ResponseEntity<>(savedFruit, HttpStatus.CREATED);
    }

    // Chỉnh sửa thông tin trái cây
    @PutMapping("/{id}")
    public ResponseEntity<Fruit> updateProduct(@PathVariable Long id, @RequestBody Fruit fruitDetails) {
        return fruitRepository.findById(id).map(fruit -> {
            fruit.setName(fruitDetails.getName());
            fruit.setCategory(fruitDetails.getCategory());
            fruit.setPrice(fruitDetails.getPrice());
            fruit.setUnit(fruitDetails.getUnit());
            fruit.setStock(fruitDetails.getStock());
            fruit.setDescription(fruitDetails.getDescription());
            fruit.setOrigin(fruitDetails.getOrigin());
            fruit.setImage(fruitDetails.getImage());
            Fruit updatedFruit = fruitRepository.save(fruit);
            return ResponseEntity.ok(updatedFruit);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Xóa trái cây khỏi cửa hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (fruitRepository.existsById(id)) {
            fruitRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}`
  },
  {
    name: "OrderController.java",
    path: "src/main/java/com/fruitecom/fruitstore/controller/OrderController.java",
    language: "java",
    description: "Bộ điều khiển API xử lý việc tạo đơn hàng mới (đồng thời trừ kho) và quản lý trạng thái từ phía Admin.",
    code: `package com.fruitecom.fruitstore.controller;

import com.fruitecom.fruitstore.model.Fruit;
import com.fruitecom.fruitstore.model.Order;
import com.fruitecom.fruitstore.model.OrderItem;
import com.fruitecom.fruitstore.repository.FruitRepository;
import com.fruitecom.fruitstore.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FruitRepository fruitRepository;

    // Xem danh sách toàn bộ đơn đặt hàng
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    // Đặt mua hàng mới (sử dụng Transactional để khôi phục nếu có lỗi trừ kho)
    @PostMapping
    @Transactional
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        if (order.getItems() == null || order.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Giỏ hàng không được để trống"));
        }

        double calculatedTotal = 0;

        // Trừ kho trái cây từ Database
        for (OrderItem item : order.getItems()) {
            Fruit fruit = fruitRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm mã " + item.getProductId() + " không tồn tại"));

            if (fruit.getStock() < item.getQuantity()) {
                return ResponseEntity.badRequest().body(Map.of("message", 
                        "Sản phẩm '" + fruit.getName() + "' không đủ hàng tồn kho. Còn lại: " + fruit.getStock()));
            }

            // Cập nhật số lượng kho
            fruit.setStock(fruit.getStock() - item.getQuantity());
            fruitRepository.save(fruit);

            // Ghi nhận giá từ database để tăng tính bảo mật
            item.setPrice(fruit.getPrice());
            item.setName(fruit.getName());
            calculatedTotal += fruit.getPrice() * item.getQuantity();
        }

        order.setTotalAmount(calculatedTotal);
        order.setStatus("Chờ xử lý");
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }

    // Cập nhật trạng thái đơn (hủy, hoàn thành)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        String newStatus = statusMap.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thừa nhận tham số trạng thái: 'status' là bắt buộc"));
        }

        return orderRepository.findById(id).map(order -> {
            order.setStatus(newStatus);
            Order updatedOrder = orderRepository.save(order);
            return ResponseEntity.ok(updatedOrder);
        }).orElse(ResponseEntity.notFound().build());
    }
}`
  },
  {
    name: "application.properties",
    path: "src/main/resources/application.properties",
    language: "properties",
    description: "Cấu hình cổng dịch vụ, tự tạo database H2 in-memory cho lập trình viên xem ngay và chuẩn bị Hibernate.",
    code: `# Cổng chạy server Spring boot
server.port=8080

# Cấu hình database H2 In-Memory chạy lập tức cực nhanh
spring.datasource.url=jdbc:h2:mem:fruitdb;DB_CLOSE_DELAY=-1
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=123456
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Cấu hình tính năng tự động sinh bảng dữ liệu từ JPA Entity
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true`
  }
];
