package com.neuronest.routines.repository;

import com.neuronest.routines.entity.UserTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface UserTaskRepository extends JpaRepository<UserTask, UUID> {
    List<UserTask> findByUserIdOrderByCompletedAscDisplayOrderAscCreatedAtDesc(UUID userId);
    List<UserTask> findByUserIdAndDueDateOrderByCompletedAscDisplayOrderAsc(UUID userId, LocalDate dueDate);
    long countByUserIdAndCompletedTrue(UUID userId);
}
