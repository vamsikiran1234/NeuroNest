package com.neuronest.routines.repository;

import com.neuronest.routines.entity.RoutineStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoutineStepRepository extends JpaRepository<RoutineStep, UUID> {
    List<RoutineStep> findByRoutineIdOrderByStepOrderAsc(UUID routineId);
}
