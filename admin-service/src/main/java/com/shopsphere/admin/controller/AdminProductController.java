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
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Products fetched", catalogClient.getAllProducts(page, size)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createProduct(
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Product created", catalogClient.createProduct(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Product updated", catalogClient.updateProduct(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Product deleted", catalogClient.deleteProduct(id)));
    }
}
