package com.vsu.patent.service.util;

import static com.vsu.patent.service.util.CurrentUserService.getCurrentRole;

import io.tesler.core.service.action.ActionAvailableChecker;
import java.util.List;
import lombok.experimental.UtilityClass;

@UtilityClass
public class PermissionHelper {

	private static final List<String> EMPLOYEE_PERMISSION_ROLES = List.of("Администратор", "Сотрудник");
	
	public static final String AUTHOR_ROLE = "Автор";

	public static final ActionAvailableChecker EMPLOYEE_PERMISSION = bc -> 
			EMPLOYEE_PERMISSION_ROLES.contains(getCurrentRole());
	
	public static boolean IS_EMPLOYEE_PERMISSION() {
		return EMPLOYEE_PERMISSION_ROLES.contains(getCurrentRole());
	}

	public static boolean IS_AUTHOR() {
		return AUTHOR_ROLE.equalsIgnoreCase(getCurrentRole());
	}

}
