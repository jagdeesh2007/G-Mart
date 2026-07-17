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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.getmart.repository.CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/metrics")
    public ResponseEntity<AdminMetricsDto> getDashboardMetrics() {
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole(User.Role.CUSTOMER);
        long totalOrders = orderRepository.count();
        long activeOrders = orderRepository
                .countByStatusIn(List.of(Order.OrderStatus.PROCESSING, Order.OrderStatus.SHIPPED));
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

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc());
    }

    /**
     * @param request
     * @return
     */
    @SuppressWarnings("null")
    @PostMapping("/products")
    public ResponseEntity<com.getmart.dto.ApiResponse> createProduct(
            @jakarta.validation.Valid @RequestBody com.getmart.dto.ProductRequest request) {
        @SuppressWarnings("null")
        com.getmart.entity.Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);

        if (category == null) {
            return ResponseEntity.badRequest().body(new com.getmart.dto.ApiResponse(false, "Category not found!"));
        }

        String imageUrlsJson = "[]";
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            imageUrlsJson = "[\"" + request.getImageUrl() + "\"]";
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .category(category)
                .imageUrls(imageUrlsJson)
                .isActive(true)
                .build();

        productRepository.save(product);

        return ResponseEntity.ok(new com.getmart.dto.ApiResponse(true, "Product created successfully!"));
    }
}
