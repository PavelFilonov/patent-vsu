package com.vsu.patent.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum UserEditStep {

	USER_EDIT_PERSONAL("screen/administration/view/usereditpersonal/", "Личные данные", null, null),
	USER_EDIT_ROLES("screen/administration/view/usereditroles/", "Роли", null, null),
	USER_EDIT_MAIN_ROLE("screen/administration/view/usereditmainrole/", "Главная роль", null, null);

	static {
		USER_EDIT_PERSONAL.nextStep = USER_EDIT_ROLES;
		USER_EDIT_ROLES.previousStep = USER_EDIT_PERSONAL;
		USER_EDIT_ROLES.nextStep = USER_EDIT_MAIN_ROLE;
		USER_EDIT_MAIN_ROLE.previousStep = USER_EDIT_ROLES;
	}

	private final String editView;

	@JsonValue
	private final String stepName;

	private UserEditStep previousStep;

	private UserEditStep nextStep;

}
