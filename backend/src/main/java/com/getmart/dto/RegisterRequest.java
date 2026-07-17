package com.getmart.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;

    public RegisterRequest() {}

    public RegisterRequest(String firstName, String lastName, String email, String password, String phone) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }

    public static RegisterRequestBuilder builder() { return new RegisterRequestBuilder(); }
    public static class RegisterRequestBuilder {
        private String firstName;
        public RegisterRequestBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        private String lastName;
        public RegisterRequestBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        private String email;
        public RegisterRequestBuilder email(String email) { this.email = email; return this; }
        private String password;
        public RegisterRequestBuilder password(String password) { this.password = password; return this; }
        private String phone;
        public RegisterRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public RegisterRequest build() { return new RegisterRequest(firstName, lastName, email, password, phone); }
    }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
