package com.neuronest.guardian.repository;

import com.neuronest.guardian.entity.GuardianRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GuardianRelationshipRepository extends JpaRepository<GuardianRelationship, UUID> {
    List<GuardianRelationship> findByGuardianId(UUID guardianId);
    List<GuardianRelationship> findByDependentId(UUID dependentId);
    Optional<GuardianRelationship> findByGuardianIdAndDependentId(UUID guardianId, UUID dependentId);
    boolean existsByGuardianIdAndDependentId(UUID guardianId, UUID dependentId);
}
