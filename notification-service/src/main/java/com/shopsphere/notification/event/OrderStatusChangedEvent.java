package com.shopsphere.notification.event;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderStatusChangedEvent {
    private Long orderId;
    private String userEmail;
    private String oldStatus;
    private String newStatus;
}
