package com.neuronest.accessibility.repository;

import com.neuronest.accessibility.entity.AccessibilitySettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AccessibilitySettingsRepository extends JpaRepository<AccessibilitySettingsEntity, UUID> {
}
