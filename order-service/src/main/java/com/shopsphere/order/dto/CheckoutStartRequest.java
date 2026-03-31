package com.shopsphere.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckoutStartRequest {

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    private String deliveryMode; // STANDARD, EXPRESS
}
