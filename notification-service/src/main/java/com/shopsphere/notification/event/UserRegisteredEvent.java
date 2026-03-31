package com.shopsphere.notification.event;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserRegisteredEvent {
    private String email;
    private String name;
    private String role;
}
