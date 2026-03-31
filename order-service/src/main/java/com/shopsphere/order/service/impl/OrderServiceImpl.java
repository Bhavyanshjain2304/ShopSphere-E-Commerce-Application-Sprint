package com.shopsphere.order.service.impl;

import com.shopsphere.order.dto.CheckoutStartRequest;
import com.shopsphere.order.dto.PaymentRequest;
import com.shopsphere.order.entity.CartItem;
import com.shopsphere.order.entity.Order;
import com.shopsphere.order.entity.OrderItem;
import com.shopsphere.order.event.OrderPlacedEvent;
import com.shopsphere.order.event.OrderStatusChangedEvent;
import com.shopsphere.order.exception.BadRequestException;
import com.shopsphere.order.exception.ResourceNotFoundException;
import com.shopsphere.order.publisher.OrderEventPublisher;
import com.shopsphere.order.repository.CartItemRepository;
import com.shopsphere.order.repository.OrderRepository;
import com.shopsphere.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderEventPublisher eventPublisher;

    @Override
    @Transactional
    public Order startCheckout(String userEmail, CheckoutStartRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserEmail(userEmail);
        if (cartItems.isEmpty()) throw new BadRequestException("Cart is empty");

        List<OrderItem> orderItems = cartItems.stream().map(cart -> {
            OrderItem item = new OrderItem();
            item.setProductId(cart.getProductId());
            item.setProductName(cart.getProductName());
            item.setPrice(cart.getPrice());
            item.setQuantity(cart.getQuantity());
            item.setSubtotal(cart.getPrice().multiply(BigDecimal.valueOf(cart.getQuantity())));
            return item;
        }).collect(Collectors.toList());

        BigDecimal total = orderItems.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setUserEmail(userEmail);
        order.setItems(orderItems);
        order.setTotalAmount(total);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setStatus(Order.OrderStatus.CHECKOUT);

        Order saved = orderRepository.save(order);
        log.info("Checkout started for user {}, orderId: {}", userEmail, saved.getId());
        return saved;
    }

    @Override
    public Map<String, Object> processPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getStatus() != Order.OrderStatus.CHECKOUT) {
            throw new BadRequestException("Order is not in checkout state");
        }

        log.info("Processing mock payment for order {} via {}", request.getOrderId(), request.getPaymentMode());
        order.setPaymentMode(request.getPaymentMode());
        order.setStatus(Order.OrderStatus.PAID);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Payment successful");
        result.put("orderId", order.getId());
        result.put("paymentMode", request.getPaymentMode());
        result.put("amount", order.getTotalAmount());
        return result;
    }

    @Override
    @Transactional
    public Order placeOrder(String userEmail, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUserEmail().equals(userEmail)) {
            throw new BadRequestException("Access denied");
        }
        if (order.getStatus() != Order.OrderStatus.PAID) {
            throw new BadRequestException("Payment not completed");
        }

        cartItemRepository.deleteByUserEmail(userEmail);
        order.setUpdatedAt(LocalDateTime.now());
        Order saved = orderRepository.save(order);

        // Fetch items explicitly to avoid lazy loading issue
        Order orderWithItems = orderRepository.findById(saved.getId())
                .orElse(saved);

        // Publish ORDER_PLACED event
        List<OrderPlacedEvent.OrderItemEvent> itemEvents = orderWithItems.getItems().stream()
                .map(i -> new OrderPlacedEvent.OrderItemEvent(i.getProductId(), i.getQuantity()))
                .collect(Collectors.toList());

        log.info("Publishing ORDER_PLACED with {} items", itemEvents.size());

        eventPublisher.publishOrderPlaced(new OrderPlacedEvent(
                saved.getId(),
                saved.getUserEmail(),
                saved.getTotalAmount(),
                saved.getPaymentMode() != null ? saved.getPaymentMode().name() : "N/A",
                saved.getDeliveryAddress(),
                itemEvents
        ));

        log.info("Order {} placed for user {}", orderId, userEmail);
        return saved;
    }

    @Override
    public Order getOrder(Long id, String userEmail) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        if (!order.getUserEmail().equals(userEmail)) {
            throw new BadRequestException("Access denied");
        }
        return order;
    }

    @Override
    public List<Order> getOrderHistory(String userEmail) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }

    @Override
    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        String oldStatus = order.getStatus().name();
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        Order saved = orderRepository.save(order);

        // Publish ORDER_STATUS_CHANGED event
        eventPublisher.publishOrderStatusChanged(new OrderStatusChangedEvent(
                saved.getId(),
                saved.getUserEmail(),
                oldStatus,
                status.name()
        ));

        log.info("Order {} status updated to {}", id, status);
        return saved;
    }

    @Override
    public Map<String, Object> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalOrders", orderRepository.countTotalOrders());
        dashboard.put("totalRevenue", orderRepository.calculateTotalRevenue());
        return dashboard;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
