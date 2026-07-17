package com.getmart.service;

import com.getmart.entity.Category;
import com.getmart.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    @SuppressWarnings("null")
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }
}
