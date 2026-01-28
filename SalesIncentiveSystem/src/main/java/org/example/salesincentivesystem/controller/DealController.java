package org.example.salesincentivesystem.controller;

import java.util.List;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/deals")
public class DealController {

    private final DealRepository dealRepository;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;
    private final org.example.salesincentivesystem.repository.NotificationRepository notificationRepository;
    private final org.example.salesincentivesystem.service.AuditLogService auditLogService;
    private final org.example.salesincentivesystem.service.RiskAssessmentService riskAssessmentService;
    private final org.example.salesincentivesystem.service.RuleEvaluatorService ruleEvaluatorService;

    public DealController(DealRepository dealRepository,
            org.example.salesincentivesystem.repository.UserRepository userRepository,
            org.example.salesincentivesystem.repository.NotificationRepository notificationRepository,
            org.example.salesincentivesystem.service.AuditLogService auditLogService,
            org.example.salesincentivesystem.service.RiskAssessmentService riskAssessmentService,
            org.example.salesincentivesystem.service.RuleEvaluatorService ruleEvaluatorService) {
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogService = auditLogService;
        this.riskAssessmentService = riskAssessmentService;
        this.ruleEvaluatorService = ruleEvaluatorService;
    }

    // ✅ POST - create deal
    @PostMapping
    public Deal saveDeal(@RequestBody Deal deal) {
        String userName = "Unknown";

        // Look up User if passed in body
        if (deal.getUser() != null && deal.getUser().getId() != null) {
            org.example.salesincentivesystem.entity.User u = userRepository.findById(deal.getUser().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "User with ID " + deal.getUser().getId() + " not found. Please log out and log in again."));
            deal.setUser(u);
            userName = u.getName();
        } else {
            throw new RuntimeException("User ID is required to save a deal.");
        }

        if (deal.getAmount() <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        if (deal.getDate() == null) {
            deal.setDate(java.time.LocalDate.now());
        }

        // Set specific timestamp for sorting
        if (deal.getCreatedAt() == null) {
            deal.setCreatedAt(java.time.LocalDateTime.now());
        }

        // Only calculate automatically if values are missing (e.g. manual API call)
        // If frontend (Calculator) sent rate/incentive, respect it.
        // primitives default to 0.0, not null
        if (deal.getRate() == 0.0 || deal.getIncentive() == 0.0) {
            if (deal.getAmount() <= 50000) {
                deal.setRate(5.0);
                deal.setIncentive(deal.getAmount() * 0.05);
            } else {
                deal.setRate(10.0);
                deal.setIncentive(deal.getAmount() * 0.10);
            }
        }

        // Calculate Risk Level
        if (deal.getRiskLevel() == null) {
            deal.setRiskLevel(riskAssessmentService.assessRisk(deal));
        }

        if (deal.getStatus() == null) {
            deal.setStatus("Draft");
        }

        Deal savedDeal = dealRepository.save(deal);

        // Evaluate Rules
        ruleEvaluatorService.evaluate(savedDeal);

        // Notify Admins
        String finalUserName = userName; // effective final for stream
        userRepository.findAll().stream()
                .filter(u -> "ADMIN".equals(u.getRole()))
                .forEach(admin -> {
                    org.example.salesincentivesystem.entity.Notification n = new org.example.salesincentivesystem.entity.Notification();
                    n.setUser(admin);
                    n.setTitle("New Deal Submitted (" + savedDeal.getRiskLevel() + " Risk)");
                    n.setMessage("Sales Exec " + finalUserName + " submitted a deal of ₹" + savedDeal.getAmount());
                    n.setType("INFO"); // Changed to INFO to avoid confusion with Alerts
                    n.setTimestamp(java.time.LocalDateTime.now());
                    notificationRepository.save(n);
                });

        return savedDeal;
    }

    // ✅ GET - fetch deal history
    @GetMapping
    public List<Deal> getAllDeals(@org.springframework.web.bind.annotation.RequestParam(required = false) Long userId) {
        if (userId == null) {
            // ADMIN VIEW: Return ALL deals
            return dealRepository.findAll();
        }
        return dealRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(userId))
                .collect(java.util.stream.Collectors.toList());
    }

    // ✅ PATCH - update status (Approve/Reject)
    @PatchMapping("/{id}/status")
    public org.springframework.http.ResponseEntity<?> updateStatus(@PathVariable Long id,
            @RequestBody java.util.Map<String, String> updates) {
        try {
            String status = updates.get("status");
            String reason = updates.get("reason");
            String comment = updates.get("comment"); // Admin comment

            Deal deal = dealRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Deal not found"));

            String oldStatus = deal.getStatus();
            deal.setStatus(status);

            // Handle comments based on workflow type
            if ("IN_PROGRESS".equalsIgnoreCase(status) || "Submitted".equalsIgnoreCase(status)
                    || "Pending".equalsIgnoreCase(status)) {
                // Sales Executive Action: Append to Notes
                if (comment != null && !comment.isEmpty()) {
                    String existingNotes = deal.getDealNotes() != null ? deal.getDealNotes() : "";
                    String newNote = java.time.LocalDateTime.now()
                            .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) + " - " + comment;
                    deal.setDealNotes(existingNotes.isEmpty() ? newNote : existingNotes + "\n\n" + newNote);
                }
            } else {
                // Admin Action: Set Admin Comment / Rejection Reason
                if (reason != null) {
                    deal.setRejectionReason(reason);
                }
                if (comment != null) {
                    deal.setAdminComment(comment);
                }
            }

            // PRD Workflow: Capture approval metadata
            if ("Approved".equalsIgnoreCase(status)) {
                deal.setApprovedAt(java.time.LocalDateTime.now());
                deal.setApprovedBy(1L); // Placeholder for Admin ID
                deal.setActualCloseDate(java.time.LocalDate.now());
            }

            // Audit Log
            try {
                String detailMsg = "Deal status changed from " + oldStatus + " to " + status;
                if (reason != null && !reason.isEmpty()) {
                    detailMsg += ". Rejection Reason: " + reason;
                }
                if (comment != null && !comment.isEmpty()) {
                    detailMsg += ". Admin Comment: " + comment;
                }

                auditLogService.logAction(
                        null, // Actor unknown without auth context
                        "ADMIN",
                        "UPDATE_STATUS",
                        "DEAL",
                        deal.getId(),
                        String.format("Status of deal '%s' changed from %s to %s. %s",
                                deal.getDealName() != null ? deal.getDealName() : "Unnamed",
                                oldStatus, status, detailMsg));
            } catch (Exception ignored) {
            }

            // Notify Sales Person
            try {
                if (deal.getUser() != null) {
                    org.example.salesincentivesystem.entity.Notification n = new org.example.salesincentivesystem.entity.Notification();
                    n.setUser(deal.getUser());

                    String title = "Deal " + status;
                    String msg = "Your deal of ₹" + deal.getAmount() + " was " + status;

                    if ("Rejected".equals(status) && reason != null && !reason.isEmpty()) {
                        msg += ". Reason: " + reason;
                    } else if (comment != null && !comment.isEmpty()) {
                        msg += ". Admin Comment: " + comment;
                    }

                    n.setTitle(title);
                    n.setMessage(msg);
                    n.setType("INFO");
                    n.setTimestamp(java.time.LocalDateTime.now());
                    notificationRepository.save(n);
                }
            } catch (Exception ignored) {
            }

            // Notify Admins if status is IN_PROGRESS, Submitted, or Pending
            if ("IN_PROGRESS".equals(status) || "Submitted".equalsIgnoreCase(status)
                    || "Pending".equalsIgnoreCase(status)) {
                try {
                    String actorName = deal.getUser() != null ? deal.getUser().getName() : "Sales Executive";
                    userRepository.findAll().stream()
                            .filter(u -> "ADMIN".equals(u.getRole()))
                            .forEach(admin -> {
                                org.example.salesincentivesystem.entity.Notification nAd = new org.example.salesincentivesystem.entity.Notification();
                                nAd.setUser(admin);
                                nAd.setTitle("Deal Update: " + status);
                                nAd.setMessage(
                                        actorName + " updated deal '"
                                                + (deal.getDealName() != null ? deal.getDealName()
                                                        : deal.getOrganizationName())
                                                + "' to " + status + (comment != null ? ": " + comment : ""));
                                nAd.setType("INFO");
                                nAd.setTimestamp(java.time.LocalDateTime.now());
                                notificationRepository.save(nAd);
                            });
                } catch (Exception ignored) {
                }
            }

            Deal savedDeal = dealRepository.save(deal);
            return org.springframework.http.ResponseEntity.ok(savedDeal);

        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity
                    .status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating status: " + e.getMessage());
        }
    }

    // ✅ POST - Bulk Approve Low Risk
    @PostMapping("/approve-low-risk")
    public List<Deal> approveLowRiskDeals() {
        List<Deal> pendingDeals = dealRepository.findAll().stream()
                .filter(d -> "Pending".equalsIgnoreCase(d.getStatus()) && "LOW".equalsIgnoreCase(d.getRiskLevel()))
                .collect(java.util.stream.Collectors.toList());

        for (Deal deal : pendingDeals) {
            deal.setStatus("Approved");
            deal.setAdminComment("Auto-approved based on Low Risk level");
            dealRepository.save(deal);

            // Log & Notify (Simplified loop reuse)
            auditLogService.logAction(
                    null,
                    "ADMIN",
                    "BULK_APPROVE",
                    "DEAL",
                    deal.getId(),
                    "Bulk approved low risk deal");
        }

        return pendingDeals;
    }
}
