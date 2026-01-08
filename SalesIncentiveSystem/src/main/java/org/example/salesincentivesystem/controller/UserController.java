package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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
                user.setAccountStatus(newStatus);
                userRepository.save(user);
                return ResponseEntity.ok(user);
            }
            return ResponseEntity.badRequest().body("Status is required");
        }).orElse(ResponseEntity.notFound().build());
    }
}
