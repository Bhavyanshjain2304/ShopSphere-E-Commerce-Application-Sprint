package com.shopsphere.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "order-service", url = "${services.order-url:http://order-service:8084}")
public interface OrderClient {

    @GetMapping("/orders/admin/all")
    Map<String, Object> getAllOrders();

    @PutMapping("/orders/{id}/status")
    Map<String, Object> updateOrderStatus(@PathVariable("id") Long id, @RequestParam("status") String status);

    @GetMapping("/orders/admin/dashboard")
    Map<String, Object> getDashboard();
}
