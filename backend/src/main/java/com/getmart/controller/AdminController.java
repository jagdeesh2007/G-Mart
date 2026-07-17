package com.getmart.controller;

import com.getmart.dto.AdminMetricsDto;
import com.getmart.entity.Order;
import com.getmart.entity.Product;
import com.getmart.entity.User;
import com.getmart.repository.OrderRepository;
import com.getmart.repository.ProductRepository;
import com.getmart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.getmart.dto.CreateProductRequest;
import com.getmart.dto.ApiResponse;
import com.getmart.entity.Category;
import com.getmart.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/metrics")
    public ResponseEntity<AdminMetricsDto> getDashboardMetrics() {
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole(User.Role.CUSTOMER);
        long totalOrders = orderRepository.count();
        long activeOrders = orderRepository.countByStatusIn(List.of(Order.OrderStatus.PROCESSING, Order.OrderStatus.SHIPPED));
        long totalProducts = productRepository.count();

        // Calculate total sales
        List<Order> deliveredOrders = orderRepository.findByStatus(Order.OrderStatus.DELIVERED);
        double totalSales = deliveredOrders.stream()
                .mapToDouble(o -> o.getTotalAmount().doubleValue())
                .sum();

        // Fetch recent orders
        List<Order> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc();

        AdminMetricsDto metrics = AdminMetricsDto.builder()
                .totalUsers(totalUsers)
                .totalCustomers(totalCustomers)
                .totalOrders(totalOrders)
                .activeOrders(activeOrders)
                .totalProducts(totalProducts)
                .totalSales(totalSales)
                .recentOrders(recentOrders)
                .build();

        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Category not found!"));
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setImageUrls("[\"" + request.getImageUrl() + "\"]");
        product.setSpecifications("{}");
        product.setIsActive(true);

        productRepository.save(product);
        return ResponseEntity.ok(new ApiResponse(true, "Product added successfully!"));
    }
}
