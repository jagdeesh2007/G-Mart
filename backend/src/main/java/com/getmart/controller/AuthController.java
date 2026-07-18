package com.getmart.controller;

import com.getmart.dto.*;
import com.getmart.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/send-otp")
    public ResponseEntity<ApiResponse> sendRegistrationOtp(@Valid @RequestBody RegisterRequest request) {
        ApiResponse response = authService.sendRegistrationOtp(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/register/verify")
    public ResponseEntity<ApiResponse> verifyAndRegister(
            @Valid @RequestBody RegisterRequest request, 
            @RequestParam String otp) {
        ApiResponse response = authService.verifyRegistrationAndCreateUser(request, otp);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        try {
            JwtResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid email or password!"));
        }
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<ApiResponse> sendForgotPasswordOtp(@RequestParam String email) {
        ApiResponse response = authService.sendForgotPasswordOtp(email);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestParam String email, 
            @RequestParam String otp, 
            @RequestParam String newPassword) {
        ApiResponse response = authService.resetPassword(email, otp, newPassword);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
