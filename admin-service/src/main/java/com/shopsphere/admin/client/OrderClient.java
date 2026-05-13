package com.shopsphere.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Feign client for order-service.
 * Order-service wraps responses in ApiResponse<T> { success, message, data }.
 * We return Map<String,Object> for the full wrapper and extract .get("data") in the controller.
 */
@FeignClient(name = "order-service", url = "${services.order-url:http://order-service:8084}")
public interface OrderClient {

    @GetMapping("/orders/admin/all")
    Map<String, Object> getAllOrders();

    @PutMapping("/orders/{id}/status")
    Map<String, Object> updateOrderStatus(@PathVariable("id") Long id,
                                          @RequestParam("status") String status);

    @GetMapping("/orders/admin/dashboard")
    Map<String, Object> getDashboard();
}
