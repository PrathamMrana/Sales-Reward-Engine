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

    public PerformanceService(DealRepository dealRepository, UserRepository userRepository) {
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
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
        double totalIncentive = deals.stream().mapToDouble(Deal::getIncentive).sum();
        summary.setTotalIncentiveEarned(totalIncentive);
        double avgDeal = deals.isEmpty() ? 0 : deals.stream().mapToDouble(Deal::getAmount).average().orElse(0);
        summary.setAverageDealValue(avgDeal);

        // Monthly trend - Group by Deal Date (YYYY-MM)
        Map<YearMonth, List<Deal>> byMonth = deals.stream()
                .collect(Collectors.groupingBy(d -> YearMonth.from(d.getDate())));
        List<MonthlyTrend> trends = new ArrayList<>();
        for (Map.Entry<YearMonth, List<Deal>> entry : byMonth.entrySet()) {
            MonthlyTrend mt = new MonthlyTrend();
            mt.setMonth(entry.getKey().toString());
            mt.setDealCount(entry.getValue().size());
            double monthIncentive = entry.getValue().stream().mapToDouble(Deal::getIncentive).sum();
            mt.setIncentiveSum(monthIncentive);
            trends.add(mt);
        }

        // Sort trends by date
        trends.sort((t1, t2) -> t1.getMonth().compareTo(t2.getMonth()));

        summary.setMonthlyTrend(trends);
        return summary;
    }
}
