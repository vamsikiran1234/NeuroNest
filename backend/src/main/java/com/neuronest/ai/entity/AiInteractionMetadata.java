package com.neuronest.ai.entity;

import com.neuronest.auth.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ai_interaction_metadata")
public class AiInteractionMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType; // SIMPLIFY, BREAKDOWN, RECOMMEND, STORY, ASK

    @Column(name = "model_name", length = 100)
    private String modelName;

    @Column(name = "tokens_used")
    private Integer tokensUsed = 0;

    @Column(name = "latency_ms")
    private Integer latencyMs = 0;

    @Column(nullable = false)
    private boolean success = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public AiInteractionMetadata() {}

    public AiInteractionMetadata(User user, String actionType, String modelName, Integer tokensUsed, Integer latencyMs, boolean success) {
        this.user = user;
        this.actionType = actionType;
        this.modelName = modelName;
        this.tokensUsed = tokensUsed;
        this.latencyMs = latencyMs;
        this.success = success;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    public Integer getTokensUsed() { return tokensUsed; }
    public void setTokensUsed(Integer tokensUsed) { this.tokensUsed = tokensUsed; }
    public Integer getLatencyMs() { return latencyMs; }
    public void setLatencyMs(Integer latencyMs) { this.latencyMs = latencyMs; }
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
