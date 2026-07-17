package com.getmart.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    public CartItem() {}

    public CartItem(Long id, User user, Product product, Integer quantity) {
        this.id = id;
        this.user = user;
        this.product = product;
        this.quantity = quantity;
    }

    public static CartItemBuilder builder() { return new CartItemBuilder(); }
    public static class CartItemBuilder {
        private Long id;
        public CartItemBuilder id(Long id) { this.id = id; return this; }
        private User user;
        public CartItemBuilder user(User user) { this.user = user; return this; }
        private Product product;
        public CartItemBuilder product(Product product) { this.product = product; return this; }
        private Integer quantity;
        public CartItemBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public CartItem build() { return new CartItem(id, user, product, quantity); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
