package com.neuronest.auth.dto;

import com.neuronest.auth.entity.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    @NotBlank(message = "Display name is required")
    @Size(min = 2, max = 50, message = "Display name must be between 2 and 50 characters")
    private String displayName;

    private boolean minor = false;

    private RoleName role = RoleName.ROLE_USER;

    public RegisterRequest() {}

    public RegisterRequest(String email, String password, String displayName, boolean minor, RoleName role) {
        this.email = email;
        this.password = password;
        this.displayName = displayName;
        this.minor = minor;
        this.role = role != null ? role : RoleName.ROLE_USER;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public boolean isMinor() { return minor; }
    public void setMinor(boolean minor) { this.minor = minor; }
    public RoleName getRole() { return role; }
    public void setRole(RoleName role) { this.role = role; }
}
