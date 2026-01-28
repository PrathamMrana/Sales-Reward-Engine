package org.example.salesincentivesystem.config;

import org.example.salesincentivesystem.entity.User;
import org.example.salesincentivesystem.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final org.example.salesincentivesystem.repository.SalesProfileRepository salesProfileRepository;
    private final org.example.salesincentivesystem.repository.UserPreferenceRepository userPreferenceRepository;
    private final org.example.salesincentivesystem.repository.SalesPerformanceRepository salesPerformanceRepository;
    private final org.example.salesincentivesystem.repository.DealRepository dealRepository;

    public DataInitializer(UserRepository userRepository,
            org.example.salesincentivesystem.repository.SalesProfileRepository salesProfileRepository,
            org.example.salesincentivesystem.repository.UserPreferenceRepository userPreferenceRepository,
            org.example.salesincentivesystem.repository.SalesPerformanceRepository salesPerformanceRepository,
            org.example.salesincentivesystem.repository.DealRepository dealRepository) {
        this.userRepository = userRepository;
        this.salesProfileRepository = salesProfileRepository;
        this.userPreferenceRepository = userPreferenceRepository;
        this.salesPerformanceRepository = salesPerformanceRepository;
        this.dealRepository = dealRepository;
    }

    @Override
    public void run(String... args) {
        // Ensure Users Exist
        if (userRepository.count() == 0) {
            System.out.println("SEEDING DEFAULT USERS...");
            userRepository.save(new User("admin@test.com", "admin123", "ADMIN", "Admin User"));
            userRepository.save(new User("sales@test.com", "sales123", "SALES", "Sales Person"));
            System.out.println("USERS SEEDED!");
        }

        // Seed Rich Data if missing
        try {
            User admin = userRepository.findByEmail("admin@test.com").orElse(null);
            User sales = userRepository.findByEmail("sales@test.com").orElse(null);

            // Admin Prefs
            if (admin != null) {
                if (userPreferenceRepository.findAll().stream()
                        .noneMatch(p -> p.getUser().getId().equals(admin.getId()))) {
                    userPreferenceRepository.save(
                            new org.example.salesincentivesystem.entity.UserPreference(admin, "LIGHT", "USD", "EN"));
                    System.out.println("Seeded Admin Prefs");
                }
            }

            // Sales Data
            if (sales != null) {
                if (salesProfileRepository.findAll().stream()
                        .noneMatch(p -> p.getUser().getId().equals(sales.getId()))) {
                    salesProfileRepository.save(new org.example.salesincentivesystem.entity.SalesProfile(sales,
                            "555-0199", "North Region", "EMP-001", java.time.LocalDate.now().minusYears(2)));
                    System.out.println("Seeded Sales Profile");
                }
                if (userPreferenceRepository.findAll().stream()
                        .noneMatch(p -> p.getUser().getId().equals(sales.getId()))) {
                    userPreferenceRepository.save(
                            new org.example.salesincentivesystem.entity.UserPreference(sales, "DARK", "USD", "EN"));
                    System.out.println("Seeded Sales Prefs");
                }
                if (salesPerformanceRepository.findAll().stream()
                        .noneMatch(p -> p.getUser().getId().equals(sales.getId()))) {
                    salesPerformanceRepository.save(new org.example.salesincentivesystem.entity.SalesPerformance(sales,
                            100000.0, 4.5, "Top Seller, Rookie of the Year"));
                    System.out.println("Seeded Sales Performance");
                }
            }

            // Seed Deals
            if (dealRepository.count() == 0 && sales != null) {
                java.time.LocalDate now = java.time.LocalDate.now();

                org.example.salesincentivesystem.entity.Deal d1 = new org.example.salesincentivesystem.entity.Deal();
                d1.setAmount(45000);
                d1.setDate(now.minusDays(5));
                d1.setStatus("Approved");
                d1.setRate(5.0);
                d1.setIncentive(45000 * 0.05);
                d1.setUser(sales);
                dealRepository.save(d1);

                org.example.salesincentivesystem.entity.Deal d2 = new org.example.salesincentivesystem.entity.Deal();
                d2.setAmount(120000);
                d2.setDate(now.minusDays(2));
                d2.setStatus("Approved");
                d2.setRate(10.0);
                d2.setIncentive(120000 * 0.10);
                d2.setUser(sales);
                dealRepository.save(d2);

                org.example.salesincentivesystem.entity.Deal d3 = new org.example.salesincentivesystem.entity.Deal();
                d3.setAmount(20000);
                d3.setDate(now.minusDays(10));
                d3.setStatus("Recommended");
                d3.setRate(5.0);
                d3.setIncentive(20000 * 0.05);
                d3.setUser(sales);
                dealRepository.save(d3);

                // Past Month Deals (for Trends)
                org.example.salesincentivesystem.entity.Deal d4 = new org.example.salesincentivesystem.entity.Deal();
                d4.setAmount(80000);
                d4.setDate(now.minusMonths(1).minusDays(5));
                d4.setStatus("Approved");
                d4.setRate(10.0);
                d4.setIncentive(80000 * 0.10);
                d4.setUser(sales);
                dealRepository.save(d4);

                org.example.salesincentivesystem.entity.Deal d5 = new org.example.salesincentivesystem.entity.Deal();
                d5.setAmount(60000);
                d5.setDate(now.minusMonths(1).minusDays(15));
                d5.setStatus("Approved");
                d5.setRate(5.0);
                d5.setIncentive(60000 * 0.05);
                d5.setUser(sales);
                dealRepository.save(d5);

                System.out.println("Seeded Deals");
            }
            // CLEANUP: Fix Orphan Deals (Deals with null user)
            // This happens with initial seed or manual inserts. Assign to "sales@test.com"
            if (sales != null) {
                java.util.List<org.example.salesincentivesystem.entity.Deal> orphans = dealRepository.findAll().stream()
                        .filter(d -> d.getUser() == null)
                        .collect(java.util.stream.Collectors.toList());

                if (!orphans.isEmpty()) {
                    System.out.println("FIXING ORPHAN DEALS: Found " + orphans.size() + " deals with no user.");
                    orphans.forEach(d -> {
                        d.setUser(sales);
                        dealRepository.save(d);
                    });
                    System.out.println(" Assigned orphaned deals to " + sales.getEmail());
                }
            }

            // CLEANUP: Fox Missing Account Status
            userRepository.findAll().forEach(u -> {
                if (u.getAccountStatus() == null || u.getAccountStatus().isEmpty()) {
                    System.out.println("FIXING USER STATUS: Setting Active for " + u.getEmail());
                    u.setAccountStatus("ACTIVE");
                    userRepository.save(u);
                }
            });

        } catch (Exception e) {
            System.err.println("Error seeding rich data: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
