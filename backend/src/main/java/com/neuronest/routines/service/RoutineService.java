package com.neuronest.routines.service;

import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.common.exception.AppException;
import com.neuronest.routines.dto.*;
import com.neuronest.routines.entity.*;
import com.neuronest.routines.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoutineService {

    private final RoutineRepository routineRepository;
    private final RoutineStepRepository routineStepRepository;
    private final UserTaskRepository userTaskRepository;
    private final UserRepository userRepository;

    public RoutineService(
            RoutineRepository routineRepository,
            RoutineStepRepository routineStepRepository,
            UserTaskRepository userTaskRepository,
            UserRepository userRepository
    ) {
        this.routineRepository = routineRepository;
        this.routineStepRepository = routineStepRepository;
        this.userTaskRepository = userTaskRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<RoutineDto> getRoutines(UUID userId) {
        List<Routine> routines = routineRepository.findByUserIdOrderByDisplayOrderAscCreatedAtAsc(userId);

        if (routines.isEmpty()) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                seedStarterRoutines(user);
                routines = routineRepository.findByUserIdOrderByDisplayOrderAscCreatedAtAsc(userId);
            }
        }

        return routines.stream().map(this::mapToRoutineDto).collect(Collectors.toList());
    }

    @Transactional
    public RoutineDto createRoutine(UUID userId, CreateRoutineRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        Routine routine = new Routine(
                user,
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getIconName(),
                request.getColorCode()
        );
        routine.setRecurring(request.getRecurring());

        if (request.getSteps() != null && !request.getSteps().isEmpty()) {
            int order = 0;
            for (CreateRoutineRequest.CreateStepItem item : request.getSteps()) {
                RoutineStep step = new RoutineStep(routine, item.getTitle(), item.getDetail(), item.getEstimatedMinutes(), order++);
                routine.getSteps().add(step);
            }
        }

        Routine saved = routineRepository.save(routine);
        return mapToRoutineDto(saved);
    }

    @Transactional
    public RoutineStepDto toggleStep(UUID userId, UUID stepId) {
        RoutineStep step = routineStepRepository.findById(stepId)
                .orElseThrow(() -> new AppException("Routine step not found", HttpStatus.NOT_FOUND));

        if (!step.getRoutine().getUser().getId().equals(userId)) {
            throw new AppException("Unauthorized step access", HttpStatus.FORBIDDEN);
        }

        step.setCompleted(!step.isCompleted());
        RoutineStep updated = routineStepRepository.save(step);
        return mapToStepDto(updated);
    }

    @Transactional
    public RoutineDto resetRoutineSteps(UUID userId, UUID routineId) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new AppException("Routine not found", HttpStatus.NOT_FOUND));

        if (!routine.getUser().getId().equals(userId)) {
            throw new AppException("Unauthorized routine access", HttpStatus.FORBIDDEN);
        }

        for (RoutineStep step : routine.getSteps()) {
            step.setCompleted(false);
        }
        Routine saved = routineRepository.save(routine);
        return mapToRoutineDto(saved);
    }

    @Transactional
    public void deleteRoutine(UUID userId, UUID routineId) {
        Routine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new AppException("Routine not found", HttpStatus.NOT_FOUND));

        if (!routine.getUser().getId().equals(userId)) {
            throw new AppException("Unauthorized routine access", HttpStatus.FORBIDDEN);
        }

        routineRepository.delete(routine);
    }

    @Transactional
    public List<UserTaskDto> getTasks(UUID userId, LocalDate date) {
        List<UserTask> tasks = date != null
                ? userTaskRepository.findByUserIdAndDueDateOrderByCompletedAscDisplayOrderAsc(userId, date)
                : userTaskRepository.findByUserIdOrderByCompletedAscDisplayOrderAscCreatedAtDesc(userId);

        if (tasks.isEmpty() && (date == null || date.equals(LocalDate.now()))) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                seedStarterTasks(user);
                tasks = userTaskRepository.findByUserIdOrderByCompletedAscDisplayOrderAscCreatedAtDesc(userId);
            }
        }

        return tasks.stream().map(this::mapToTaskDto).collect(Collectors.toList());
    }

    @Transactional
    public UserTaskDto createTask(UUID userId, CreateTaskRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        UserTask task = new UserTask(
                user,
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getPriority(),
                request.getDueDate() != null ? request.getDueDate() : LocalDate.now()
        );
        task.setScheduledTime(request.getScheduledTime());

        UserTask saved = userTaskRepository.save(task);
        return mapToTaskDto(saved);
    }

    @Transactional
    public UserTaskDto toggleTask(UUID userId, UUID taskId) {
        UserTask task = userTaskRepository.findById(taskId)
                .orElseThrow(() -> new AppException("Task not found", HttpStatus.NOT_FOUND));

        if (!task.getUser().getId().equals(userId)) {
            throw new AppException("Unauthorized task access", HttpStatus.FORBIDDEN);
        }

        boolean willBeCompleted = !task.isCompleted();
        task.setCompleted(willBeCompleted);
        task.setCompletedAt(willBeCompleted ? Instant.now() : null);

        UserTask updated = userTaskRepository.save(task);
        return mapToTaskDto(updated);
    }

    @Transactional
    public void deleteTask(UUID userId, UUID taskId) {
        UserTask task = userTaskRepository.findById(taskId)
                .orElseThrow(() -> new AppException("Task not found", HttpStatus.NOT_FOUND));

        if (!task.getUser().getId().equals(userId)) {
            throw new AppException("Unauthorized task access", HttpStatus.FORBIDDEN);
        }

        userTaskRepository.delete(task);
    }

    private void seedStarterRoutines(User user) {
        Routine morning = new Routine(user, "Calm Morning Flow", "Gentle steps to greet the day peacefully", "MORNING", "Sun", "sage");
        morning.setDisplayOrder(1);
        morning.getSteps().add(new RoutineStep(morning, "Drink a warm glass of water", "Hydrate and take three calm breaths", 2, 0));
        morning.getSteps().add(new RoutineStep(morning, "Open blinds for natural light", "Notice the morning sky and birds", 3, 1));
        morning.getSteps().add(new RoutineStep(morning, "Nutritious breakfast", "Enjoy food without screen rush", 15, 2));
        routineRepository.save(morning);

        Routine evening = new Routine(user, "Sensory Evening Unwind", "Quiet down auditory and visual stimulations", "EVENING", "Moon", "lavender");
        evening.setDisplayOrder(2);
        evening.getSteps().add(new RoutineStep(evening, "Dim bright lights", "Switch to warm side lamps", 2, 0));
        evening.getSteps().add(new RoutineStep(evening, "Pack tomorrow's bag", "Place essentials by the front door", 5, 1));
        evening.getSteps().add(new RoutineStep(evening, "Quiet reading or calming sounds", "Rest mind before sleep", 15, 2));
        routineRepository.save(evening);
    }

    private void seedStarterTasks(User user) {
        LocalDate today = LocalDate.now();
        userTaskRepository.save(new UserTask(user, "Explore 1 Learning Corner Story", "Read about honeybees or Jupiter at your own pace", "STUDY", "LOW", today));
        userTaskRepository.save(new UserTask(user, "Play 1 round of Memory Garden", "Relaxing card pairs in the garden", "DAILY", "LOW", today));
        userTaskRepository.save(new UserTask(user, "Check in with My Comfort settings", "Adjust font, line spacing, or color tint to feel comfortable", "PERSONAL", "LOW", today));
    }

    private RoutineDto mapToRoutineDto(Routine r) {
        List<RoutineStepDto> stepDtos = r.getSteps().stream()
                .map(this::mapToStepDto)
                .collect(Collectors.toList());

        return new RoutineDto(
                r.getId(),
                r.getTitle(),
                r.getDescription(),
                r.getCategory(),
                r.getIconName(),
                r.getColorCode(),
                r.getRecurring(),
                r.getDisplayOrder(),
                stepDtos,
                r.getCreatedAt()
        );
    }

    private RoutineStepDto mapToStepDto(RoutineStep s) {
        return new RoutineStepDto(
                s.getId(),
                s.getTitle(),
                s.getDetail(),
                s.getEstimatedMinutes(),
                s.getStepOrder(),
                s.isCompleted()
        );
    }

    private UserTaskDto mapToTaskDto(UserTask t) {
        return new UserTaskDto(
                t.getId(),
                t.getTitle(),
                t.getDescription(),
                t.getCategory(),
                t.getPriority(),
                t.isCompleted(),
                t.getDueDate(),
                t.getScheduledTime(),
                t.getDisplayOrder(),
                t.getCreatedAt(),
                t.getCompletedAt()
        );
    }
}
