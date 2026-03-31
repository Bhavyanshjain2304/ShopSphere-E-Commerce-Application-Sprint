package com.shopsphere.order.controller;

import com.shopsphere.order.dto.ApiResponse;
import com.shopsphere.order.dto.CheckoutStartRequest;
import com.shopsphere.order.dto.PaymentRequest;
import com.shopsphere.order.entity.Order;
import com.shopsphere.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Step 1: Start checkout with address and delivery info
    @PostMapping("/checkout/start")
    public ResponseEntity<ApiResponse<Order>> startCheckout(
            @RequestHeader("X-User-Email") String userEmail,
            @Valid @RequestBody CheckoutStartRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Checkout started", orderService.startCheckout(userEmail, request)));
    }

    // Step 2: Process payment
    @PostMapping("/payment")
    public ResponseEntity<ApiResponse<Map<String, Object>>> processPayment(
            @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payment processed", orderService.processPayment(request)));
    }

    // Step 3: Place order (finalize)
    @PostMapping("/place")
    public ResponseEntity<ApiResponse<Order>> placeOrder(
            @RequestHeader("X-User-Email") String userEmail,
            @RequestParam Long orderId) {
        return ResponseEntity.ok(ApiResponse.success("Order placed", orderService.placeOrder(userEmail, orderId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrder(
            @RequestHeader("X-User-Email") String userEmail,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order fetched", orderService.getOrder(id, userEmail)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Order>>> getHistory(
            @RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.ok(ApiResponse.success("Order history", orderService.getOrderHistory(userEmail)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable Long id,
            @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", orderService.updateOrderStatus(id, status)));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("All orders", orderService.getAllOrders()));
    }

    @GetMapping("/admin/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard data", orderService.getDashboard()));
    }
}
