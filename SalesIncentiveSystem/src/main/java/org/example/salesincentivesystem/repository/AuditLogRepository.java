package org.example.salesincentivesystem.repository;

import org.example.salesincentivesystem.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
