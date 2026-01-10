package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.entity.Notification;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.NotificationRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final org.example.salesincentivesystem.service.AuditLogService auditLogService;

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository,
            org.example.salesincentivesystem.service.AuditLogService auditLogService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public List<Notification> getUserNotifications(@RequestParam Long userId) {
        System.out.println("DEBUG: Fetching notifications for userId: " + userId);
        List<Notification> results = notificationRepository.findByUser_IdOrderByTimestampDesc(userId);
        System.out.println("DEBUG: Found " + results.size() + " notifications for user " + userId);
        return results;
    }

    @PostMapping
    public Notification createNotification(@RequestBody NotificationRequest request) {
        User user = userRepository.findById(request.userId).orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = new Notification(user, request.type, request.title, request.message);
        return notificationRepository.save(notification);
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @PostMapping("/broadcast")
    public void broadcastNotification(@RequestBody BroadcastRequest request) {
        if ("USER".equals(request.targetRole) && request.targetUserId != null) {
            // Target specific user
            User targetUser = userRepository.findById(request.targetUserId)
                    .orElseThrow(() -> new RuntimeException("Target user not found"));

            String notifType = request.type != null && !request.type.isEmpty() ? request.type : "ANNOUNCEMENT";
            String finalTitle = request.title.startsWith("ADMIN: ") ? request.title : "ADMIN: " + request.title;

            Notification n = new Notification(targetUser, notifType, finalTitle, request.message);
            notificationRepository.save(n);

            // Audit Log
            auditLogService.logAction(
                    null,
                    "ADMIN",
                    "BROADCAST",
                    "NOTIFICATION",
                    n.getId(),
                    "Sent to User: " + targetUser.getEmail() + " | Title: " + finalTitle);
        } else {
            // Target Group (ALL or Role)
            List<User> targetUsers;
            if ("ALL".equals(request.targetRole)) {
                targetUsers = userRepository.findAll();
            } else {
                targetUsers = userRepository.findAll().stream()
                        .filter(u -> request.targetRole.equals(u.getRole()))
                        .collect(java.util.stream.Collectors.toList());
            }

            String notifType = request.type != null && !request.type.isEmpty() ? request.type : "ANNOUNCEMENT";

            targetUsers.forEach(u -> {
                String finalTitle = request.title.startsWith("ADMIN: ") ? request.title : "ADMIN: " + request.title;
                Notification n = new Notification(u, notifType, finalTitle, request.message);
                notificationRepository.save(n);
            });

            // Audit Log for Bulk
            auditLogService.logAction(
                    null,
                    "ADMIN",
                    "BROADCAST",
                    "NOTIFICATION",
                    0L,
                    "Sent to Role: " + request.targetRole + " | Count: " + targetUsers.size() + " | Title: "
                            + request.title);
        }
    }

    public static class BroadcastRequest {
        public String targetRole; // ALL, SALES, ADMIN, USER
        public Long targetUserId; // Optional: Used if targetRole is USER
        public String type; // ANNOUNCEMENT, POLICY_UPDATE, etc.
        public String title;
        public String message;
    }

    // DTO for request
    public static class NotificationRequest {
        public Long userId;
        public String type;
        public String title;
        public String message;
    }
}
