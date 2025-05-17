package com.vsu.patent.entity;

import com.vsu.patent.entity.enums.Status;
import io.tesler.model.core.entity.BaseEntity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

import static com.vsu.patent.entity.enums.Status.IN_THE_MAKING;
import static javax.persistence.EnumType.STRING;
import static javax.persistence.FetchType.LAZY;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"programs"})
@Entity
@Table(name = "university_department")
public class UniversityDepartment extends BaseEntity {

	private String name;

	@Enumerated(value = STRING)
	private Status status = IN_THE_MAKING;

	@OneToMany(fetch = LAZY, mappedBy = "department")
	private List<Program> programs;

	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "faculty_id")
	private UniversityFaculty faculty;

}
