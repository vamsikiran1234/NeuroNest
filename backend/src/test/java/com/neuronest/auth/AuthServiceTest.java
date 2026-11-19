package com.neuronest.auth;

import com.neuronest.auth.dto.AuthResponse;
import com.neuronest.auth.dto.LoginRequest;
import com.neuronest.auth.dto.RegisterRequest;
import com.neuronest.auth.entity.RefreshToken;
import com.neuronest.auth.entity.Role;
import com.neuronest.auth.entity.RoleName;
import com.neuronest.auth.entity.User;
import com.neuronest.auth.repository.RefreshTokenRepository;
import com.neuronest.auth.repository.RoleRepository;
import com.neuronest.auth.repository.UserRepository;
import com.neuronest.auth.service.AuthService;
import com.neuronest.common.exception.AppException;
import com.neuronest.common.security.JwtService;
import com.neuronest.common.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;

public class AuthServiceTest {

    private InMemoryUserRepository userRepository;
    private InMemoryRoleRepository roleRepository;
    private InMemoryRefreshTokenRepository refreshTokenRepository;
    private FakePasswordEncoder passwordEncoder;
    private FakeAuthenticationManager authenticationManager;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = new InMemoryUserRepository();
        roleRepository = new InMemoryRoleRepository();
        refreshTokenRepository = new InMemoryRefreshTokenRepository();
        passwordEncoder = new FakePasswordEncoder();
        authenticationManager = new FakeAuthenticationManager(userRepository, passwordEncoder);
        jwtService = new JwtService("4c87b8f9e6d3a2b1c0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7", 900000L, 604800000L);

        // Preload default roles
        roleRepository.save(new Role(RoleName.ROLE_USER, "User role"));
        roleRepository.save(new Role(RoleName.ROLE_PARENT_OR_GUARDIAN, "Guardian role"));
        roleRepository.save(new Role(RoleName.ROLE_ADMIN, "Admin role"));

        authService = new AuthService(
                userRepository,
                roleRepository,
                refreshTokenRepository,
                passwordEncoder,
                authenticationManager,
                jwtService
        );
    }

    @Test
    @DisplayName("Should successfully register a new user and generate tokens")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest(
                "alex@neuronest.dev",
                "Password123!",
                "Alex",
                false,
                RoleName.ROLE_USER
        );

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("alex@neuronest.dev", response.getUser().getEmail());
        assertEquals("Alex", response.getUser().getDisplayName());
        assertTrue(response.getUser().getRoles().contains("ROLE_USER"));
        assertTrue(userRepository.existsByEmail("alex@neuronest.dev"));
    }

    @Test
    @DisplayName("Should throw exception when registering with existing email")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest(
                "duplicate@neuronest.dev",
                "Password123!",
                "First Alex",
                false,
                RoleName.ROLE_USER
        );
        authService.register(request);

        RegisterRequest duplicate = new RegisterRequest(
                "duplicate@neuronest.dev",
                "Password123!",
                "Second Alex",
                false,
                RoleName.ROLE_USER
        );

        assertThrows(AppException.class, () -> authService.register(duplicate));
    }

    @Test
    @DisplayName("Should successfully authenticate registered user on login")
    void testLoginSuccess() {
        RegisterRequest registerReq = new RegisterRequest(
                "sarah@neuronest.dev",
                "Password123!",
                "Sarah",
                false,
                RoleName.ROLE_PARENT_OR_GUARDIAN
        );
        authService.register(registerReq);

        LoginRequest loginReq = new LoginRequest("sarah@neuronest.dev", "Password123!");
        AuthResponse loginRes = authService.login(loginReq);

        assertNotNull(loginRes);
        assertNotNull(loginRes.getAccessToken());
        assertNotNull(loginRes.getRefreshToken());
        assertEquals("Sarah", loginRes.getUser().getDisplayName());
        assertTrue(loginRes.getUser().getRoles().contains("ROLE_PARENT_OR_GUARDIAN"));
    }

    // -------------------------------------------------------------------------
    // Deterministic Fast In-Memory Test Doubles (0 Bytecode instrumentation)
    // -------------------------------------------------------------------------
    static class FakePasswordEncoder implements PasswordEncoder {
        @Override
        public String encode(CharSequence rawPassword) {
            return "hashed_" + rawPassword;
        }

        @Override
        public boolean matches(CharSequence rawPassword, String encodedPassword) {
            return ("hashed_" + rawPassword).equals(encodedPassword);
        }
    }

    static class FakeAuthenticationManager implements AuthenticationManager {
        private final InMemoryUserRepository userRepo;
        private final PasswordEncoder encoder;

        FakeAuthenticationManager(InMemoryUserRepository userRepo, PasswordEncoder encoder) {
            this.userRepo = userRepo;
            this.encoder = encoder;
        }

        @Override
        public Authentication authenticate(Authentication authentication) {
            String email = authentication.getName();
            String password = authentication.getCredentials().toString();

            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

            if (!encoder.matches(password, user.getPasswordHash())) {
                throw new BadCredentialsException("Invalid email or password");
            }

            UserPrincipal principal = UserPrincipal.create(user);
            return new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        }
    }

    static class InMemoryUserRepository implements UserRepository {
        private final Map<UUID, User> db = new HashMap<>();

        @Override
        public Optional<User> findByEmail(String email) {
            return db.values().stream()
                    .filter(u -> u.getEmail().equalsIgnoreCase(email))
                    .findFirst();
        }

        @Override
        public boolean existsByEmail(String email) {
            return findByEmail(email).isPresent();
        }

        @Override
        public <S extends User> S save(S entity) {
            if (entity.getId() == null) {
                entity.setId(UUID.randomUUID());
            }
            db.put(entity.getId(), entity);
            return entity;
        }

        @Override
        public Optional<User> findById(UUID uuid) {
            return Optional.ofNullable(db.get(uuid));
        }

        @Override public boolean existsById(UUID uuid) { return db.containsKey(uuid); }
        @Override public List<User> findAll() { return new ArrayList<>(db.values()); }
        @Override public List<User> findAllById(Iterable<UUID> uuids) { return Collections.emptyList(); }
        @Override public long count() { return db.size(); }
        @Override public void deleteById(UUID uuid) { db.remove(uuid); }
        @Override public void delete(User entity) { db.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends User> entities) {}
        @Override public void deleteAll() { db.clear(); }
        @Override public void flush() {}
        @Override public <S extends User> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends User> List<S> saveAllAndFlush(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public void deleteAllInBatch(Iterable<User> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public User getOne(UUID uuid) { return db.get(uuid); }
        @Override public User getById(UUID uuid) { return db.get(uuid); }
        @Override public User getReferenceById(UUID uuid) { return db.get(uuid); }
        @Override public <S extends User> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends User> List<S> findAll(Example<S> example) { return Collections.emptyList(); }
        @Override public <S extends User> List<S> findAll(Example<S> example, Sort sort) { return Collections.emptyList(); }
        @Override public <S extends User> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends User> long count(Example<S> example) { return 0; }
        @Override public <S extends User> boolean exists(Example<S> example) { return false; }
        @Override public <S extends User, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends User> List<S> saveAll(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public List<User> findAll(Sort sort) { return Collections.emptyList(); }
        @Override public Page<User> findAll(Pageable pageable) { return null; }
    }

    static class InMemoryRoleRepository implements RoleRepository {
        private final Map<Long, Role> db = new HashMap<>();
        private long counter = 1;

        @Override
        public Optional<Role> findByName(RoleName name) {
            return db.values().stream().filter(r -> r.getName() == name).findFirst();
        }

        @Override
        public <S extends Role> S save(S entity) {
            if (entity.getId() == null) {
                entity.setId(counter++);
            }
            db.put(entity.getId(), entity);
            return entity;
        }

        @Override public Optional<Role> findById(Long aLong) { return Optional.ofNullable(db.get(aLong)); }
        @Override public boolean existsById(Long aLong) { return db.containsKey(aLong); }
        @Override public List<Role> findAll() { return new ArrayList<>(db.values()); }
        @Override public List<Role> findAllById(Iterable<Long> longs) { return Collections.emptyList(); }
        @Override public long count() { return db.size(); }
        @Override public void deleteById(Long aLong) { db.remove(aLong); }
        @Override public void delete(Role entity) { db.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends Long> longs) {}
        @Override public void deleteAll(Iterable<? extends Role> entities) {}
        @Override public void deleteAll() { db.clear(); }
        @Override public void flush() {}
        @Override public <S extends Role> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends Role> List<S> saveAllAndFlush(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public void deleteAllInBatch(Iterable<Role> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<Long> longs) {}
        @Override public void deleteAllInBatch() {}
        @Override public Role getOne(Long aLong) { return db.get(aLong); }
        @Override public Role getById(Long aLong) { return db.get(aLong); }
        @Override public Role getReferenceById(Long aLong) { return db.get(aLong); }
        @Override public <S extends Role> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends Role> List<S> findAll(Example<S> example) { return Collections.emptyList(); }
        @Override public <S extends Role> List<S> findAll(Example<S> example, Sort sort) { return Collections.emptyList(); }
        @Override public <S extends Role> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends Role> long count(Example<S> example) { return 0; }
        @Override public <S extends Role> boolean exists(Example<S> example) { return false; }
        @Override public <S extends Role, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends Role> List<S> saveAll(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public List<Role> findAll(Sort sort) { return Collections.emptyList(); }
        @Override public Page<Role> findAll(Pageable pageable) { return null; }
    }

    static class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
        private final Map<UUID, RefreshToken> db = new HashMap<>();

        @Override
        public Optional<RefreshToken> findByTokenHash(String tokenHash) {
            return db.values().stream().filter(t -> t.getTokenHash().equals(tokenHash)).findFirst();
        }

        @Override
        public void deleteByUser(User user) {
            db.values().removeIf(t -> t.getUser().getId().equals(user.getId()));
        }

        @Override
        public <S extends RefreshToken> S save(S entity) {
            if (entity.getId() == null) {
                entity.setId(UUID.randomUUID());
            }
            db.put(entity.getId(), entity);
            return entity;
        }

        @Override public Optional<RefreshToken> findById(UUID uuid) { return Optional.ofNullable(db.get(uuid)); }
        @Override public boolean existsById(UUID uuid) { return db.containsKey(uuid); }
        @Override public List<RefreshToken> findAll() { return new ArrayList<>(db.values()); }
        @Override public List<RefreshToken> findAllById(Iterable<UUID> uuids) { return Collections.emptyList(); }
        @Override public long count() { return db.size(); }
        @Override public void deleteById(UUID uuid) { db.remove(uuid); }
        @Override public void delete(RefreshToken entity) { db.remove(entity.getId()); }
        @Override public void deleteAllById(Iterable<? extends UUID> uuids) {}
        @Override public void deleteAll(Iterable<? extends RefreshToken> entities) {}
        @Override public void deleteAll() { db.clear(); }
        @Override public void flush() {}
        @Override public <S extends RefreshToken> S saveAndFlush(S entity) { return save(entity); }
        @Override public <S extends RefreshToken> List<S> saveAllAndFlush(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public void deleteAllInBatch(Iterable<RefreshToken> entities) {}
        @Override public void deleteAllByIdInBatch(Iterable<UUID> uuids) {}
        @Override public void deleteAllInBatch() {}
        @Override public RefreshToken getOne(UUID uuid) { return db.get(uuid); }
        @Override public RefreshToken getById(UUID uuid) { return db.get(uuid); }
        @Override public RefreshToken getReferenceById(UUID uuid) { return db.get(uuid); }
        @Override public <S extends RefreshToken> Optional<S> findOne(Example<S> example) { return Optional.empty(); }
        @Override public <S extends RefreshToken> List<S> findAll(Example<S> example) { return Collections.emptyList(); }
        @Override public <S extends RefreshToken> List<S> findAll(Example<S> example, Sort sort) { return Collections.emptyList(); }
        @Override public <S extends RefreshToken> Page<S> findAll(Example<S> example, Pageable pageable) { return null; }
        @Override public <S extends RefreshToken> long count(Example<S> example) { return 0; }
        @Override public <S extends RefreshToken> boolean exists(Example<S> example) { return false; }
        @Override public <S extends RefreshToken, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) { return null; }
        @Override public <S extends RefreshToken> List<S> saveAll(Iterable<S> entities) { return Collections.emptyList(); }
        @Override public List<RefreshToken> findAll(Sort sort) { return Collections.emptyList(); }
        @Override public Page<RefreshToken> findAll(Pageable pageable) { return null; }
    }
}
