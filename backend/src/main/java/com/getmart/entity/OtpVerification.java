package com.getmart.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications")
public class OtpVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Purpose purpose;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean isVerified;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Purpose {
        REGISTRATION, PASSWORD_RESET
    }

    public OtpVerification() {}

    public OtpVerification(Long id, String email, String otp, Purpose purpose, LocalDateTime expiresAt, boolean isVerified, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.otp = otp;
        this.purpose = purpose;
        this.expiresAt = expiresAt;
        this.isVerified = isVerified;
        this.createdAt = createdAt;
    }

    public static OtpVerificationBuilder builder() { return new OtpVerificationBuilder(); }
    public static class OtpVerificationBuilder {
        private Long id;
        public OtpVerificationBuilder id(Long id) { this.id = id; return this; }
        private String email;
        public OtpVerificationBuilder email(String email) { this.email = email; return this; }
        private String otp;
        public OtpVerificationBuilder otp(String otp) { this.otp = otp; return this; }
        private Purpose purpose;
        public OtpVerificationBuilder purpose(Purpose purpose) { this.purpose = purpose; return this; }
        private LocalDateTime expiresAt;
        public OtpVerificationBuilder expiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; return this; }
        private boolean isVerified;
        public OtpVerificationBuilder isVerified(boolean isVerified) { this.isVerified = isVerified; return this; }
        private LocalDateTime createdAt;
        public OtpVerificationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public OtpVerification build() { return new OtpVerification(id, email, otp, purpose, expiresAt, isVerified, createdAt); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public Purpose getPurpose() { return purpose; }
    public void setPurpose(Purpose purpose) { this.purpose = purpose; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public boolean getIsVerified() { return isVerified; }
    public void setIsVerified(boolean isVerified) { this.isVerified = isVerified; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
