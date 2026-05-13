package com.shopsphere.order.service;

import com.shopsphere.order.dto.AdminDashboardResponse;
import com.shopsphere.order.dto.CheckoutStartRequest;
import com.shopsphere.order.dto.PaymentRequest;
import com.shopsphere.order.entity.Order;

import java.util.List;
import java.util.Map;

public interface OrderService {
    Order startCheckout(String userEmail, CheckoutStartRequest request);
    Map<String, Object> processPayment(PaymentRequest request);
    Order placeOrder(String userEmail, Long orderId);
    Order getOrder(Long id, String userEmail);
    List<Order> getOrderHistory(String userEmail);
    Order updateOrderStatus(Long id, Order.OrderStatus status);
    List<Order> getAllOrders();
    AdminDashboardResponse getDashboard();
}
