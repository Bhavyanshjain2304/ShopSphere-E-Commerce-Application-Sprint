package com.shopsphere.order.service;

import com.shopsphere.order.dto.CartItemRequest;
import com.shopsphere.order.entity.CartItem;

import java.util.List;

public interface CartService {
    CartItem addToCart(String userEmail, CartItemRequest request);
    CartItem updateCartItem(String userEmail, Long productId, Integer quantity);
    void removeFromCart(String userEmail, Long productId);
    List<CartItem> getCart(String userEmail);
    void clearCart(String userEmail);
}
