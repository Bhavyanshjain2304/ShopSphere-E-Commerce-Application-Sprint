package com.shopsphere.order.service.impl;

import com.shopsphere.order.client.CatalogClient;
import com.shopsphere.order.dto.CartItemRequest;
import com.shopsphere.order.entity.CartItem;
import com.shopsphere.order.exception.BadRequestException;
import com.shopsphere.order.exception.ResourceNotFoundException;
import com.shopsphere.order.repository.CartItemRepository;
import com.shopsphere.order.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final CatalogClient catalogClient;

    @Override
    public CartItem addToCart(String userEmail, CartItemRequest request) {
        log.info("Verifying product {} exists in catalog", request.getProductId());
        Map<String, Object> product = catalogClient.getProduct(request.getProductId());
        log.info("Product verified: {}", product.get("data") != null ? "found" : "not found");

        log.info("Adding product {} to cart for user {}", request.getProductId(), userEmail);
        return cartItemRepository.findByUserEmailAndProductId(userEmail, request.getProductId())
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + request.getQuantity());
                    return cartItemRepository.save(existing);
                })
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setUserEmail(userEmail);
                    item.setProductId(request.getProductId());
                    item.setProductName(request.getProductName());
                    item.setPrice(request.getPrice());
                    item.setQuantity(request.getQuantity());
                    return cartItemRepository.save(item);
                });
    }

    @Override
    public CartItem updateCartItem(String userEmail, Long productId, Integer quantity) {
        if (quantity < 1) throw new BadRequestException("Quantity must be at least 1");
        CartItem item = cartItemRepository.findByUserEmailAndProductId(userEmail, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Override
    @Transactional
    public void removeFromCart(String userEmail, Long productId) {
        CartItem item = cartItemRepository.findByUserEmailAndProductId(userEmail, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        cartItemRepository.delete(item);
        log.info("Removed product {} from cart for user {}", productId, userEmail);
    }

    @Override
    public List<CartItem> getCart(String userEmail) {
        return cartItemRepository.findByUserEmail(userEmail);
    }

    @Override
    @Transactional
    public void clearCart(String userEmail) {
        cartItemRepository.deleteByUserEmail(userEmail);
    }
}
