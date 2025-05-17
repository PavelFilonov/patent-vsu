package com.vsu.patent.service.util;

import io.tesler.api.service.session.TeslerUserDetails;
import java.security.Principal;
import java.util.Optional;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@UtilityClass
public class CurrentUserService {

	public static String getCurrentUsername() {
		return Optional.of(SecurityContextHolder.getContext())
				.map(SecurityContext::getAuthentication)
				.map(Authentication::getPrincipal)
				.map((principal -> {
					if (principal instanceof UserDetails) {
						return ((UserDetails) principal).getUsername();
					} else if (principal instanceof Principal) {
						return ((Principal) principal).getName();
					} else {
						return principal.toString();
					}
				}))
				.orElse(null);
	}

	public static TeslerUserDetails getCurrentUser() {
		return (TeslerUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}

	public static String getCurrentRole() {
		return getCurrentUser().getUserRole().getKey();
	}

}
