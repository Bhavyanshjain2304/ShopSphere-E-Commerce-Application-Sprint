package com.shopsphere.catalog.listener;

import com.shopsphere.catalog.config.RabbitMQConfig;
import com.shopsphere.catalog.event.OrderPlacedEvent;
import com.shopsphere.catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderEventListener {

    private final ProductRepository productRepository;

    @RabbitListener(queues = RabbitMQConfig.ORDER_PLACED_QUEUE)
    @Transactional
    public void handleOrderPlaced(OrderPlacedEvent event) {
        if (event.getItems() == null || event.getItems().isEmpty()) {
            log.warn("ORDER_PLACED event received with no items for orderId: {}", event.getOrderId());
            return;
        }

        log.info("📦 [CATALOG] Reducing stock for orderId: {}", event.getOrderId());
        event.getItems().forEach(item -> {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                int newStock = Math.max(0, product.getStock() - item.getQuantity());
                product.setStock(newStock);
                productRepository.save(product);
                log.info("📦 [CATALOG] Product '{}' stock updated: {} → {}", product.getName(), product.getStock() + item.getQuantity(), newStock);
            });
        });
    }
}
