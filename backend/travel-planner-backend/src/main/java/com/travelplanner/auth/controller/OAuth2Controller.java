package com.travelplanner.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OAuth2Controller {

    @GetMapping("/oauth2/success")
    public String oauth2Success(Authentication authentication) {

        // Google user email
        String email = authentication.getName();

        return "Google login successful for user: " + email;
    }
}