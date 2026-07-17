package com.getmart.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String addressLine1;

    private String addressLine2;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String zipCode;

    @Column(nullable = false)
    private String country;

    private boolean isDefault;

    public Address() {}

    public Address(Long id, User user, String addressLine1, String addressLine2, String city, String state, String zipCode, String country, boolean isDefault) {
        this.id = id;
        this.user = user;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
        this.isDefault = isDefault;
    }

    public static AddressBuilder builder() { return new AddressBuilder(); }
    public static class AddressBuilder {
        private Long id;
        public AddressBuilder id(Long id) { this.id = id; return this; }
        private User user;
        public AddressBuilder user(User user) { this.user = user; return this; }
        private String addressLine1;
        public AddressBuilder addressLine1(String addressLine1) { this.addressLine1 = addressLine1; return this; }
        private String addressLine2;
        public AddressBuilder addressLine2(String addressLine2) { this.addressLine2 = addressLine2; return this; }
        private String city;
        public AddressBuilder city(String city) { this.city = city; return this; }
        private String state;
        public AddressBuilder state(String state) { this.state = state; return this; }
        private String zipCode;
        public AddressBuilder zipCode(String zipCode) { this.zipCode = zipCode; return this; }
        private String country;
        public AddressBuilder country(String country) { this.country = country; return this; }
        private boolean isDefault;
        public AddressBuilder isDefault(boolean isDefault) { this.isDefault = isDefault; return this; }
        public Address build() { return new Address(id, user, addressLine1, addressLine2, city, state, zipCode, country, isDefault); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }
    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public boolean getIsDefault() { return isDefault; }
    public void setIsDefault(boolean isDefault) { this.isDefault = isDefault; }
}
