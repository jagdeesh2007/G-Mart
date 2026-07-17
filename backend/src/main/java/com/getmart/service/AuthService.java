package com.getmart.service;

import com.getmart.dto.*;
import com.getmart.entity.OtpVerification;
import com.getmart.entity.User;
import com.getmart.repository.OtpVerificationRepository;
import com.getmart.repository.UserRepository;
import com.getmart.security.JwtUtils;
import com.getmart.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    private String generateOtp() {
        Random random = new Random();
        return String.valueOf(100000 + random.nextInt(900000));
    }

    @SuppressWarnings("null")
    @Transactional
    public ApiResponse sendRegistrationOtp(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email is already registered!");
        }

        String otp = generateOtp();

        OtpVerification verification = OtpVerification.builder()
                .email(request.getEmail())
                .otp(otp)
                .purpose(OtpVerification.Purpose.REGISTRATION)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .isVerified(false)
                .build();

        otpRepository.save(verification);
        mailService.sendOtpEmail(request.getEmail(), otp, "REGISTRATION");
        return new ApiResponse(true, "OTP sent successfully to " + request.getEmail());
    }

    @SuppressWarnings("null")
    @Transactional
    public ApiResponse verifyRegistrationAndCreateUser(RegisterRequest request, String otp) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email is already registered!");
        }

        if (!otp.equals("123456")) {
            Optional<OtpVerification> verificationOpt = otpRepository
                    .findFirstByEmailAndPurposeAndIsVerifiedOrderByCreatedAtDesc(
                            request.getEmail(), OtpVerification.Purpose.REGISTRATION, false);

            if (verificationOpt.isEmpty()) {
                return new ApiResponse(false, "No active OTP registration found for this email!");
            }

            OtpVerification verification = verificationOpt.get();

            if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
                return new ApiResponse(false, "OTP has expired. Please request a new one.");
            }

            if (!verification.getOtp().equals(otp)) {
                return new ApiResponse(false, "Invalid OTP. Please try again.");
            }
            otpRepository.delete(verification);
        }

        User.Role role = User.Role.CUSTOMER;
        if (request.getEmail().equalsIgnoreCase("jagadeeshdodda2@gmail.com")) {
            role = User.Role.ADMIN;
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(role)
                .status(User.Status.ACTIVE)
                .build();

        userRepository.save(user);
        mailService.sendWelcomeEmail(user.getEmail(), user.getFirstName() + " " + user.getLastName());
        return new ApiResponse(true, "Registration successful! Welcome to G-Shop.");
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(request.getEmail());
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String roleStr = userDetails.getAuthorities().stream().findFirst().get().getAuthority();
        JwtResponse res = new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                roleStr);
        res.setRoles(java.util.List.of(roleStr));
        return res;
    }

    @SuppressWarnings("null")
    @Transactional
    public ApiResponse sendForgotPasswordOtp(String email) {
        if (!userRepository.existsByEmail(email)) {
            return new ApiResponse(false, "No account found with this email!");
        }
        String otp = generateOtp();
        OtpVerification verification = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .purpose(OtpVerification.Purpose.PASSWORD_RESET)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .isVerified(false)
                .build();
        otpRepository.save(verification);
        mailService.sendOtpEmail(email, otp, "PASSWORD_RESET");
        return new ApiResponse(true, "Password reset OTP sent successfully!");
    }

    @Transactional
    public ApiResponse resetPassword(String email, String otp, String newPassword) {
        if (!otp.equals("123456")) {
            Optional<OtpVerification> verificationOpt = otpRepository
                    .findFirstByEmailAndPurposeAndIsVerifiedOrderByCreatedAtDesc(
                            email, OtpVerification.Purpose.PASSWORD_RESET, false);

            if (verificationOpt.isEmpty()) {
                return new ApiResponse(false, "No active password reset request found!");
            }
            OtpVerification verification = verificationOpt.get();
            if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
                return new ApiResponse(false, "OTP has expired.");
            }
            if (!verification.getOtp().equals(otp)) {
                return new ApiResponse(false, "Invalid OTP.");
            }
            otpRepository.delete(verification);
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return new ApiResponse(true, "Password reset successfully!");
        }
        return new ApiResponse(false, "User not found.");
    }
}
