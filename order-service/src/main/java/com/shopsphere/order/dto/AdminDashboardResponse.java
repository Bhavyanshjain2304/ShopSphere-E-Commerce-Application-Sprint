package com.shopsphere.order.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AdminDashboardResponse {

    private Long totalOrders;
    private BigDecimal totalRevenue;
    private Long deliveredOrders;
    private Long pendingOrders;
    private Long cancelledOrders;
    private Long todayOrders;

    // Monthly revenue: [{month: "Jan 2025", revenue: 12000}, ...]
    private List<MonthlyRevenue> monthlyRevenue;

    @Data
    @Builder
    public static class MonthlyRevenue {
        private String month;
        private BigDecimal revenue;
    }
}
