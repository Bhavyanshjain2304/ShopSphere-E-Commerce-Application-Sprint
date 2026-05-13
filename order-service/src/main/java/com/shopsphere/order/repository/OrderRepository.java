package com.shopsphere.order.repository;

import com.shopsphere.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status != 'DRAFT'")
    Long countTotalOrders();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status IN ('PAID', 'PACKED', 'SHIPPED', 'DELIVERED')")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'DELIVERED'")
    Long countDeliveredOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status IN ('CHECKOUT', 'PAID', 'PACKED')")
    Long countPendingOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'CANCELLED'")
    Long countCancelledOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startOfDay AND o.createdAt < :endOfDay")
    Long countTodayOrders(@Param("startOfDay") LocalDateTime startOfDay,
                          @Param("endOfDay") LocalDateTime endOfDay);

    // Monthly revenue for last 6 months: returns [year, month, revenue]
    @Query("SELECT YEAR(o.createdAt), MONTH(o.createdAt), COALESCE(SUM(o.totalAmount), 0) " +
           "FROM Order o " +
           "WHERE o.status IN ('PAID', 'PACKED', 'SHIPPED', 'DELIVERED') " +
           "AND o.createdAt >= :since " +
           "GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) " +
           "ORDER BY YEAR(o.createdAt), MONTH(o.createdAt)")
    List<Object[]> getMonthlyRevenue(@Param("since") LocalDateTime since);

    // Recent orders for dashboard table
    @Query("SELECT o FROM Order o WHERE o.status != 'DRAFT' ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(org.springframework.data.domain.Pageable pageable);
}
