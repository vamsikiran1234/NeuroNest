package com.neuronest.guardian.repository;

import com.neuronest.guardian.entity.ConsentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConsentRecordRepository extends JpaRepository<ConsentRecord, UUID> {
    List<ConsentRecord> findByUserId(UUID userId);
    Optional<ConsentRecord> findByUserIdAndConsentType(UUID userId, String consentType);
}
