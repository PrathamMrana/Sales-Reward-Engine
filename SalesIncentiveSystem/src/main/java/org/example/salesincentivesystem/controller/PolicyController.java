package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.IncentivePolicy;
import org.example.salesincentivesystem.repository.IncentivePolicyRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policy")
@CrossOrigin(origins = "*") // Allow Frontend
public class PolicyController {

    private final IncentivePolicyRepository policyRepository;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;
    private final org.example.salesincentivesystem.repository.NotificationRepository notificationRepository;

    public PolicyController(IncentivePolicyRepository policyRepository,
                            org.example.salesincentivesystem.repository.UserRepository userRepository,
                            org.example.salesincentivesystem.repository.NotificationRepository notificationRepository) {
        this.policyRepository = policyRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    // ✅ GET - Fetch all policies
    @GetMapping
    public List<IncentivePolicy> getPolicies() {
        return policyRepository.findAllByOrderByDisplayOrderAsc();
    }

    // ✅ POST - Create/Update Policy (Admin Only)
    @PostMapping
    public IncentivePolicy savePolicy(@RequestBody IncentivePolicy policy) {
        // Simple security: In real app, check if User is Admin
        if (policy.getDisplayOrder() == null) {
            policy.setDisplayOrder(0);
        }
        IncentivePolicy savedPolicy = policyRepository.save(policy);

        // Notify All Sales Users
        userRepository.findAll().stream()
            .filter(u -> "SALES".equals(u.getRole()))
            .forEach(user -> {
                org.example.salesincentivesystem.entity.Notification n = new org.example.salesincentivesystem.entity.Notification();
                n.setUser(user);
                n.setTitle("New Policy Update");
                n.setMessage("A new incentive policy '" + savedPolicy.getTitle() + "' has been added/updated.");
                n.setType("ANNOUNCEMENT");
                n.setTimestamp(java.time.LocalDateTime.now());
                n.setRead(false);
                notificationRepository.save(n);
            });

        return savedPolicy;
    }

    // ✅ DELETE - Remove Policy (Admin Only)
    @DeleteMapping("/{id}")
    public void deletePolicy(@PathVariable Long id) {
        policyRepository.deleteById(id);
    }
}
