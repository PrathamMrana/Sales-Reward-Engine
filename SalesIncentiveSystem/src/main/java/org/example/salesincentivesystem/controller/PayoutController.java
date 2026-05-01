package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.DealRepository;
import org.example.salesincentivesystem.entity.Notification;
import org.example.salesincentivesystem.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/payouts")
public class PayoutController {

    private final DealRepository dealRepository;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public PayoutController(DealRepository dealRepository,
            org.example.salesincentivesystem.repository.UserRepository userRepository,
            NotificationRepository notificationRepository) {
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    // GET /payouts?status=PENDING
    @GetMapping
    public List<Deal> getPayouts(
            @RequestParam(required = false, defaultValue = "PENDING") String status,
            @RequestParam(required = false) Long requestorId) {

        List<Deal> deals;
        if (requestorId != null) {
            User requestor = userRepository.findById(requestorId).orElse(null);
            if (requestor == null)
                return java.util.Collections.emptyList();

            boolean isGlobalAdmin = requestor.isAdminTypeGlobal();
            if (isGlobalAdmin) {
                deals = dealRepository.findAll();
            } else if (requestor.getOrganizationName() != null) {
                deals = dealRepository.findByUser_OrganizationName(requestor.getOrganizationName());
            } else {
                return java.util.Collections.emptyList();
            }
        } else {
            deals = dealRepository.findAll();
        }

        return deals.stream()
                .filter(d -> "Approved".equalsIgnoreCase(d.getStatus())) // Only approved deals are payable
                .filter(d -> {
                    String pStatus = d.getPayoutStatus() == null ? "PENDING" : d.getPayoutStatus();
                    return status.equalsIgnoreCase(pStatus);
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/mark-paid")
    public List<Deal> markAsPaid(
            @RequestBody List<Long> dealIds,
            @RequestParam(required = false) Long requestorId) {

        if (dealIds == null || dealIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        List<Deal> deals = dealRepository.findAllById(dealIds);

        // Security Check: Ensure all deals belong to the requestor's org
        if (requestorId != null) {
            User requestor = userRepository.findById(requestorId).orElse(null);
            if (requestor == null)
                throw new RuntimeException("Forbidden");

            if (!requestor.isAdminTypeGlobal()) {
                String orgName = requestor.getOrganizationName();
                boolean allInOrg = deals.stream()
                        .allMatch(d -> d.getUser() != null && orgName.equals(d.getUser().getOrganizationName()));
                if (!allInOrg)
                    throw new RuntimeException("Access denied: Cross-org payout action");
            }
        }

        java.time.LocalDate today = java.time.LocalDate.now();

        deals.forEach(d -> {
            d.setPayoutStatus("PAID");
            d.setPayoutDate(today);

            try {
                if (d.getUser() != null) {
                    Notification n = new Notification(
                        d.getUser(),
                        "SUCCESS",
                        "Payout Processed",
                        "Your incentive payout of ₹" + d.getIncentive() + " for deal '" + d.getDealName() + "' has been processed!"
                    );
                    n.setTimestamp(java.time.LocalDateTime.now());
                    notificationRepository.save(n);
                }
            } catch (Exception ignored) {}
        });

        return dealRepository.saveAll(deals);
    }

    // GET /payouts/summary
    @GetMapping("/summary")
    public Map<String, Object> getPayoutSummary(@RequestParam(required = false) Long requestorId) {
        List<Deal> deals;
        if (requestorId != null) {
            User requestor = userRepository.findById(requestorId).orElse(null);
            if (requestor == null)
                return java.util.Collections.emptyMap();

            if (requestor.isAdminTypeGlobal()) {
                deals = dealRepository.findAll();
            } else if (requestor.getOrganizationName() != null) {
                deals = dealRepository.findByUser_OrganizationName(requestor.getOrganizationName());
            } else {
                return java.util.Collections.emptyMap();
            }
        } else {
            deals = dealRepository.findAll();
        }

        List<Deal> approved = deals.stream()
                .filter(d -> "Approved".equalsIgnoreCase(d.getStatus()))
                .collect(Collectors.toList());

        double totalPending = approved.stream()
                .filter(d -> {
                    String s = d.getPayoutStatus() == null ? "PENDING" : d.getPayoutStatus();
                    return "PENDING".equalsIgnoreCase(s);
                })
                .mapToDouble(Deal::getIncentive)
                .sum();

        double totalPaid = approved.stream()
                .filter(d -> "PAID".equalsIgnoreCase(d.getPayoutStatus()))
                .mapToDouble(Deal::getIncentive)
                .sum();

        long pendingCount = approved.stream()
                .filter(d -> {
                    String s = d.getPayoutStatus() == null ? "PENDING" : d.getPayoutStatus();
                    return "PENDING".equalsIgnoreCase(s);
                }).count();

        return Map.of(
                "totalPending", totalPending,
                "totalPaid", totalPaid,
                "pendingCount", pendingCount,
                "paidCount", approved.stream().filter(d -> "PAID".equalsIgnoreCase(d.getPayoutStatus())).count());
    }
}
