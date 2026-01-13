package org.example.salesincentivesystem.service;

import org.example.salesincentivesystem.dto.PerformanceSummary;
import org.example.salesincentivesystem.dto.PerformanceSummary.MonthlyTrend;
import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.DealRepository;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PerformanceService {

    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final org.example.salesincentivesystem.repository.SalesProfileRepository salesProfileRepository;

    public PerformanceService(DealRepository dealRepository, UserRepository userRepository,
            org.example.salesincentivesystem.repository.SalesProfileRepository salesProfileRepository) {
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
        this.salesProfileRepository = salesProfileRepository;
    }

    public PerformanceSummary getPerformanceSummary(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        // Filter deals: must have user, correct ID, and a valid date
        List<Deal> deals = dealRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId() != null && d.getUser().getId().equals(userId))
                .filter(d -> d.getDate() != null)
                .collect(Collectors.toList());

        PerformanceSummary summary = new PerformanceSummary();
        summary.setUserId(userId);
        summary.setUserName(user.getName());
        summary.setTotalDeals(deals.size());
        long approved = deals.stream().filter(d -> "APPROVED".equalsIgnoreCase(d.getStatus())).count();
        long rejected = deals.stream().filter(d -> "REJECTED".equalsIgnoreCase(d.getStatus())).count();
        summary.setApprovedDeals((int) approved);
        summary.setRejectedDeals((int) rejected);
        summary.setApprovalRate(approved + rejected == 0 ? 0 : (double) approved / (approved + rejected) * 100);
        double totalIncentive = deals.stream()
                .filter(d -> "APPROVED".equalsIgnoreCase(d.getStatus()))
                .mapToDouble(Deal::getIncentive).sum();
        summary.setTotalIncentiveEarned(totalIncentive);
        double avgDeal = deals.isEmpty() ? 0 : deals.stream().mapToDouble(Deal::getAmount).average().orElse(0);
        summary.setAverageDealValue(avgDeal);

        // Monthly trend - Group by Deal Date (YYYY-MM)
        Map<YearMonth, List<Deal>> byMonth = deals.stream()
                .filter(d -> d.getDate() != null)
                .collect(Collectors.groupingBy(d -> YearMonth.from(d.getDate())));

        List<MonthlyTrend> trends = new ArrayList<>();
        if (byMonth != null) {
            for (Map.Entry<YearMonth, List<Deal>> entry : byMonth.entrySet()) {
                if (entry.getKey() == null || entry.getValue() == null)
                    continue;

                MonthlyTrend mt = new MonthlyTrend();
                mt.setMonth(entry.getKey().toString());
                mt.setDealCount(entry.getValue().size());

                double monthIncentive = entry.getValue().stream()
                        .filter(d -> d != null && "APPROVED".equalsIgnoreCase(d.getStatus()))
                        .mapToDouble(Deal::getIncentive)
                        .sum();
                mt.setIncentiveSum(monthIncentive);

                // Average Deal Size Trend (Approved Deals)
                double monthAvgDeal = entry.getValue().stream()
                        .filter(d -> d != null && "APPROVED".equalsIgnoreCase(d.getStatus()))
                        .mapToDouble(Deal::getAmount)
                        .average().orElse(0.0);
                mt.setAverageDealSize(monthAvgDeal);

                trends.add(mt);
            }
        }

        // Sort trends by date
        trends.sort((t1, t2) -> t1.getMonth().compareTo(t2.getMonth()));

        // Calculate Consistency Score (Based on Incentive Stability)
        if (!trends.isEmpty()) {
            double meanIncentive = trends.stream().mapToDouble(MonthlyTrend::getIncentiveSum).average().orElse(0);
            if (meanIncentive > 0) {
                double variance = trends.stream()
                        .mapToDouble(t -> Math.pow(t.getIncentiveSum() - meanIncentive, 2))
                        .average().orElse(0);
                double stdDev = Math.sqrt(variance);
                double cv = (stdDev / meanIncentive) * 100; // Coefficient of Variation
                // Score out of 100. Lower variation = Higher score.
                // CV of 0 = 100. CV of 100+ = 0.
                summary.setConsistencyScore(Math.max(0, 100 - cv));
            } else {
                summary.setConsistencyScore(0);
            }
        }

        // Populate Profile Data
        summary.setEmail(user.getEmail());
        // Simple role capitalization (e.g. ROLE_SALES -> Sales)
        summary.setRole(user.getRole());

        org.example.salesincentivesystem.entity.SalesProfile profile = salesProfileRepository.findByUserId(userId)
                .orElse(null);
        if (profile != null) {
            summary.setEmployeeCode(profile.getEmployeeCode());
            summary.setJoiningDate(profile.getJoiningDate() != null ? profile.getJoiningDate().toString() : "N/A");
        } else {
            summary.setEmployeeCode("N/A");
            summary.setJoiningDate("N/A");
        }

        // Calculate Tier
        // Logic: Bronze < 50k, Silver < 200k, Gold < 500k, Platinum >= 500k
        String tier = "Bronze";
        String nextTier = "Silver";
        double nextThreshold = 50000;

        if (totalIncentive >= 500000) {
            tier = "Platinum";
            nextTier = null;
            nextThreshold = 0;
            summary.setProgressToNextTier(100.0);
        } else if (totalIncentive >= 200000) {
            tier = "Gold";
            nextTier = "Platinum";
            nextThreshold = 500000;
        } else if (totalIncentive >= 50000) {
            tier = "Silver";
            nextTier = "Gold";
            nextThreshold = 200000;
        }

        summary.setCurrentTier(tier);
        summary.setNextTier(nextTier);
        if (nextTier != null) {
            summary.setProgressToNextTier(Math.min((totalIncentive / nextThreshold) * 100, 100));
        }

        // Find Best Month
        if (!trends.isEmpty()) {
            MonthlyTrend best = trends.stream()
                    .max((t1, t2) -> Double.compare(t1.getIncentiveSum(), t2.getIncentiveSum()))
                    .orElse(null);
            if (best != null) {
                summary.setBestMonth(best.getMonth() + " (₹" + String.format("%.0f", best.getIncentiveSum()) + ")");
            }
        }

        summary.setMonthlyTrend(trends);
        return summary;
    }
}
