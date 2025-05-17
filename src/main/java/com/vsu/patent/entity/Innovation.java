package com.vsu.patent.entity;

import static com.vsu.patent.entity.enums.InnovationEditStep.MAIN;
import static com.vsu.patent.entity.enums.Status.IN_THE_MAKING;
import static javax.persistence.CascadeType.ALL;
import static javax.persistence.EnumType.STRING;
import static javax.persistence.FetchType.LAZY;

import com.vsu.patent.entity.enums.InnovationEditStep;
import com.vsu.patent.entity.enums.InnovationEntityType;
import com.vsu.patent.entity.enums.Status;
import io.tesler.model.core.entity.BaseEntity;
import java.time.LocalDate;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"authors"})
@Entity
@Table(name = "innovation")
public class Innovation extends BaseEntity {

	private String name;

	private Long number;

	private Long patentNumber;

	private LocalDate registrationDate;

	private LocalDate priorityDate;

	private LocalDate decisionDate;

	private Long requestNumber;

	private LocalDate submissionDate;

	private Long outgoingNumber;

	@Column(length = -1)
	private String note;

	private String action;

	@Column(length = -1)
	private String usage;

	@Column(length = -1)
	private String petition;

	@Column(length = -1)
	private String expertiseRequests;

	@Column(length = -1)
	private String petitionDuties;

	private LocalDate formalDecisionNotificationDate;

	private LocalDate petitionNotificationDate;

	@Enumerated(value = STRING)
	private Status status = IN_THE_MAKING;

	@Enumerated(value = STRING)
	private InnovationEditStep editStep = MAIN;
	
	@Enumerated(value = STRING)
	private InnovationEntityType entityType;

	@OneToMany(fetch = LAZY, mappedBy = "innovation", cascade = ALL, orphanRemoval = true)
	private List<UserInnovation> authors;

}
