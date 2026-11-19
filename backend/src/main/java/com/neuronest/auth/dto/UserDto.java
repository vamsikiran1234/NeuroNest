package com.neuronest.auth.dto;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public class UserDto {
    private UUID id;
    private String email;
    private String displayName;
    private String accountStatus;
    private boolean emailVerified;
    private boolean minor;
    private Set<String> roles;
    private Instant createdAt;

    public UserDto() {}

    public UserDto(UUID id, String email, String displayName, String accountStatus, boolean emailVerified, boolean minor, Set<String> roles, Instant createdAt) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
        this.accountStatus = accountStatus;
        this.emailVerified = emailVerified;
        this.minor = minor;
        this.roles = roles;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public boolean isMinor() { return minor; }
    public void setMinor(boolean minor) { this.minor = minor; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
