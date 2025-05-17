package com.vsu.patent.service.tesler.extension.login;

import com.google.common.io.Files;
import com.vsu.patent.entity.enums.LanguageEnum;
import io.tesler.api.data.dictionary.CoreDictionaries.SystemPref;
import io.tesler.api.data.dictionary.LOV;
import io.tesler.api.system.SystemSettings;
import io.tesler.core.dto.LoggedUser;
import io.tesler.core.dto.data.view.ScreenResponsibility;
import io.tesler.core.metahotreload.conf.properties.MetaConfigurationProperties;
import io.tesler.core.service.ScreenResponsibilityService;
import io.tesler.core.service.UIService;
import io.tesler.core.service.impl.UserRoleService;
import io.tesler.core.util.session.SessionService;
import io.tesler.core.util.session.impl.LoginServiceImpl;
import io.tesler.model.core.entity.User;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Primary;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@Primary
public class LoginServiceImplExtension extends LoginServiceImpl {

	private final SessionService sessionService;

	private final UserRoleService userRoleService;

	private final SystemSettings systemSettings;

	private final UIService uiService;

	private final ScreenResponsibilityService screenResponsibilityService;

	private final MetaConfigurationProperties metaConfigurationProperties;

	private final ApplicationContext applicationContext;

	private final MetaConfigurationProperties config;

	private static final String defaultLang = "en";

	public LoginServiceImplExtension(SessionService sessionService,
			UserRoleService userRoleService, SystemSettings systemSettings,
			UIService uiService,
			ScreenResponsibilityService screenResponsibilityService,
			MetaConfigurationProperties metaConfigurationProperties, SessionService sessionService1,
			UserRoleService userRoleService1, SystemSettings systemSettings1, UIService uiService1,
			ScreenResponsibilityService screenResponsibilityService1,
			MetaConfigurationProperties metaConfigurationProperties1, ApplicationContext applicationContext,
			MetaConfigurationProperties config) {
		super(
				sessionService,
				userRoleService,
				systemSettings,
				uiService,
				screenResponsibilityService,
				metaConfigurationProperties
		);
		this.sessionService = sessionService1;
		this.userRoleService = userRoleService1;
		this.systemSettings = systemSettings1;
		this.uiService = uiService1;
		this.screenResponsibilityService = screenResponsibilityService1;
		this.metaConfigurationProperties = metaConfigurationProperties1;
		this.applicationContext = applicationContext;
		this.config = config;
	}

	@Override
	public LoggedUser getLoggedUser(String role) {

		sessionService.setSessionUserInternalRole(role);

		User user = sessionService.getSessionUser();
		LOV activeUserRole = sessionService.getSessionUserRole();

		return LoggedUser.builder()
				.sessionId(sessionService.getSessionId())
				.user(user)
				.activeRole(activeUserRole.getKey())
				.roles(userRoleService.getUserRoles(user))
				// TODO: Remove screens from response in 3.0 in favor of separate ScreenController endpoint
				.screens(getScreens(user, activeUserRole, LocaleContextHolder.getLocale().getLanguage()))
				.userSettings(uiService.getUserSettings())
				.featureSettings(this.getFeatureSettings())
				.systemUrl(systemSettings.getValue(SystemPref.SYSTEM_URL))
				.language(LocaleContextHolder.getLocale().getLanguage())
				.timezone(LocaleContextHolder.getTimeZone().getID())
				.devPanelEnabled(metaConfigurationProperties.isDevPanelEnabled())
				.build();
	}

	@SneakyThrows
	private List<ScreenResponsibility> getScreens(User user, LOV userRole, String lang) {
		List<ScreenResponsibility> screens = screenResponsibilityService.getScreens(user, userRole);
		screens.forEach(screenResponsibility ->
				screenResponsibility.getMeta().getViews().forEach(viewDTO ->
						viewDTO.getWidgets()
								.forEach(widgetDTO -> widgetDTO.setDescription(getWidgetDescription(
										widgetDTO.getName(), lang, getMultilingualMapResources()
								)))));
		return screens;
	}

	@SneakyThrows
	private Map<String, Map<LanguageEnum, Resource>> getMultilingualMapResources() {
		Resource[] resources = applicationContext.getResources(config.getDirectory() + "/**/*.widget.*.md");
		Map<String, Map<LanguageEnum, Resource>> multilingualResources = new HashMap<>();
		Arrays.stream(resources).forEach(resource -> {
			String name = Files.getNameWithoutExtension(Objects.requireNonNull(resource.getFilename()));
			String dotWidget = ".widget";
			String widgetName = getWidgetName(name, dotWidget);
			String widgetLang = getWidgetLang(name, dotWidget);
			multilingualResources.putIfAbsent(widgetName, new HashMap<>());
			multilingualResources.get(widgetName).put(LanguageEnum.getByName(widgetLang), resource);
		});
		return multilingualResources;
	}

	private String getWidgetName(String name, String dotWidget) {
		return name.substring(0, name.indexOf(dotWidget));
	}

	private String getWidgetLang(String name, String dotWidget) {
		return name.substring(name.indexOf(dotWidget) + dotWidget.length() + 1);
	}

	@SneakyThrows
	private String getWidgetDescription(String widgetName, String lang,
			@NonNull Map<String, Map<LanguageEnum, Resource>> multilingualResources) {
		if (widgetName != null && !Objects.equals(widgetName, "") && multilingualResources.containsKey(widgetName)) {
			Map<LanguageEnum, Resource> languageResourceMap = multilingualResources.get(widgetName);
			Resource resource = lang != null
					? getResourceByLang(languageResourceMap, lang)
					: getResourceByLang(languageResourceMap, defaultLang);
			return resource != null ? IOUtils.toString(resource.getInputStream(), StandardCharsets.UTF_8) : null;
		}
		return null;
	}

	private Resource getResourceByLang(@NonNull Map<LanguageEnum, Resource> languageResourceMap, @NonNull String lang) {
		return languageResourceMap.getOrDefault(
				LanguageEnum.getByName(lang),
				languageResourceMap.getOrDefault(LanguageEnum.getByName(defaultLang), null)
		);
	}

}
