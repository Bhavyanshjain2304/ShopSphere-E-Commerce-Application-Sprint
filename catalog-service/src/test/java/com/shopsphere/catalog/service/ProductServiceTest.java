package com.shopsphere.catalog.service;

import com.shopsphere.catalog.dto.ProductRequest;
import com.shopsphere.catalog.dto.ProductResponse;
import com.shopsphere.catalog.entity.Category;
import com.shopsphere.catalog.entity.Product;
import com.shopsphere.catalog.exception.ResourceNotFoundException;
import com.shopsphere.catalog.repository.CategoryRepository;
import com.shopsphere.catalog.repository.ProductRepository;
import com.shopsphere.catalog.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Category mockCategory;
    private Product mockProduct;
    private ProductRequest mockRequest;

    @BeforeEach
    void setUp() {
        mockCategory = new Category();
        mockCategory.setId(1L);
        mockCategory.setName("Electronics");

        mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setName("Laptop");
        mockProduct.setDescription("A powerful laptop");
        mockProduct.setPrice(new BigDecimal("999.99"));
        mockProduct.setStock(50);
        mockProduct.setCategory(mockCategory);
        mockProduct.setActive(true);

        mockRequest = new ProductRequest();
        mockRequest.setName("Laptop");
        mockRequest.setDescription("A powerful laptop");
        mockRequest.setPrice(new BigDecimal("999.99"));
        mockRequest.setStock(50);
        mockRequest.setCategoryId(1L);
    }

    // --- CREATE TESTS ---

    @Test
    void createProduct_Success() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        ProductResponse response = productService.createProduct(mockRequest);

        assertNotNull(response);
        assertEquals("Laptop", response.getName());
        assertEquals(new BigDecimal("999.99"), response.getPrice());
        assertEquals("Electronics", response.getCategoryName());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void createProduct_CategoryNotFound_ThrowsException() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.createProduct(mockRequest));
        verify(productRepository, never()).save(any());
    }

    // --- GET TESTS ---

    @Test
    void getProduct_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        ProductResponse response = productService.getProduct(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Laptop", response.getName());
        assertEquals(50, response.getStock());
    }

    @Test
    void getProduct_NotFound_ThrowsException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProduct(99L));
    }

    // --- UPDATE TESTS ---

    @Test
    void updateProduct_Success() {
        mockRequest.setName("Laptop Pro");
        mockRequest.setPrice(new BigDecimal("1199.99"));

        Product updatedProduct = new Product();
        updatedProduct.setId(1L);
        updatedProduct.setName("Laptop Pro");
        updatedProduct.setPrice(new BigDecimal("1199.99"));
        updatedProduct.setStock(50);
        updatedProduct.setCategory(mockCategory);
        updatedProduct.setActive(true);

        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        ProductResponse response = productService.updateProduct(1L, mockRequest);

        assertNotNull(response);
        assertEquals("Laptop Pro", response.getName());
        assertEquals(new BigDecimal("1199.99"), response.getPrice());
    }

    // --- DELETE TEST ---

    @Test
    void deleteProduct_SoftDelete_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        productService.deleteProduct(1L);

        assertFalse(mockProduct.isActive());
        verify(productRepository).save(mockProduct);
    }

    @Test
    void deleteProduct_NotFound_ThrowsException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.deleteProduct(99L));
    }

    // --- PAGINATION TEST ---

    @Test
    void getAllProducts_ReturnsPaginatedResults() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> productPage = new PageImpl<>(List.of(mockProduct));

        when(productRepository.findByActiveTrue(pageable)).thenReturn(productPage);

        Page<ProductResponse> result = productService.getAllProducts(pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals("Laptop", result.getContent().get(0).getName());
    }
}
