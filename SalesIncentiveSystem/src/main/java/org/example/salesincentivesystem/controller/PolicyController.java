package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Policy;
import org.example.salesincentivesystem.repository.PolicyRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/policies")
public class PolicyController {

    private final PolicyRepository policyRepository;

    public PolicyController(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    // Public/Sales: Get all active policies
    @GetMapping
    public List<Policy> getActivePolicies() {
        return policyRepository.findByIsActiveTrue();
    }

    // Admin: Get all (including inactive/drafts)
    @GetMapping("/admin")
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    // Admin: Create or Update Policy
    @PostMapping
    public Policy savePolicy(@RequestBody Policy policy) {
        policy.setLastUpdated(LocalDateTime.now());
        return policyRepository.save(policy);
    }

    // Admin: Delete (Soft or Hard)
    @DeleteMapping("/{id}")
    public void deletePolicy(@PathVariable Long id) {
        policyRepository.deleteById(id);
    }
}
