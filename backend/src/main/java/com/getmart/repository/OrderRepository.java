package com.getmart.repository;

import com.getmart.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Order> findByUserId(Long userId, Pageable pageable);
    
    long countByStatusIn(List<Order.OrderStatus> statuses);
    List<Order> findByStatus(Order.OrderStatus status);
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "shippingAddress", "orderItems"})
    List<Order> findTop5ByOrderByCreatedAtDesc();
    
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "shippingAddress", "orderItems"})
    List<Order> findAllByOrderByCreatedAtDesc();
}
