package com.neuronest.guardian.dto;

import java.time.Instant;
import java.util.UUID;

public class GuardianRelationshipDto {
    private UUID id;
    private UUID dependentId;
    private String dependentName;
    private String dependentEmail;
    private String relationshipType;
    private String status;
    private boolean canViewActivitySummary;
    private boolean canManageGoals;
    private boolean canConfigureReminders;
    private Instant createdAt;

    public GuardianRelationshipDto() {}

    public GuardianRelationshipDto(
            UUID id,
            UUID dependentId,
            String dependentName,
            String dependentEmail,
            String relationshipType,
            String status,
            boolean canViewActivitySummary,
            boolean canManageGoals,
            boolean canConfigureReminders,
            Instant createdAt
    ) {
        this.id = id;
        this.dependentId = dependentId;
        this.dependentName = dependentName;
        this.dependentEmail = dependentEmail;
        this.relationshipType = relationshipType;
        this.status = status;
        this.canViewActivitySummary = canViewActivitySummary;
        this.canManageGoals = canManageGoals;
        this.canConfigureReminders = canConfigureReminders;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getDependentId() { return dependentId; }
    public void setDependentId(UUID dependentId) { this.dependentId = dependentId; }
    public String getDependentName() { return dependentName; }
    public void setDependentName(String dependentName) { this.dependentName = dependentName; }
    public String getDependentEmail() { return dependentEmail; }
    public void setDependentEmail(String dependentEmail) { this.dependentEmail = dependentEmail; }
    public String getRelationshipType() { return relationshipType; }
    public void setRelationshipType(String relationshipType) { this.relationshipType = relationshipType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isCanViewActivitySummary() { return canViewActivitySummary; }
    public void setCanViewActivitySummary(boolean canViewActivitySummary) { this.canViewActivitySummary = canViewActivitySummary; }
    public boolean isCanManageGoals() { return canManageGoals; }
    public void setCanManageGoals(boolean canManageGoals) { this.canManageGoals = canManageGoals; }
    public boolean isCanConfigureReminders() { return canConfigureReminders; }
    public void setCanConfigureReminders(boolean canConfigureReminders) { this.canConfigureReminders = canConfigureReminders; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
