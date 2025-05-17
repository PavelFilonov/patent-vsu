package com.vsu.patent.entity;

import static com.vsu.patent.entity.enums.AgreementEditStep.MAIN;
import static com.vsu.patent.entity.enums.Status.IN_THE_MAKING;
import static javax.persistence.EnumType.STRING;

import com.vsu.patent.entity.enums.AgreementEditStep;
import com.vsu.patent.entity.enums.Status;
import com.vsu.patent.entity.enums.SubjectAgreementType;
import io.tesler.model.core.entity.BaseEntity;
import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "agreement")
public class Agreement extends BaseEntity {

	private Long number;
	
	private Long agreementNumber;
	
	private LocalDate signDate;
	
	private LocalDate endDate;
	
	private String type;
	
	private Long subjectNumber;
	
	private String subjectName;
	
	@Enumerated(value = STRING)
	private SubjectAgreementType subjectType;
	
	private Long period;
	
	private Double amount;
	
	private String licensee;
	
	@Column(length = -1)
	private String additionalAgreement;

	@Column(length = -1)
	private String licenseeContactInfo;
	
	private Long registrationNumber;
	
	private String parentAgreement;

	@Column(length = -1)
	private String note;

	@Enumerated(value = STRING)
	private Status status = IN_THE_MAKING;

	@Enumerated(value = STRING)
	private AgreementEditStep editStep = MAIN;

}
