package org.example.salesincentivesystem.dto;

import java.util.List;

public class PerformanceSummary {
    private Long userId;
    private String userName;
    private int totalDeals;
    private int approvedDeals;
    private int rejectedDeals;
    private double approvalRate; // percentage
    private double totalIncentiveEarned;
    private double averageDealValue;
    private List<MonthlyTrend> monthlyTrend;

    // getters and setters
    public static class MonthlyTrend {
        private String month; // Format: YYYY-MM
        private int dealCount;
        private double incentiveSum;

        // getters and setters
        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public int getDealCount() {
            return dealCount;
        }

        public void setDealCount(int dealCount) {
            this.dealCount = dealCount;
        }

        public double getIncentiveSum() {
            return incentiveSum;
        }

        public void setIncentiveSum(double incentiveSum) {
            this.incentiveSum = incentiveSum;
        }
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getTotalDeals() {
        return totalDeals;
    }

    public void setTotalDeals(int totalDeals) {
        this.totalDeals = totalDeals;
    }

    public int getApprovedDeals() {
        return approvedDeals;
    }

    public void setApprovedDeals(int approvedDeals) {
        this.approvedDeals = approvedDeals;
    }

    public int getRejectedDeals() {
        return rejectedDeals;
    }

    public void setRejectedDeals(int rejectedDeals) {
        this.rejectedDeals = rejectedDeals;
    }

    public double getApprovalRate() {
        return approvalRate;
    }

    public void setApprovalRate(double approvalRate) {
        this.approvalRate = approvalRate;
    }

    public double getTotalIncentiveEarned() {
        return totalIncentiveEarned;
    }

    public void setTotalIncentiveEarned(double totalIncentiveEarned) {
        this.totalIncentiveEarned = totalIncentiveEarned;
    }

    public double getAverageDealValue() {
        return averageDealValue;
    }

    public void setAverageDealValue(double averageDealValue) {
        this.averageDealValue = averageDealValue;
    }

    public List<MonthlyTrend> getMonthlyTrend() {
        return monthlyTrend;
    }

    public void setMonthlyTrend(List<MonthlyTrend> monthlyTrend) {
        this.monthlyTrend = monthlyTrend;
    }
}
