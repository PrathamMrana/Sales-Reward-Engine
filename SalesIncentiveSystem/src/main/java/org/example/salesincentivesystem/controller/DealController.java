package org.example.salesincentivesystem.controller;

import java.util.HashMap;
import java.util.Map;

import org.example.salesincentivesystem.entity.Deal;
import org.example.salesincentivesystem.repository.DealRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/deals")
public class DealController {

    private final DealRepository dealRepository;

    public DealController(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    @PostMapping
    public Map<String, Object> saveDeal(@RequestBody Deal deal) {

        double commission;

        if (deal.getAmount() <= 50000) {
            commission = deal.getAmount() * 0.05;
        } else {
            commission = deal.getAmount() * 0.10;
        }

        deal.setStatus("CREATED");
        dealRepository.save(deal);

        Map<String, Object> response = new HashMap<>();
        response.put("amount", deal.getAmount());
        response.put("commission", commission);

        return response;
    }
}
