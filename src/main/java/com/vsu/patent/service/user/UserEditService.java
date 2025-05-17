package com.vsu.patent.service.user;

import static com.vsu.patent.controller.TeslerRestController.userEdit;
import static com.vsu.patent.dto.UserDTO_.firstName;
import static com.vsu.patent.dto.UserDTO_.lastName;
import static com.vsu.patent.dto.UserDTO_.login;
import static com.vsu.patent.dto.UserDTO_.mainRole;
import static com.vsu.patent.dto.UserDTO_.password;
import static com.vsu.patent.dto.UserDTO_.patronymic;
import static com.vsu.patent.dto.UserDTO_.roles;
import static com.vsu.patent.entity.enums.Dictionary.INTERNAL_ROLE;
import static com.vsu.patent.entity.enums.UserEditStep.USER_EDIT_MAIN_ROLE;
import static com.vsu.patent.repository.SmUserRepository.checkUniqueLoginSpecification;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.MessageType.INFO;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.dto.rowmeta.PostAction.showMessage;
import static io.tesler.core.dto.rowmeta.PreActionType.CONFIRMATION;
import static io.tesler.core.service.action.ActionAvailableChecker.ALWAYS_TRUE;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.RECORD;
import static java.lang.Boolean.TRUE;
import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static org.springframework.util.StringUtils.hasText;

import com.vsu.patent.dto.UserDTO;
import com.vsu.patent.entity.SmUser;
import com.vsu.patent.entity.SmUserRole;
import com.vsu.patent.entity.SmUserRole_;
import com.vsu.patent.entity.enums.Status;
import com.vsu.patent.repository.CustomDictionaryItemRepository;
import com.vsu.patent.repository.SmUserRepository;
import com.vsu.patent.repository.SmUserRoleRepository;
import com.vsu.patent.service.tesler.extension.mapper.TeslerMapperUtil;
import io.tesler.api.data.dictionary.LOV;
import io.tesler.core.crudma.bc.BusinessComponent;
import io.tesler.core.crudma.impl.VersionAwareResponseService;
import io.tesler.core.dto.multivalue.MultivalueField;
import io.tesler.core.dto.multivalue.MultivalueFieldSingleValue;
import io.tesler.core.dto.rowmeta.ActionResultDTO;
import io.tesler.core.dto.rowmeta.CreateResult;
import io.tesler.core.dto.rowmeta.PreAction;
import io.tesler.core.exception.BusinessException;
import io.tesler.core.service.action.Actions;
import io.tesler.core.service.action.ActionsBuilder;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import javax.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class UserEditService extends VersionAwareResponseService<UserDTO, SmUser> {
	
	private static final String USER_LIST_URL = "/screen/administration/view/userlist/";

	@Autowired
	private SmUserRepository userRepository;

	@Autowired
	private SmUserRoleRepository userRoleRepository;

	@Autowired
	private CustomDictionaryItemRepository itemRepository;

	public UserEditService() {
		super(UserDTO.class, SmUser.class, null, UserEditMeta.class);
	}

	@Override
	protected CreateResult<UserDTO> doCreateEntity(SmUser entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<UserDTO> doUpdateEntity(SmUser entity, UserDTO dto, BusinessComponent bc) {
		TeslerMapperUtil.setIfChanged(dto, firstName, entity::setFirstName);
		TeslerMapperUtil.setIfChanged(dto, lastName, entity::setLastName);
		TeslerMapperUtil.setIfChanged(dto, patronymic, entity::setPatronymic);
		TeslerMapperUtil.setIfChanged(dto, password, data -> {
			if (data != null && data.length() < 5) {
				throw new BusinessException().addPopup("Пароль должен содержать хотя бы 5 символов");
			}
			entity.setPassword("{noop}" + data);
		});
		TeslerMapperUtil.setIfChanged(dto, login, data -> {
			if (data != null && data.length() < 5) {
				throw new BusinessException().addPopup("Логин должен содержать хотя бы 5 символов");
			}
			checkUniqueLogin(entity, data);
			entity.setLogin(data);
		});
		TeslerMapperUtil.setIfChanged(dto, roles, data -> {
			if (data != null) {
				var userRoles = new ArrayList<SmUserRole>();
				var existingUserRoles = new ArrayList<SmUserRole>();
				data.getValues().stream()
						.map(MultivalueFieldSingleValue::getValue)
						.filter(Objects::nonNull)
						.forEach(role -> {
							var roleLov = new LOV(role);
							var smUserRoles = userRoleRepository.findByUserAndInternalRoleCd(entity, roleLov);
							if (smUserRoles.isEmpty()) {
								var userRole = new SmUserRole();
								userRole.setUser(entity);
								userRole.setInternalRoleCd(roleLov);
								userRole.setActive(true);
								userRole.setMain(false);
								userRoles.add(userRole);
							} else {
								existingUserRoles.addAll(smUserRoles);
							}
						});
				userRoleRepository.saveAllAndFlush(userRoles);
				var deleteUserRoles = userRoleRepository.findAll((root, query, cb) -> {
					List<Predicate> predicates = new ArrayList<>();
					predicates.add(cb.equal(root.get(SmUserRole_.USER), entity));
					var ids1 = userRoles.stream().map(SmUserRole::getId).collect(toList());
					var ids2 = existingUserRoles.stream().map(SmUserRole::getId).collect(toList());
					if (!ids1.isEmpty()) {
						predicates.add(cb.not(cb.in(root.get(SmUserRole_.ID)).value(ids1)));
					}
					if (!ids2.isEmpty()) {
						predicates.add(cb.not(cb.in(root.get(SmUserRole_.ID)).value(ids2)));
					}
					return cb.and(predicates.toArray(Predicate[]::new));
				});
				userRoleRepository.deleteAll(deleteUserRoles);
			} else {
				userRoleRepository.deleteAllByUser(entity);
			}
		});
		TeslerMapperUtil.setIfChanged(dto, mainRole, data -> {
			var userRoles = entity.getUserRoleList();
			userRoles.forEach(userRole -> userRole.setMain(false));
			if (hasText(data)) {
				userRoles.forEach(userRole -> {
					var item = itemRepository.findByTypeAndValue(INTERNAL_ROLE.getValue(), userRole.getInternalRoleCd().getKey())
							.orElse(null);
					if (item != null && data.equalsIgnoreCase(item.getValue())) {
						userRole.setMain(true);
					}
				});
			}
			userRoleRepository.saveAllAndFlush(userRoles);
		});
		userRepository.saveAndFlush(entity);
		return new ActionResultDTO<>(entityToDto(bc, entity));
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
				.save()
				.add()

				.newAction()
				.scope(RECORD)
				.available(ALWAYS_TRUE)
				.withoutAutoSaveBefore()
				.action("cancel", "Отменить")
				.withPreAction(bc -> PreAction.builder()
						.preActionType(CONFIRMATION)
						.message("Вы действительно хотите отменить? Вся добавленная информация будет утеряна.")
						.build())
				.invoker((bc, data) -> new ActionResultDTO<UserDTO>().setAction(drillDown(INNER, USER_LIST_URL)))
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID, bc -> {
					var user = userRepository.getById(bc.getIdAsLong());
					return user.getEditStep().getPreviousStep() != null;
				}))
				.withAutoSaveBefore()
				.action("previous", "Назад")
				.invoker((bc, data) -> {
					var user = userRepository.getById(bc.getIdAsLong());
					var previousStep = user.getEditStep().getPreviousStep();
					user.setEditStep(previousStep);
					userRepository.saveAndFlush(user);
					String url = previousStep.getEditView() + userEdit + "/" + bc.getId();
					return new ActionResultDTO<UserDTO>().setAction(drillDown(INNER, url));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID, bc -> {
					var user = userRepository.getById(bc.getIdAsLong());
					return user.getEditStep().getNextStep() != null;
				}))
				.withAutoSaveBefore()
				.action("next", "Далее")
				.invoker((bc, data) -> {
					var user = userRepository.getById(bc.getIdAsLong());
					var nextStep = user.getEditStep().getNextStep();
					user.setEditStep(nextStep);
					userRepository.saveAndFlush(user);
					if (nextStep == USER_EDIT_MAIN_ROLE) {
						var userRoles = userRoleRepository.findByUser(user);
						if (userRoles.size() == 1) {
							var userRole = userRoles.get(0);
							userRole.setMain(true);
							userRoleRepository.saveAndFlush(userRole);
						}
					}
					String url = nextStep.getEditView() + userEdit + "/" + bc.getId();
					return new ActionResultDTO<UserDTO>().setAction(drillDown(INNER, url));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID))
				.withAutoSaveBefore()
				.action("saveAsDraft", "Сохранить как Черновик")
				.invoker((bc, data) -> {
					var user = userRepository.getById(bc.getIdAsLong());
					user.setStatus(Status.DRAFT);
					userRepository.saveAndFlush(user);
					return new ActionResultDTO<UserDTO>().setAction(drillDown(INNER, USER_LIST_URL));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID, bc -> {
					var user = userRepository.getById(bc.getIdAsLong());
					return user.getEditStep().getNextStep() == null;
				}))
				.withAutoSaveBefore()
				.action("finish", "Сохранить")
				.invoker((bc, data) -> {
					var user = userRepository.getById(bc.getIdAsLong());
					user.setStatus(Status.ACTIVE);
					user.setActive(true);
					userRepository.saveAndFlush(user);
					return new ActionResultDTO<UserDTO>().setAction(drillDown(INNER, USER_LIST_URL));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID))
				.withAutoSaveBefore()
				.action("updatePassword", "Обновить пароль")
				.withPreAction(bc -> PreAction.builder()
						.preActionType(CONFIRMATION)
						.message("Вы уверены, что хотите обновить пароль пользователя?")
						.build())
				.invoker((bc, data) -> {
					var user = userRepository.getById(bc.getIdAsLong());
					String message = format("Пароль пользователя %s успешно обновлён", user.getLogin());
					return new ActionResultDTO<UserDTO>().setAction(showMessage(INFO, message));
				})
				.add()

				.build();
	}

	private void checkUniqueLogin(SmUser entity, String dtoLogin) {
		Specification<SmUser> spec = checkUniqueLoginSpecification(entity, dtoLogin);
		if (!userRepository.findAll(spec).isEmpty()) {
			throw new BusinessException().addPopup(format("Логин %s уже занят. Используйте другой, пожалуйста.", dtoLogin));
		}
	}

}
