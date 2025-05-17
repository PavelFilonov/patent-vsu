package com.vsu.patent.dto;


import static io.tesler.core.dto.multivalue.MultivalueField.toMultivalueField;

import com.vsu.patent.entity.Innovation;
import com.vsu.patent.entity.SmUser;
import com.vsu.patent.entity.UserInnovation;
import com.vsu.patent.entity.enums.InnovationEditStep;
import com.vsu.patent.entity.enums.Status;
import com.vsu.patent.service.tesler.extension.provider.CustomLongValueProvider;
import io.tesler.api.data.dto.DataResponseDTO;
import io.tesler.core.dto.multivalue.MultivalueField;
import io.tesler.core.util.filter.SearchParameter;
import io.tesler.core.util.filter.provider.impl.EnumValueProvider;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class InnovationDTO extends DataResponseDTO {

	@SearchParameter(provider = EnumValueProvider.class)
	private Status status;

	private String statusBgColor;

	private InnovationEditStep editStep;

	@SearchParameter
	private String name;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long number;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long patentNumber;
	
	private LocalDate registrationDate;

	private LocalDate priorityDate;

	private LocalDate decisionDate;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long requestNumber;

	private LocalDate submissionDate;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long outgoingNumber;

	private String note;

	private String action;

	private String usage;

	private String petition;

	private String expertiseRequests;

	private String petitionDuties;

	private LocalDate formalDecisionNotificationDate;

	private LocalDate petitionNotificationDate;

	private MultivalueField authors;
	
	@SearchParameter(suppressProcess = true)
	private Boolean isMyInnovations;

	public InnovationDTO(Innovation entity) {
		this.id = entity.getId().toString();
		Status entityStatus = entity.getStatus();
		this.status = entityStatus;
		this.statusBgColor = entityStatus.getColor().getHex();
		this.editStep = entity.getEditStep();
		this.name = entity.getName();
		this.number = entity.getNumber();
		this.patentNumber = entity.getPatentNumber();
		this.registrationDate = entity.getRegistrationDate();
		this.priorityDate = entity.getPriorityDate();
		this.decisionDate = entity.getDecisionDate();
		this.requestNumber = entity.getRequestNumber();
		this.submissionDate = entity.getSubmissionDate();
		this.outgoingNumber = entity.getOutgoingNumber();
		this.note = entity.getNote();
		this.action = entity.getAction();
		this.usage = entity.getUsage();
		this.petition = entity.getPetition();
		this.expertiseRequests = entity.getExpertiseRequests();
		this.petitionDuties = entity.getPetitionDuties();
		this.formalDecisionNotificationDate = entity.getFormalDecisionNotificationDate();
		this.petitionNotificationDate = entity.getPetitionNotificationDate();
		this.authors = entity.getAuthors().stream()
				.filter(UserInnovation::getIsActive)
				.map(UserInnovation::getUser)
				.collect(toMultivalueField(SmUser::getLogin, SmUser::getFullName));
	}

}
