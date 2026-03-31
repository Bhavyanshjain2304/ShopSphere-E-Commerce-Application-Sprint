package com.shopsphere.auth.publisher;

import com.shopsphere.auth.config.RabbitMQConfig;
import com.shopsphere.auth.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishUserRegistered(UserRegisteredEvent event) {
        log.info("Publishing USER_REGISTERED event for: {}", event.getEmail());
        rabbitTemplate.convertAndSend(RabbitMQConfig.AUTH_EXCHANGE, RabbitMQConfig.USER_REGISTERED_KEY, event);
    }
}
