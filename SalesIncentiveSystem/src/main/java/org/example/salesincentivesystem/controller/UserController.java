package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final org.example.salesincentivesystem.service.AuditLogService auditLogService;

    public UserController(UserRepository userRepository,
            org.example.salesincentivesystem.service.AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    // GET - List all users (For Admin)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // PATCH - Update User Status (Activate/Disable)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        return userRepository.findById(id).map(user -> {
            String newStatus = updates.get("status");
            if (newStatus != null) {
                String oldStatus = user.getAccountStatus();
                user.setAccountStatus(newStatus);
                userRepository.save(user);

                // Audit Log
                auditLogService.logAction(
                        null, // Actor unknown without auth context
                        "ADMIN",
                        "UPDATE_STATUS",
                        "USER",
                        user.getId(),
                        "Changed status from " + oldStatus + " to " + newStatus);

                return ResponseEntity.ok(user);
            }
            return ResponseEntity.badRequest().body("Status is required");
        }).orElse(ResponseEntity.notFound().build());
    }
}
