package org.example.salesincentivesystem.controller;

import java.util.List;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/deals")
@CrossOrigin(origins = "*")
public class DealController {

    private final DealRepository dealRepository;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;
    private final org.example.salesincentivesystem.repository.NotificationRepository notificationRepository;
    private final org.example.salesincentivesystem.service.AuditLogService auditLogService;

    public DealController(DealRepository dealRepository,
            org.example.salesincentivesystem.repository.UserRepository userRepository,
            org.example.salesincentivesystem.repository.NotificationRepository notificationRepository,
            org.example.salesincentivesystem.service.AuditLogService auditLogService) {
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogService = auditLogService;
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

        if (deal.getStatus() == null) {
            deal.setStatus("Draft");
        }

        Deal savedDeal = dealRepository.save(deal);

        // Notify Admins
        String finalUserName = userName; // effective final for stream
        userRepository.findAll().stream()
                .filter(u -> "ADMIN".equals(u.getRole()))
                .forEach(admin -> {
                    org.example.salesincentivesystem.entity.Notification n = new org.example.salesincentivesystem.entity.Notification();
                    n.setUser(admin);
                    n.setTitle("New Deal Submitted");
                    n.setMessage("Sales Exec " + finalUserName + " submitted a deal of ₹" + savedDeal.getAmount());
                    n.setType("ALERT");
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
    public Deal updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> updates) {
        String status = updates.get("status");
        String reason = updates.get("reason");

        return dealRepository.findById(id).map(deal -> {
            String oldStatus = deal.getStatus();
            deal.setStatus(status);
            if (reason != null) {
                deal.setRejectionReason(reason);
            }

            // Audit Log
            String detailMsg = "Deal status changed from " + oldStatus + " to " + status;
            if (reason != null && !reason.isEmpty()) {
                detailMsg += ". Reason: " + reason;
            }

            auditLogService.logAction(
                    null, // Actor unknown without auth context
                    "ADMIN",
                    "UPDATE_STATUS",
                    "DEAL",
                    deal.getId(),
                    detailMsg);

            // Notify Sales Person
            if (deal.getUser() != null) {
                org.example.salesincentivesystem.entity.Notification n = new org.example.salesincentivesystem.entity.Notification();
                n.setUser(deal.getUser());

                String title = "Deal " + status;
                String msg = "Your deal of ₹" + deal.getAmount() + " was " + status;

                if ("Rejected".equals(status) && reason != null && !reason.isEmpty()) {
                    msg += ". Reason: " + reason;
                }

                n.setTitle(title);
                n.setMessage(msg);
                n.setType("INFO");
                n.setTimestamp(java.time.LocalDateTime.now());
                notificationRepository.save(n);
            }

            return dealRepository.save(deal);
        }).orElseThrow(() -> new RuntimeException("Deal not found"));
    }
}
