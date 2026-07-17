package com.getmart.dto;

import com.getmart.entity.Order;
import java.util.List;

public class AdminMetricsDto {
    private Double totalSales;
    private Long activeOrders;
    private Long totalOrders;
    private Long totalCustomers;
    private Long totalUsers;
    private Long totalProducts;
    private List<Order> recentOrders;

    public AdminMetricsDto() {}

    public AdminMetricsDto(Double totalSales, Long activeOrders, Long totalOrders, Long totalCustomers, Long totalUsers, Long totalProducts, List<Order> recentOrders) {
        this.totalSales = totalSales;
        this.activeOrders = activeOrders;
        this.totalOrders = totalOrders;
        this.totalCustomers = totalCustomers;
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.recentOrders = recentOrders;
    }

    public static AdminMetricsDtoBuilder builder() { return new AdminMetricsDtoBuilder(); }
    public static class AdminMetricsDtoBuilder {
        private Double totalSales;
        public AdminMetricsDtoBuilder totalSales(Double totalSales) { this.totalSales = totalSales; return this; }
        private Long activeOrders;
        public AdminMetricsDtoBuilder activeOrders(Long activeOrders) { this.activeOrders = activeOrders; return this; }
        private Long totalOrders;
        public AdminMetricsDtoBuilder totalOrders(Long totalOrders) { this.totalOrders = totalOrders; return this; }
        private Long totalCustomers;
        public AdminMetricsDtoBuilder totalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; return this; }
        private Long totalUsers;
        public AdminMetricsDtoBuilder totalUsers(Long totalUsers) { this.totalUsers = totalUsers; return this; }
        private Long totalProducts;
        public AdminMetricsDtoBuilder totalProducts(Long totalProducts) { this.totalProducts = totalProducts; return this; }
        private List<Order> recentOrders;
        public AdminMetricsDtoBuilder recentOrders(List<Order> recentOrders) { this.recentOrders = recentOrders; return this; }
        public AdminMetricsDto build() { return new AdminMetricsDto(totalSales, activeOrders, totalOrders, totalCustomers, totalUsers, totalProducts, recentOrders); }
    }

    public Double getTotalSales() { return totalSales; }
    public void setTotalSales(Double totalSales) { this.totalSales = totalSales; }
    public Long getActiveOrders() { return activeOrders; }
    public void setActiveOrders(Long activeOrders) { this.activeOrders = activeOrders; }
    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }
    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }
    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }
    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }
    public List<Order> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<Order> recentOrders) { this.recentOrders = recentOrders; }
}
