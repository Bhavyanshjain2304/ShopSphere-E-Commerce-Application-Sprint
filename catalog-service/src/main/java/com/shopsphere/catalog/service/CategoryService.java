package com.shopsphere.catalog.service;

import com.shopsphere.catalog.dto.CategoryRequest;
import com.shopsphere.catalog.entity.Category;

import java.util.List;

public interface CategoryService {
    Category createCategory(CategoryRequest request);
    List<Category> getAllCategories();
    Category getCategory(Long id);
    void deleteCategory(Long id);
}
