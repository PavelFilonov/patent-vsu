package com.vsu.patent.entity;

import com.vsu.patent.entity.enums.ProgramEditStep;
import com.vsu.patent.entity.enums.ProgramEntityType;
import com.vsu.patent.entity.enums.Status;
import io.tesler.model.core.entity.BaseEntity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

import static com.vsu.patent.entity.enums.ProgramEditStep.MAIN;
import static com.vsu.patent.entity.enums.Status.IN_THE_MAKING;
import static javax.persistence.CascadeType.ALL;
import static javax.persistence.EnumType.STRING;
import static javax.persistence.FetchType.LAZY;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"authors"})
@Entity
@Table(name = "program")
public class Program extends BaseEntity {

	private String name;

	private String registrationPlace;

	private LocalDate registrationDate;

	private Long certificateNumber;

	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "department_id")
	private UniversityDepartment department;

	private LocalDate sendDocumentDate;

	@Column(length = -1)
	private String note;

	private LocalDate notificationCreationDate;

	private Long requestNumber;

	@Column(length = -1)
	private String ownersCopyright;

	@Enumerated(value = STRING)
	private Status status = IN_THE_MAKING;

	@Enumerated(value = STRING)
	private ProgramEditStep editStep = MAIN;

	@Enumerated(value = STRING)
	private ProgramEntityType entityType;

	@OneToMany(fetch = LAZY, mappedBy = "program", cascade = ALL, orphanRemoval = true)
	private List<UserProgram> authors;

}
