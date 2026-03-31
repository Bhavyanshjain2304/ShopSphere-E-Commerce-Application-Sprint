package com.shopsphere.notification.event;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class OrderPlacedEvent {
    private Long orderId;
    private String userEmail;
    private BigDecimal totalAmount;
    private String paymentMode;
    private String deliveryAddress;
}
