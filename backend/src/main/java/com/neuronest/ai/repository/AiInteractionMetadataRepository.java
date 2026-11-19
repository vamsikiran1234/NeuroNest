package com.neuronest.ai.repository;

import com.neuronest.ai.entity.AiInteractionMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AiInteractionMetadataRepository extends JpaRepository<AiInteractionMetadata, UUID> {
    List<AiInteractionMetadata> findByUserIdOrderByCreatedAtDesc(UUID userId);
    long countByUserId(UUID userId);
}
