package com.shopsphere.admin.controller;

import com.shopsphere.admin.client.CatalogClient;
import com.shopsphere.admin.dto.ApiResponse;
import com.shopsphere.admin.dto.ProductRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final CatalogClient catalogClient;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = catalogClient.getAllProducts(page, size);
        Object data = response.getOrDefault("data", response);
        return ResponseEntity.ok(ApiResponse.success("Products fetched", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> createProduct(
            @Valid @RequestBody ProductRequest request) {
        Map<String, Object> response = catalogClient.createProduct(request);
        Object data = response.getOrDefault("data", response);
        return ResponseEntity.ok(ApiResponse.success("Product created", data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        Map<String, Object> response = catalogClient.updateProduct(id, request);
        Object data = response.getOrDefault("data", response);
        return ResponseEntity.ok(ApiResponse.success("Product updated", data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteProduct(@PathVariable Long id) {
        Map<String, Object> response = catalogClient.deleteProduct(id);
        Object data = response.getOrDefault("data", response);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", data));
    }
}
