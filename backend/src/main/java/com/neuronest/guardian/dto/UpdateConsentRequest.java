package com.neuronest.guardian.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateConsentRequest {

    @NotBlank(message = "Consent type is required")
    private String consentType;

    private boolean granted;
    private String notes;

    public UpdateConsentRequest() {}

    public String getConsentType() { return consentType; }
    public void setConsentType(String consentType) { this.consentType = consentType; }
    public boolean isGranted() { return granted; }
    public void setGranted(boolean granted) { this.granted = granted; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
