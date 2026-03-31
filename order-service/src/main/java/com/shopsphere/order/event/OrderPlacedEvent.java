package com.shopsphere.order.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderPlacedEvent {
    private Long orderId;
    private String userEmail;
    private BigDecimal totalAmount;
    private String paymentMode;
    private String deliveryAddress;
    private List<OrderItemEvent> items;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemEvent {
        private Long productId;
        private Integer quantity;
    }
}
