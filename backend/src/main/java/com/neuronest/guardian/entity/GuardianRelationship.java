package com.neuronest.guardian.entity;

import com.neuronest.auth.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "guardian_relationships", uniqueConstraints = {
        @UniqueConstraint(name = "uq_guardian_dependent", columnNames = {"guardian_id", "dependent_id"})
})
public class GuardianRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guardian_id", nullable = false)
    private User guardian;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dependent_id", nullable = false)
    private User dependent;

    @Column(name = "relationship_type", nullable = false, length = 50)
    private String relationshipType = "PARENT"; // PARENT, GUARDIAN, EDUCATOR

    @Column(nullable = false, length = 50)
    private String status = "APPROVED"; // PENDING, APPROVED, REVOKED

    @Column(name = "can_view_activity_summary", nullable = false)
    private boolean canViewActivitySummary = true;

    @Column(name = "can_manage_goals", nullable = false)
    private boolean canManageGoals = true;

    @Column(name = "can_configure_reminders", nullable = false)
    private boolean canConfigureReminders = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public GuardianRelationship() {}

    public GuardianRelationship(User guardian, User dependent, String relationshipType) {
        this.guardian = guardian;
        this.dependent = dependent;
        this.relationshipType = relationshipType;
        this.status = "APPROVED";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getGuardian() { return guardian; }
    public void setGuardian(User guardian) { this.guardian = guardian; }
    public User getDependent() { return dependent; }
    public void setDependent(User dependent) { this.dependent = dependent; }
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
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
