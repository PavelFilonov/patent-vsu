package com.vsu.patent.service.user;

import com.vsu.patent.dto.UserDTO;
import com.vsu.patent.entity.SmUser;
import com.vsu.patent.entity.SmUserRole;
import com.vsu.patent.repository.DepartmentRepository;
import com.vsu.patent.repository.SmUserRepository;
import com.vsu.patent.repository.SmUserRoleRepository;
import com.vsu.patent.service.enums.SmActionIconSpecifier;
import io.tesler.api.data.dictionary.LOV;
import io.tesler.core.crudma.bc.BusinessComponent;
import io.tesler.core.crudma.impl.VersionAwareResponseService;
import io.tesler.core.dto.multivalue.MultivalueField;
import io.tesler.core.dto.rowmeta.ActionResultDTO;
import io.tesler.core.dto.rowmeta.CreateResult;
import io.tesler.core.dto.rowmeta.PostAction;
import io.tesler.core.service.action.Actions;
import io.tesler.core.service.action.ActionsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import static com.vsu.patent.controller.TeslerRestController.userEdit;
import static com.vsu.patent.entity.enums.Status.*;
import static com.vsu.patent.entity.enums.UserEditStep.USER_EDIT_PERSONAL;
import static com.vsu.patent.repository.SmUserRepository.isAvailableSpecification;
import static com.vsu.patent.repository.SmUserRepository.isNotSystemUserSpecification;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.service.action.ActionAvailableChecker.*;
import static io.tesler.core.service.action.ActionScope.BC;
import static io.tesler.core.service.action.ActionScope.RECORD;
import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;
import static org.springframework.data.jpa.domain.Specification.where;

@Service
public class UserReadService extends VersionAwareResponseService<UserDTO, SmUser> {

	@Autowired
	private SmUserRepository userRepository;

	@Autowired
	private DepartmentRepository departmentRepository;

	@Autowired
	private SmUserRoleRepository userRoleRepository;

	public UserReadService() {
		super(UserDTO.class, SmUser.class, null, UserReadMeta.class);
	}

	@Override
	protected Specification<SmUser> getSpecification(BusinessComponent bc) {
		return where(super.getSpecification(bc))
				.and(isAvailableSpecification())
				.and(isNotSystemUserSpecification());
	}

	@Override
	protected CreateResult<UserDTO> doCreateEntity(SmUser entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<UserDTO> doUpdateEntity(SmUser entity, UserDTO data, BusinessComponent bc) {
		return null;
	}

	@Override
	protected UserDTO entityToDto(BusinessComponent bc, SmUser entity) {
		var dto = super.entityToDto(bc, entity);
		var userRoles = userRoleRepository.findByUser(entity);
		var roles = userRoles.stream()
				.map(SmUserRole::getInternalRoleCd)
				.collect(
						MultivalueField.toMultivalueField(
								LOV::getKey,
								LOV::getKey
						)
				);
		dto.setRoles(roles);
		var mainRole = userRoles.stream()
				.filter(userRole -> TRUE.equals(userRole.getMain()))
				.findFirst()
				.map(SmUserRole::getInternalRoleCd)
				.map(LOV::getKey)
				.orElse(null);
		dto.setMainRole(mainRole);
		return dto;
	}

	@Override
	public Actions<UserDTO> getActions() {
		ActionsBuilder<UserDTO> builder = Actions.builder();
		return builder

				.newAction()
				.scope(BC)
				.available(ALWAYS_TRUE)
				.withoutAutoSaveBefore()
				.withoutIcon()
				.action("create_user", "Добавить")
				.invoker((bc, data) -> {
					var user = new SmUser();
					user.setActive(FALSE);
					var department = departmentRepository.findDefaultDepartment();
					user.setDepartment(department);
					user.setOrigDeptCode(department.getCode());
					userRepository.saveAndFlush(user);
					String url = USER_EDIT_PERSONAL.getEditView() + userEdit + "/" + user.getId();
					return new ActionResultDTO<UserDTO>().setAction(PostAction.drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.PLUS, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID, bc -> {
					var user = userRepository.getById(bc.getIdAsLong());
					return user.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("delete_user", "Удалить")
				.invoker((bc, data) -> {
					var user = userRepository.getById(bc.getIdAsLong());
					userRepository.delete(user);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.DELETE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID, bc -> {
					var user = userRepository.getById(bc.getIdAsLong());
					return user.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("edit_user", "Редактировать")
				.invoker((bc, data) -> {
					var user = userRepository.getById(bc.getIdAsLong());
					String url = user.getEditStep().getEditView() + userEdit + "/" + user.getId();
					return new ActionResultDTO<UserDTO>().setAction(PostAction.drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.EDIT, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID, bc -> {
					var user = userRepository.getById(bc.getIdAsLong());
					return user.getStatus() == ACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("deactivate_user", "Деактивировать")
				.invoker((bc, data) -> {
					var user = userRepository.getById(bc.getIdAsLong());
					user.setStatus(INACTIVE);
					user.setActive(false);
					userRepository.saveAndFlush(user);
					// TODO: roles active false
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CLOSE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID, bc -> {
					var user = userRepository.getById(bc.getIdAsLong());
					return user.getStatus() == INACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("activate_user", "Активировать")
				.invoker((bc, data) -> {
					var user = userRepository.getById(bc.getIdAsLong());
					user.setStatus(ACTIVE);
					user.setActive(true);
					userRepository.saveAndFlush(user);
					// TODO: roles active true
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CHECK, false)
				.add()

				.build();
	}

}
