package com.vsu.patent.dto;


import com.vsu.patent.entity.Program;
import com.vsu.patent.entity.SmUser;
import com.vsu.patent.entity.UserProgram;
import com.vsu.patent.entity.enums.ProgramEditStep;
import com.vsu.patent.entity.enums.Status;
import com.vsu.patent.service.tesler.extension.provider.CustomLongValueProvider;
import io.tesler.api.data.dto.DataResponseDTO;
import io.tesler.core.dto.multivalue.MultivalueField;
import io.tesler.core.util.filter.SearchParameter;
import io.tesler.core.util.filter.provider.impl.EnumValueProvider;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

import static io.tesler.core.dto.multivalue.MultivalueField.toMultivalueField;

@Getter
@Setter
@NoArgsConstructor
public class ProgramDTO extends DataResponseDTO {

	@SearchParameter(provider = EnumValueProvider.class)
	private Status status;

	private String statusBgColor;

	private ProgramEditStep editStep;

	@SearchParameter
	private String name;

	private String registrationPlace;

	private LocalDate registrationDate;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long certificateNumber;

	private Long departmentId;

	@SearchParameter(name = "department.name")
	private String departmentName;

	@SearchParameter(name = "department.faculty.name")
	private String facultyName;

	private LocalDate sendDocumentDate;

	private String note;

	private LocalDate notificationCreationDate;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long requestNumber;
	
	private String ownersCopyright;

	private MultivalueField authors;

	@SearchParameter(suppressProcess = true)
	private Boolean isMyPrograms;

	public ProgramDTO(Program entity) {
		this.id = entity.getId().toString();
		Status entityStatus = entity.getStatus();
		this.status = entityStatus;
		this.statusBgColor = entityStatus.getColor().getHex();
		this.editStep = entity.getEditStep();
		this.name = entity.getName();
		this.registrationPlace = entity.getRegistrationPlace();
		this.registrationDate = entity.getRegistrationDate();
		this.certificateNumber = entity.getCertificateNumber();
		var department = entity.getDepartment();
		if (department != null) {
			this.departmentId = department.getId();
			this.departmentName = department.getName();
			var faculty = department.getFaculty();
			if (faculty != null) {
				this.facultyName = faculty.getName();
			}
		}
		this.sendDocumentDate = entity.getSendDocumentDate();
		this.note = entity.getNote();
		this.notificationCreationDate = entity.getNotificationCreationDate();
		this.requestNumber = entity.getRequestNumber();
		this.ownersCopyright = entity.getOwnersCopyright();
		this.authors = entity.getAuthors().stream()
				.filter(UserProgram::getIsActive)
				.map(UserProgram::getUser)
				.collect(toMultivalueField(SmUser::getFullNameWithLogin, SmUser::getFullNameWithLogin));
	}

}
