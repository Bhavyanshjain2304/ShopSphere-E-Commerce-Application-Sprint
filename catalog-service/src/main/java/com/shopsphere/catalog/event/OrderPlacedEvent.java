package com.shopsphere.catalog.event;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
public class OrderPlacedEvent {
    private Long orderId;
    private String userEmail;
    private BigDecimal totalAmount;
    private String paymentMode;
    private String deliveryAddress;
    private List<OrderItemEvent> items;

    @Data
    @NoArgsConstructor
    public static class OrderItemEvent {
        private Long productId;
        private Integer quantity;
    }
}
