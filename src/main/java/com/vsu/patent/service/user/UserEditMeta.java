package com.vsu.patent.service.user;

import com.vsu.patent.dto.UserDTO;
import com.vsu.patent.entity.CustomDictionaryItem;
import com.vsu.patent.entity.SmUserRole;
import com.vsu.patent.entity.enums.UserEditStep;
import com.vsu.patent.repository.CustomDictionaryItemRepository;
import com.vsu.patent.repository.SmUserRepository;
import com.vsu.patent.repository.SmUserRoleRepository;
import io.tesler.api.data.dictionary.LOV;
import io.tesler.api.data.dictionary.SimpleDictionary;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Arrays;
import java.util.Objects;

import static com.vsu.patent.dto.UserDTO_.*;
import static com.vsu.patent.entity.enums.Dictionary.INTERNAL_ROLE;
import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class UserEditMeta extends FieldMetaBuilder<UserDTO> {

	private final SmUserRepository userRepository;
	
	private final SmUserRoleRepository userRoleRepository;
	
	private final CustomDictionaryItemRepository itemRepository;

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<UserDTO> fields, InnerBcDescription bcDescription,
			Long id, Long parentId) {
		var user = userRepository.getById(id);
		fields.setEnabled(lastName, firstName, patronymic, login, password, roles, mainRole);
		fields.setConcreteValues(
				roles,
				itemRepository.findAllActiveByType(INTERNAL_ROLE.getValue()).stream()
						.map(item -> new SimpleDictionary(item.getKey(), item.getValue()))
						.collect(toList())
		);
		var userRoles = userRoleRepository.findByUser(user);
		if (CollectionUtils.isEmpty(userRoles)) {
			fields.setDisabled(mainRole);
		} else {
			fields.setConcreteValues(
					mainRole,
					userRoles.stream()
							.map(SmUserRole::getInternalRoleCd)
							.map(LOV::getKey)
							.map(role -> itemRepository.findByTypeAndValue(INTERNAL_ROLE.getValue(), role).orElse(null))
							.filter(Objects::nonNull)
							.map(CustomDictionaryItem::getValue)
							.map(role -> new SimpleDictionary(role, role))
							.collect(toList())
			);
		}
		buildStepper(fields);
		setPlaceholders(fields);
	}

	private void buildStepper(RowDependentFieldsMeta<UserDTO> fields) {
		fields.setEnabled(editStep);
		fields.setDictionaryTypeWithCustomValues(editStep, Arrays.stream(UserEditStep.values())
				.map(UserEditStep::getStepName).toArray(String[]::new));
	}

	private void setPlaceholders(RowDependentFieldsMeta<UserDTO> fields) {
		fields.setPlaceholder(firstName, "Имя");
		fields.setPlaceholder(lastName, "Фамилия");
		fields.setPlaceholder(patronymic, "Отчество");
		fields.setPlaceholder(login, "Логин");
		fields.setPlaceholder(password, "Пароль");
		fields.setPlaceholder(roles, "Роли");
		fields.setPlaceholder(mainRole, "Главная роль");
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<UserDTO> fields, InnerBcDescription bcDescription, Long parentId) {
		
	}

}
