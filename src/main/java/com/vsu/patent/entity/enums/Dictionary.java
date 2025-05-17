package com.vsu.patent.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Dictionary {

	INTERNAL_ROLE("INTERNAL_ROLE")
	;

	@JsonValue
	private final String value;

}