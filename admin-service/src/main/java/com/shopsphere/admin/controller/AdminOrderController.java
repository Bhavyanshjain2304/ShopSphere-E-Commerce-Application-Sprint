package com.shopsphere.admin.controller;

import com.shopsphere.admin.client.OrderClient;
import com.shopsphere.admin.dto.ApiResponse;
import com.shopsphere.admin.dto.OrderStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderClient orderClient;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAllOrders() {
        Map<String, Object> response = orderClient.getAllOrders();
        // Unwrap inner data from order-service ApiResponse wrapper
        Object data = response.getOrDefault("data", response);
        return ResponseEntity.ok(ApiResponse.success("Orders fetched", data));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Object>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusRequest request) {
        Map<String, Object> response = orderClient.updateOrderStatus(id, request.getStatus());
        Object data = response.getOrDefault("data", response);
        return ResponseEntity.ok(ApiResponse.success("Status updated", data));
    }
}
