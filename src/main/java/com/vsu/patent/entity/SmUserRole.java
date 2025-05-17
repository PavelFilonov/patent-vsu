package com.vsu.patent.entity;

import io.tesler.api.data.dictionary.LOV;
import io.tesler.model.core.entity.BaseEntity;
import io.tesler.model.core.entity.Division;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "USER_ROLE")
@Getter
@Setter
public class SmUserRole extends BaseEntity {

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "USER_ID")
	private SmUser user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "DIVISION_ID")
	private Division division;

	@Column(name = "INTERNAL_ROLE_CD")
	private LOV internalRoleCd;

	@Column
	private Boolean active;

	@Column
	private Boolean main;
	
}
