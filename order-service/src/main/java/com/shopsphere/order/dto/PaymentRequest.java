package com.shopsphere.order.dto;

import com.shopsphere.order.entity.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Payment mode is required")
    private Order.PaymentMode paymentMode;
}
