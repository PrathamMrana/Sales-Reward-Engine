package org.example.salesincentivesystem.controller;

import org.example.salesincentivesystem.dto.LeaderboardEntry;
import org.example.salesincentivesystem.service.LeaderboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;
    private final org.example.salesincentivesystem.repository.UserRepository userRepository;

    public LeaderboardController(LeaderboardService leaderboardService,
            org.example.salesincentivesystem.repository.UserRepository userRepository) {
        this.leaderboardService = leaderboardService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<LeaderboardEntry> getLeaderboard(
            @RequestParam(defaultValue = "THIS_MONTH") String period,
            @RequestParam(required = false) Long requestorId) {

        if (requestorId == null) {
            return java.util.List.of();
        }

        return userRepository.findById(requestorId)
                .map(user -> {
                    if (user.isAdminTypeGlobal()) {
                        // Global stats for Super Admins
                        return leaderboardService.getLeaderboard(period, null);
                    } else {
                        String orgName = user.getOrganizationName();
                        if (orgName == null || orgName.trim().isEmpty()) {
                            // Non-global users with no organization assigned should see an empty
                            // leaderboard
                            return java.util.List.<LeaderboardEntry>of();
                        }
                        return leaderboardService.getLeaderboard(period, orgName);
                    }
                })
                .orElse(java.util.List.of());
    }
}
