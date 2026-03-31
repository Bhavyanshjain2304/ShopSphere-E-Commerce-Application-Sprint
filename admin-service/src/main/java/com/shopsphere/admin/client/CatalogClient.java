package com.shopsphere.admin.client;

import com.shopsphere.admin.dto.ProductRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "catalog-service", url = "${services.catalog-url:http://catalog-service:8083}")
public interface CatalogClient {

    @PostMapping("/products")
    Map<String, Object> createProduct(@RequestBody ProductRequest request);

    @PutMapping("/products/{id}")
    Map<String, Object> updateProduct(@PathVariable("id") Long id, @RequestBody ProductRequest request);

    @DeleteMapping("/products/{id}")
    Map<String, Object> deleteProduct(@PathVariable("id") Long id);

    @GetMapping("/products")
    Map<String, Object> getAllProducts(@RequestParam("page") int page, @RequestParam("size") int size);
}
