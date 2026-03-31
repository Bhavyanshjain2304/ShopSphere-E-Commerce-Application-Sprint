package com.shopsphere.notification.listener;

import com.shopsphere.notification.config.RabbitMQConfig;
import com.shopsphere.notification.event.OrderPlacedEvent;
import com.shopsphere.notification.event.OrderStatusChangedEvent;
import com.shopsphere.notification.event.UserRegisteredEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationListener {

    @RabbitListener(queues = RabbitMQConfig.USER_REGISTERED_QUEUE)
    public void handleUserRegistered(UserRegisteredEvent event) {
        log.info("📧 [NOTIFICATION] Welcome email sent to: {} ({})", event.getEmail(), event.getName());
        log.info("📧 [NOTIFICATION] Message: Welcome to ShopSphere, {}! Your account has been created successfully.", event.getName());
    }

    @RabbitListener(queues = RabbitMQConfig.ORDER_PLACED_QUEUE)
    public void handleOrderPlaced(OrderPlacedEvent event) {
        log.info("📦 [NOTIFICATION] Order confirmation sent to: {}", event.getUserEmail());
        log.info("📦 [NOTIFICATION] Order #{} placed successfully. Total: ₹{} via {}",
                event.getOrderId(), event.getTotalAmount(), event.getPaymentMode());
        log.info("📦 [NOTIFICATION] Delivery to: {}", event.getDeliveryAddress());
    }

    @RabbitListener(queues = RabbitMQConfig.ORDER_STATUS_QUEUE)
    public void handleOrderStatusChanged(OrderStatusChangedEvent event) {
        log.info("🔔 [NOTIFICATION] Status update sent to: {}", event.getUserEmail());
        log.info("🔔 [NOTIFICATION] Order #{} status changed: {} → {}",
                event.getOrderId(), event.getOldStatus(), event.getNewStatus());
    }
}
