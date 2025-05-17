package com.vsu.patent.entity;

import static java.lang.Boolean.TRUE;
import static javax.persistence.FetchType.LAZY;

import io.tesler.model.core.entity.BaseEntity;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user_innovation")
public class UserInnovation extends BaseEntity {

	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "user_id")
	private SmUser user;

	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "innovation_id")
	private Innovation innovation;

	private Boolean isActive = TRUE;
	
}
