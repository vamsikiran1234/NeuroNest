package com.neuronest.guardian.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LinkDependentRequest {

    @NotBlank(message = "Dependent email is required")
    @Email(message = "Valid email is required")
    private String dependentEmail;

    private String relationshipType = "PARENT";

    public LinkDependentRequest() {}

    public String getDependentEmail() { return dependentEmail; }
    public void setDependentEmail(String dependentEmail) { this.dependentEmail = dependentEmail; }
    public String getRelationshipType() { return relationshipType; }
    public void setRelationshipType(String relationshipType) { this.relationshipType = relationshipType; }
}
