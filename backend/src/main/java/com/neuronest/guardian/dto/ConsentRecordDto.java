package com.neuronest.guardian.dto;

import java.time.Instant;
import java.util.UUID;

public class ConsentRecordDto {
    private UUID id;
    private String consentType;
    private boolean granted;
    private String notes;
    private Instant createdAt;

    public ConsentRecordDto() {}

    public ConsentRecordDto(UUID id, String consentType, boolean granted, String notes, Instant createdAt) {
        this.id = id;
        this.consentType = consentType;
        this.granted = granted;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getConsentType() { return consentType; }
    public void setConsentType(String consentType) { this.consentType = consentType; }
    public boolean isGranted() { return granted; }
    public void setGranted(boolean granted) { this.granted = granted; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
