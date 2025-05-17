package com.vsu.patent.dto;


import com.vsu.patent.entity.Agreement;
import com.vsu.patent.entity.enums.AgreementEditStep;
import com.vsu.patent.entity.enums.Status;
import com.vsu.patent.entity.enums.SubjectAgreementType;
import com.vsu.patent.service.tesler.extension.provider.CustomLongValueProvider;
import io.tesler.api.data.dto.DataResponseDTO;
import io.tesler.core.util.filter.SearchParameter;
import io.tesler.core.util.filter.provider.impl.EnumValueProvider;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AgreementDTO extends DataResponseDTO {

	@SearchParameter(provider = EnumValueProvider.class)
	private Status status;

	private String statusBgColor;

	private AgreementEditStep editStep;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long number;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long agreementNumber;

	private LocalDate signDate;

	private LocalDate endDate;

	@SearchParameter
	private String type;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long subjectNumber;

	@SearchParameter
	private String subjectName;

	@SearchParameter(provider = EnumValueProvider.class)
	private SubjectAgreementType subjectType;

	private Long period;

	private Double amount;

	private String licensee;

	private String additionalAgreement;

	private String licenseeContactInfo;

	private Long registrationNumber;

	private String parentAgreement;
	
	private String note;

	public AgreementDTO(Agreement entity) {
		this.id = entity.getId().toString();
		Status entityStatus = entity.getStatus();
		this.status = entityStatus;
		this.statusBgColor = entityStatus.getColor().getHex();
		this.editStep = entity.getEditStep();
		this.number = entity.getNumber();
		this.agreementNumber = entity.getAgreementNumber();
		this.signDate = entity.getSignDate();
		this.endDate = entity.getEndDate();
		this.type = entity.getType();
		this.subjectNumber = entity.getSubjectNumber();
		this.subjectName = entity.getSubjectName();
		this.subjectType = entity.getSubjectType();
		this.period = entity.getPeriod();
		this.amount = entity.getAmount();
		this.licensee = entity.getLicensee();
		this.additionalAgreement = entity.getAdditionalAgreement();
		this.licenseeContactInfo = entity.getLicenseeContactInfo();
		this.registrationNumber = entity.getRegistrationNumber();
		this.parentAgreement = entity.getParentAgreement();
		this.note = entity.getNote();
	}

}
