package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.example.salesincentivesystem.entity.Notification;
import org.example.salesincentivesystem.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deals")
public class DealController {

    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public DealController(DealRepository dealRepository, UserRepository userRepository, NotificationRepository notificationRepository) {
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    // ✅ POST - Create a new deal
    @PostMapping
    public ResponseEntity<Deal> createDeal(@RequestBody Map<String, Object> dealData) {
        try {
            Deal deal = new Deal();
            deal.setDealName((String) dealData.get("dealName"));
            deal.setClientName((String) dealData.get("clientName"));
            deal.setAmount(Double.valueOf(dealData.get("amount").toString()));
            // Default Status
            deal.setStatus("Submitted");
            deal.setDate(java.time.LocalDate.now());

            // Use provided organization name (Institution Name)
            String orgName = (String) dealData.get("organizationName");
            deal.setOrganizationName(orgName != null ? orgName : "N/A");

            // Handle User Association
            if (dealData.get("user") != null) {
                Map<String, Object> userMap = (Map<String, Object>) dealData.get("user");
                Long userId = Long.valueOf(userMap.get("id").toString());
                userRepository.findById(userId).ifPresent(user -> {
                    deal.setUser(user);
                    // Only fallback to user org if no organizationName was provided in payload
                    if (deal.getOrganizationName() == null || "N/A".equals(deal.getOrganizationName())) {
                        if (user.getOrganizationName() != null) {
                            deal.setOrganizationName(user.getOrganizationName());
                        }
                    }
                });
            }

            Deal savedDeal = dealRepository.save(deal);
            return ResponseEntity.ok(savedDeal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ✅ GET - fetch deal history (Enhanced for Data Isolation)
    @GetMapping
    public List<Deal> getAllDeals(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long requestorId) {

        // 1. Resolve Security Context
        org.example.salesincentivesystem.entity.User requestor = null;
        if (requestorId != null) {
            requestor = userRepository.findById(requestorId).orElse(null);
        }

        if (requestor == null) {
            return java.util.Collections.emptyList();
        }

        String role = requestor.getRole();
        String orgName = requestor.getOrganizationName();

        // 2. Scenario: Fetching Specific User's Deals
        if (userId != null && requestorId != null) {
            // Check Permissions: Global Admin OR Same Org OR Self
            boolean isSelf = requestorId.equals(userId);
            boolean isGlobalAdmin = "ADMIN".equals(role) && requestor.isAdminTypeGlobal();

            org.example.salesincentivesystem.entity.User targetUser = userRepository.findById(userId).orElse(null);
            boolean isSameOrg = targetUser != null && orgName != null
                    && orgName.equals(targetUser.getOrganizationName());

            if (isSelf || isGlobalAdmin || isSameOrg) {
                return dealRepository.findAll().stream()
                        .filter(d -> d.getUser() != null && d.getUser().getId().equals(userId))
                        .collect(java.util.stream.Collectors.toList());
            } else {
                return java.util.Collections.emptyList();
            }
        }

        // 3. Scenario: Dashboard/Leaderboard (Fetch all accessible deals)

        // 3a. Global Admin -> All Deals
        if ("ADMIN".equals(role) && requestor.isAdminTypeGlobal()) {
            return dealRepository.findAll();
        }

        // 3b. Org Admin OR Sales Rep -> Org Deals
        if (orgName != null) {
            return dealRepository.findByUser_OrganizationName(orgName);
        } else {
            // Fallback for users with no org: only their own deals
            final Long finalRequestorId = requestorId;
            return dealRepository.findAll().stream()
                    .filter(d -> d.getUser() != null && d.getUser().getId().equals(finalRequestorId))
                    .collect(java.util.stream.Collectors.toList());
        }
    }

    // ✅ PATCH - update status (Approve/Reject)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Deal> updateDealStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate,
            @RequestParam(required = false) Long requestorId) {

        return dealRepository.findById(id).map(deal -> {
            // Permission Check: Requestor must be Global Admin OR same Org Admin
            if (requestorId != null) {
                org.example.salesincentivesystem.entity.User requestor = userRepository.findById(requestorId)
                        .orElse(null);
                if (requestor == null)
                    return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).<Deal>build();

                boolean isGlobalAdmin = "ADMIN".equals(requestor.getRole()) && requestor.isAdminTypeGlobal();
                boolean isSameOrgAdmin = "ADMIN".equals(requestor.getRole()) &&
                        requestor.getOrganizationName() != null &&
                        deal.getUser() != null &&
                        requestor.getOrganizationName().equals(deal.getUser().getOrganizationName());

                if (!isGlobalAdmin && !isSameOrgAdmin) {
                    return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).<Deal>build();
                }
            }

            String oldStatus = deal.getStatus();
            String newStatus = statusUpdate.get("status");
            deal.setStatus(newStatus);

            // Handle Rejection Reason
            if (statusUpdate.containsKey("reason")) {
                deal.setRejectionReason(statusUpdate.get("reason"));
            }

            // Handle Admin Comment
            if (statusUpdate.containsKey("comment")) {
                deal.setAdminComment(statusUpdate.get("comment"));
            }

            // If approved, set actual close date & timestamps
            if ("Approved".equalsIgnoreCase(newStatus)) {
                deal.setActualCloseDate(java.time.LocalDate.now());
                deal.setApprovedAt(java.time.LocalDateTime.now());
                // Calculate Incentive using the deal's specific rate (Inherited from Policy)
                if (deal.getAmount() > 0) {
                    double rate = deal.getRate() > 0 ? deal.getRate() : 5.0;
                    deal.setIncentive(deal.getAmount() * (rate / 100.0));
                }
            }

            Deal savedDeal = dealRepository.save(deal);

            try {
                if ("IN_PROGRESS".equalsIgnoreCase(newStatus) && !"IN_PROGRESS".equalsIgnoreCase(oldStatus)) {
                    notifyAdmins(savedDeal, "Deal Started", "Sales executive " + (savedDeal.getUser() != null ? savedDeal.getUser().getName() : "Unknown") + " has started working on deal: " + savedDeal.getDealName(), "INFO");
                } else if (("Pending".equalsIgnoreCase(newStatus) || "SUBMITTED".equalsIgnoreCase(newStatus)) && !newStatus.equalsIgnoreCase(oldStatus)) {
                    notifyAdmins(savedDeal, "Deal Submitted", "Sales executive " + (savedDeal.getUser() != null ? savedDeal.getUser().getName() : "Unknown") + " has submitted deal: " + savedDeal.getDealName() + " for review.", "SUCCESS");
                }
            } catch (Exception ignored) {}

            return ResponseEntity.ok(savedDeal);
        }).orElse(ResponseEntity.notFound().build());
    }

    private void notifyAdmins(Deal deal, String title, String message, String type) {
        userRepository.findAll().stream()
                .filter(u -> "ADMIN".equals(u.getRole()))
                .filter(u -> u.isAdminTypeGlobal() || (u.getOrganizationName() != null && deal.getUser() != null && u.getOrganizationName().equals(deal.getUser().getOrganizationName())))
                .forEach(admin -> {
                    Notification n = new Notification(admin, type, title, message);
                    n.setTimestamp(java.time.LocalDateTime.now());
                    notificationRepository.save(n);
                });
    }
}
