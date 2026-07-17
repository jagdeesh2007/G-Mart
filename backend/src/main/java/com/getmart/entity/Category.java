package com.getmart.entity;

import jakarta.persistence.*;
import java.util.List;

@SuppressWarnings("unused")
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    private String imageUrl;

    private boolean isActive = true;

    public Category() {}

    public Category(Long id, String name, String description, String imageUrl, boolean isActive) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.isActive = isActive;
    }

    public static CategoryBuilder builder() { return new CategoryBuilder(); }
    public static class CategoryBuilder {
        private Long id;
        public CategoryBuilder id(Long id) { this.id = id; return this; }
        private String name;
        public CategoryBuilder name(String name) { this.name = name; return this; }
        private String description;
        public CategoryBuilder description(String description) { this.description = description; return this; }
        private String imageUrl;
        public CategoryBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        private boolean isActive;
        public CategoryBuilder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public Category build() { return new Category(id, name, description, imageUrl, isActive); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public boolean getIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }
}
