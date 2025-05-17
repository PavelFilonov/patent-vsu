package com.vsu.patent.entity;

import io.tesler.model.core.entity.BaseEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity for user-defined dictionary items.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "DICTIONARY_ITEM")
public class CustomDictionaryItem extends BaseEntity {

	@Column
	private String type;

	@Column
	private String key;

	@Column
	private boolean active;

	@Column
	private Integer displayOrder;

	@Column
	private String description;

	@Column(name = "ADDITION_FLG")
	private boolean additionFlg;

	@ManyToOne
	@JoinColumn(name = "DICTIONARY_TYPE_ID", nullable = false)
	private CustomDictionaryType dictionaryTypeId;

	@Column(name = "value")
	private String value;
}
