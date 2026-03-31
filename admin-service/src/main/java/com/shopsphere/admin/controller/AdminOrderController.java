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
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("Orders fetched", orderClient.getAllOrders()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", orderClient.updateOrderStatus(id, request.getStatus())));
    }
}
