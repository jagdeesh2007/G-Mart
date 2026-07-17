package com.getmart.dto;


public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private java.util.List<String> roles;

    public JwtResponse(String token, Long id, String email, String firstName, String lastName, String role) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public JwtResponse() {}

    public JwtResponse(String token, String type, Long id, String email, String firstName, String lastName, String role) {
        this.token = token;
        this.type = type;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public static JwtResponseBuilder builder() { return new JwtResponseBuilder(); }
    public static class JwtResponseBuilder {
        private String token;
        public JwtResponseBuilder token(String token) { this.token = token; return this; }
        private String type;
        public JwtResponseBuilder type(String type) { this.type = type; return this; }
        private Long id;
        public JwtResponseBuilder id(Long id) { this.id = id; return this; }
        private String email;
        public JwtResponseBuilder email(String email) { this.email = email; return this; }
        private String firstName;
        public JwtResponseBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        private String lastName;
        public JwtResponseBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        private String role;
        public JwtResponseBuilder role(String role) { this.role = role; return this; }
        public JwtResponse build() { return new JwtResponse(token, type, id, email, firstName, lastName, role); }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public java.util.List<String> getRoles() { return roles; }
    public void setRoles(java.util.List<String> roles) { this.roles = roles; }
}
