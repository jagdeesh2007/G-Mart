package com.getmart.config;

import com.getmart.entity.Category;
import com.getmart.entity.Product;
import com.getmart.repository.CategoryRepository;
import com.getmart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@SuppressWarnings("unused")
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @SuppressWarnings("null")
    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            // Seed Categories
            Category electronics = Category.builder().name("Electronics").isActive(true).build();
            Category fashion = Category.builder().name("Fashion Wear").isActive(true).build();
            Category vegetables = Category.builder().name("Organic Vegetables").isActive(true).build();
            Category shoes = Category.builder().name("Brand Shoes").isActive(true).build();
            Category sports = Category.builder().name("Sports & Outdoors").isActive(true).build();

            categoryRepository.saveAll(Arrays.asList(electronics, fashion, vegetables, shoes, sports));

            // Seed Products
            Product p1 = Product.builder()
                    .name("Premium Wireless Headphones")
                    .description("High quality sound with active noise cancellation.")
                    .price(new BigDecimal("299.99"))
                    .discountPrice(new BigDecimal("249.99"))
                    .stockQuantity(50)
                    .category(electronics)
                    .isActive(true)
                    .imageUrls("[\"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80\"]")
                    .specifications("{\"Color\":\"Black\",\"Brand\":\"AudioTech\",\"Connectivity\":\"Bluetooth\"}")
                    .build();

            Product p2 = Product.builder()
                    .name("Organic Avocados (Pack of 4)")
                    .description("Fresh, farm-picked organic avocados.")
                    .price(new BigDecimal("12.99"))
                    .stockQuantity(100)
                    .category(vegetables)
                    .isActive(true)
                    .imageUrls("[\"https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80\"]")
                    .specifications("{\"Weight\":\"1 lb\",\"Origin\":\"California\"}")
                    .build();

            Product p3 = Product.builder()
                    .name("Men's Running Shoes")
                    .description("Lightweight running shoes for everyday training.")
                    .price(new BigDecimal("120.00"))
                    .discountPrice(new BigDecimal("89.99"))
                    .stockQuantity(30)
                    .category(shoes)
                    .isActive(true)
                    .imageUrls("[\"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80\"]")
                    .specifications("{\"Color\":\"Red/White\",\"Brand\":\"Sprint\",\"Material\":\"Mesh\"}")
                    .build();

            productRepository.saveAll(Arrays.asList(p1, p2, p3));
            System.out.println("Data seeding completed.");
        }
    }
}
