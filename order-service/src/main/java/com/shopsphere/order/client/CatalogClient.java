package com.shopsphere.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "catalog-service", url = "${services.catalog-url:http://catalog-service:8083}")
public interface CatalogClient {

    @GetMapping("/products/{id}")
    Map<String, Object> getProduct(@PathVariable("id") Long id);
}
