package com.shopsphere.admin.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusRequest {

    @NotNull(message = "Status is required")
    private String status; // PACKED, SHIPPED, DELIVERED, CANCELLED
}
