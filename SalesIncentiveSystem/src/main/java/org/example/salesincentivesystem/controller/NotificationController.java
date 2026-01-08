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

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
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

    // DTO for request
    public static class NotificationRequest {
        public Long userId;
        public String type;
        public String title;
        public String message;
    }
}
