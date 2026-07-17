package com.getmart.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal price; // Price at the time of order

    public OrderItem() {}

    public OrderItem(Long id, Order order, Product product, Integer quantity, BigDecimal price) {
        this.id = id;
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }

    public static OrderItemBuilder builder() { return new OrderItemBuilder(); }
    public static class OrderItemBuilder {
        private Long id;
        public OrderItemBuilder id(Long id) { this.id = id; return this; }
        private Order order;
        public OrderItemBuilder order(Order order) { this.order = order; return this; }
        private Product product;
        public OrderItemBuilder product(Product product) { this.product = product; return this; }
        private Integer quantity;
        public OrderItemBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        private BigDecimal price;
        public OrderItemBuilder price(BigDecimal price) { this.price = price; return this; }
        public OrderItem build() { return new OrderItem(id, order, product, quantity, price); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
