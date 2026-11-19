package com.neuronest.admin.dto;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public class AdminUserDto {
    private UUID id;
    private String email;
    private String displayName;
    private boolean minor;
    private boolean emailVerified;
    private Set<String> roles;
    private Instant createdAt;

    public AdminUserDto() {}

    public AdminUserDto(UUID id, String email, String displayName, boolean minor, boolean emailVerified, Set<String> roles, Instant createdAt) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
        this.minor = minor;
        this.emailVerified = emailVerified;
        this.roles = roles;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public boolean isMinor() { return minor; }
    public void setMinor(boolean minor) { this.minor = minor; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
