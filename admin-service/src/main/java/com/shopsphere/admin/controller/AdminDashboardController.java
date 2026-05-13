package com.shopsphere.admin.controller;

import com.shopsphere.admin.client.OrderClient;
import com.shopsphere.admin.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final OrderClient orderClient;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        // order-service returns { success, message, data: { totalOrders, ... } }
        // extract the inner data to avoid double-wrapping
        Map<String, Object> orderResponse = orderClient.getDashboard();
        @SuppressWarnings("unchecked")
        Map<String, Object> dashboardData = (Map<String, Object>) orderResponse.getOrDefault("data", orderResponse);
        return ResponseEntity.ok(ApiResponse.success("Dashboard fetched successfully", dashboardData));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReports() {
        Map<String, Object> orderResponse = orderClient.getDashboard();
        @SuppressWarnings("unchecked")
        Map<String, Object> dashboardData = (Map<String, Object>) orderResponse.getOrDefault("data", orderResponse);

        Map<String, Object> allOrdersResponse = orderClient.getAllOrders();
        Object orders = allOrdersResponse.getOrDefault("data", allOrdersResponse);

        Map<String, Object> reports = new HashMap<>();
        reports.put("dashboard", dashboardData);
        reports.put("orders", orders);
        return ResponseEntity.ok(ApiResponse.success("Reports data", reports));
    }
}
