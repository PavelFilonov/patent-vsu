package com.vsu.patent.controller;

import com.vsu.patent.dto.UserDTO;
import com.vsu.patent.entity.SmUser;
import com.vsu.patent.entity.SmUserRole;
import com.vsu.patent.repository.DepartmentRepository;
import com.vsu.patent.repository.SmUserRepository;
import com.vsu.patent.repository.SmUserRoleRepository;
import io.tesler.api.data.dictionary.LOV;
import io.tesler.api.service.session.InternalAuthorizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.repository.SmUserRepository.checkUniqueLoginSpecification;
import static com.vsu.patent.service.util.PermissionHelper.AUTHOR_ROLE;
import static io.tesler.api.service.session.InternalAuthorizationService.VANILLA;
import static java.lang.Boolean.FALSE;

@RestController
@RequiredArgsConstructor
public class CustomUserController {
	
	private final SmUserRepository userRepository;
	
	private final SmUserRoleRepository userRoleRepository;
	
	private final DepartmentRepository departmentRepository;

	private final InternalAuthorizationService internalAuthorizationService;
	
	@PostMapping(path = "/api/v1/users")
	public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO requestDto) {
		internalAuthorizationService.loginAs(VANILLA);
		Specification<SmUser> spec = checkUniqueLoginSpecification(null, requestDto.getLogin());
		if (!userRepository.findAll(spec).isEmpty()) {
			return ResponseEntity.badRequest().build();
		}
		var user = new SmUser();
		user.setActive(FALSE);
		var department = departmentRepository.findDefaultDepartment();
		user.setDepartment(department);
		user.setOrigDeptCode(department.getCode());
		user.setStatus(ACTIVE);
		user.setLogin(requestDto.getLogin());
		user.setFirstName(requestDto.getFirstName());
		user.setLastName(requestDto.getLastName());
		user.setPatronymic(requestDto.getPatronymic());
		user.setPassword("{noop}" + requestDto.getPassword());
		user.setActive(true);
		var authorRoleLov = new LOV(AUTHOR_ROLE);
		user.setInternalRole(authorRoleLov);
		userRepository.saveAndFlush(user);
		var userRole = new SmUserRole();
		userRole.setUser(user);
		userRole.setInternalRoleCd(authorRoleLov);
		userRole.setActive(true);
		userRole.setMain(true);
		userRoleRepository.saveAndFlush(userRole);
		var responseDto = new UserDTO(user);
		return ResponseEntity.ok(responseDto);
	}

}
