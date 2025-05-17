package com.vsu.patent.entity;

import com.vsu.patent.entity.enums.Status;
import io.tesler.model.core.entity.BaseEntity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

import static com.vsu.patent.entity.enums.Status.IN_THE_MAKING;
import static javax.persistence.EnumType.STRING;
import static javax.persistence.FetchType.LAZY;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = {"departments"})
@Entity
@Table(name = "university_faculty")
public class UniversityFaculty extends BaseEntity {

	private String name;

	@Enumerated(value = STRING)
	private Status status = IN_THE_MAKING;

	@OneToMany(fetch = LAZY, mappedBy = "faculty")
	private List<UniversityDepartment> departments;

}
