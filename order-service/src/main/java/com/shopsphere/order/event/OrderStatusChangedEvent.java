package com.shopsphere.order.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusChangedEvent {
    private Long orderId;
    private String userEmail;
    private String oldStatus;
    private String newStatus;
}
