package com.shopsphere.admin.controller;

import com.shopsphere.admin.client.OrderClient;
import com.shopsphere.admin.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final OrderClient orderClient;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard data", orderClient.getDashboard()));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReports() {
        Map<String, Object> reports = new java.util.HashMap<>();
        reports.put("orders", orderClient.getAllOrders());
        reports.put("dashboard", orderClient.getDashboard());
        return ResponseEntity.ok(ApiResponse.success("Reports data", reports));
    }
}
