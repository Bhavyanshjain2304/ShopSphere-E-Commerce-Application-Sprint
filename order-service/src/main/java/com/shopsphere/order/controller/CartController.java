package com.shopsphere.order.controller;

import com.shopsphere.order.dto.ApiResponse;
import com.shopsphere.order.dto.CartItemRequest;
import com.shopsphere.order.entity.CartItem;
import com.shopsphere.order.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity<ApiResponse<CartItem>> addToCart(
            @RequestHeader("X-User-Email") String userEmail,
            @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cartService.addToCart(userEmail, request)));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<CartItem>> updateItem(
            @RequestHeader("X-User-Email") String userEmail,
            @PathVariable Long productId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cartService.updateCartItem(userEmail, productId, quantity)));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeItem(
            @RequestHeader("X-User-Email") String userEmail,
            @PathVariable Long productId) {
        cartService.removeFromCart(userEmail, productId);
        return ResponseEntity.ok(ApiResponse.success("Item removed", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItem>>> getCart(
            @RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.ok(ApiResponse.success("Cart fetched", cartService.getCart(userEmail)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @RequestHeader("X-User-Email") String userEmail) {
        cartService.clearCart(userEmail);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
