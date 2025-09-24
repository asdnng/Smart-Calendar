package project_MG.MG.config;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import project_MG.MG.domain.jwt.repository.RefreshRepository;

import java.time.LocalDateTime;

@Component
public class ScheduleConfig {

    private final RefreshRepository refreshRepository;

    public ScheduleConfig(RefreshRepository refreshRepository) {
        this.refreshRepository = refreshRepository;
    }

    // refresh token delete every 8 days
    @Scheduled(cron = "0 0 3 * * *")
    public void refreshEntityTtlSchedule() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(8);
        refreshRepository.deleteByCreatedDateBefore(cutoff);
    }
}
