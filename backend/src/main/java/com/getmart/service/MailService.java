package com.getmart.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendOtpEmail(String to, String otp, String purpose) {
        logger.info("Attempting to send OTP email to: {} for purpose: {}", to, purpose);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("jagadeeshdodda2@gmail.com");
            message.setTo(to);
            message.setSubject("G-Shop - OTP Verification");
            message.setText("Your OTP for " + purpose + " is: " + otp + "\n\nPlease do not share this with anyone. It will expire in 5 minutes.");
            mailSender.send(message);
            logger.info("Email sent successfully!");
        } catch (Exception e) {
            logger.error("Failed to send OTP email", e);
        }
    }

    @Async
    public void sendWelcomeEmail(String to, String name) {
        logger.info("Attempting to send welcome email to: {}", to);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("jagadeeshdodda2@gmail.com");
            message.setTo(to);
            message.setSubject("Welcome to G-Shop!");
            message.setText("Hello, " + name + "!\n\nWelcome to G-Shop. We are excited to have you on board!");
            mailSender.send(message);
            logger.info("Welcome email sent successfully!");
        } catch (Exception e) {
            logger.error("Failed to send welcome email", e);
        }
    }
}
