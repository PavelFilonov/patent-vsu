package com.vsu.patent.dto;


import com.vsu.patent.entity.SmUser;
import com.vsu.patent.entity.enums.Status;
import com.vsu.patent.entity.enums.UserEditStep;
import io.tesler.api.data.dto.DataResponseDTO;
import io.tesler.core.dto.multivalue.MultivalueField;
import io.tesler.core.util.filter.SearchParameter;
import io.tesler.core.util.filter.provider.impl.EnumValueProvider;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDTO extends DataResponseDTO {

	@SearchParameter
	private String firstName;

	@SearchParameter
	private String lastName;

	@SearchParameter
	private String patronymic;

	@SearchParameter
	private String login;
	
	private String password;

	@SearchParameter(provider = EnumValueProvider.class)
	private Status status;

	private UserEditStep editStep;
	
	private MultivalueField roles;

	private String statusBgColor;
	
	private String mainRole;
	
	private String fullName;

	public UserDTO(SmUser entity) {
		this.id = entity.getId().toString();
		this.firstName = entity.getFirstName();
		this.lastName = entity.getLastName();
		this.patronymic = entity.getPatronymic();
		this.login = entity.getLogin();
		var entityStatus = entity.getStatus();
		this.status = entityStatus;
		this.statusBgColor = entityStatus.getColor().getHex();
		this.editStep = entity.getEditStep();
		this.fullName = entity.getFullName();
	}

}
