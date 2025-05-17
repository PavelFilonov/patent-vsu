package com.vsu.patent.entity;

import static io.tesler.api.data.dictionary.DictionaryCache.dictionary;

import io.tesler.api.data.dictionary.IDictionaryType;
import io.tesler.api.data.dictionary.LOV;
import io.tesler.model.core.entity.BaseEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity for user-defined dictionary types.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "dictionary_type")
public class CustomDictionaryType extends BaseEntity implements IDictionaryType {

	/**
	 * Dictionary type name
	 */
	@Column(name = "type", unique = true)
	private String type;

	/**
	 * Type description
	 */
	@Column(name = "type_desc")
	private String typeDesc;

	@Override
	public String getName() {
		return type;
	}

	@Override
	public LOV lookupName(String val) {
		return dictionary().lookupName(val, this);
	}

	@Override
	public String lookupValue(LOV lov) {
		return dictionary().lookupValue(lov, this);
	}
}
