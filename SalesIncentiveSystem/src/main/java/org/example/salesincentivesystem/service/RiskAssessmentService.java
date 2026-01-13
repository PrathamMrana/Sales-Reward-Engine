package org.example.salesincentivesystem.service;

import org.example.salesincentivesystem.entity.Deal;
import org.springframework.stereotype.Service;

@Service
public class RiskAssessmentService {

    public String assessRisk(Deal deal) {
        if (deal.getAmount() > 50000 && deal.getRate() > 15.0) {
            return "HIGH";
        } else if (deal.getAmount() > 50000 || deal.getRate() > 10.0) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }
}
