package com.getmart.dto;


public class ApiResponse {
    private boolean success;
    private String message;

    public ApiResponse() {}

    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public static ApiResponseBuilder builder() { return new ApiResponseBuilder(); }
    public static class ApiResponseBuilder {
        private boolean success;
        public ApiResponseBuilder success(boolean success) { this.success = success; return this; }
        private String message;
        public ApiResponseBuilder message(String message) { this.message = message; return this; }
        public ApiResponse build() { return new ApiResponse(success, message); }
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
