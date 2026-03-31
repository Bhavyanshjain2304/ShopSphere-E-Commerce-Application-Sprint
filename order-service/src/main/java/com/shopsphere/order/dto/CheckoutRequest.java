package com.shopsphere.order.dto;

import com.shopsphere.order.entity.Order;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    @NotNull(message = "Payment mode is required")
    private Order.PaymentMode paymentMode;
}
