package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Organization;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.OrganizationRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public OnboardingController(UserRepository userRepository, OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }

    @PostMapping("/complete/{userId}")
    public ResponseEntity<?> completeOnboarding(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setOnboardingCompleted(true);
            userRepository.save(user);
            return ResponseEntity.ok("Onboarding marked as complete");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/organization")
    public ResponseEntity<?> saveOrganization(@RequestBody Map<String, Object> orgData) {
        try {
            Long userId = Long.valueOf(orgData.get("userId").toString());
            String name = (String) orgData.get("name");
            String industry = (String) orgData.get("industry");
            String size = (String) orgData.get("companySize"); // Check key matching frontend
            String currency = (String) orgData.get("currency");
            String fiscalYear = (String) orgData.get("fiscalYear");

            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User adminUser = userOpt.get();

            // Check if exists
            Optional<Organization> existing = organizationRepository.findByAdminUserId(userId);
            Organization org;
            if (existing.isPresent()) {
                org = existing.get();
                org.setName(name);
                org.setIndustry(industry);
                org.setCompanySize(size);
                org.setCurrency(currency);
                org.setFiscalYear(fiscalYear);
            } else {
                org = new Organization(name, industry, size, currency, fiscalYear, adminUser);
            }

            organizationRepository.save(org);
            return ResponseEntity.ok(org);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error saving organization: " + e.getMessage());
        }
    }
}
