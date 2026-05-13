package com.shopsphere.order.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userEmail;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;

    private String deliveryAddress;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    /**
     * Human-readable order code generated on creation.
     * Format: ORD-XXXXXX (6 uppercase alphanumeric chars derived from timestamp + id)
     */
    @Column(unique = true)
    private String orderCode;

    public enum OrderStatus {
        DRAFT, CHECKOUT, PAID, PACKED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, FAILED
    }

    public enum PaymentMode {
        UPI, CARD, COD
    }
}
