package com.vsu.patent.scheduler;

import static io.tesler.api.service.session.InternalAuthorizationService.VANILLA;

import com.vsu.patent.helper.CleanDataService;
import io.tesler.model.core.service.InternalAuthorizationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CleanDataScheduler {

	private final InternalAuthorizationServiceImpl internalAuthorizationService;
	
	private final CleanDataService cleanDataService;

	@Scheduled(cron = "${scheduled.cron.clean-data}", zone = "${scheduled.timezone}")
	public void startAuditForcedClosedTask() {
		internalAuthorizationService.loginAs(VANILLA);
		cleanDataService.cleanUnusefulData();
	}
}
