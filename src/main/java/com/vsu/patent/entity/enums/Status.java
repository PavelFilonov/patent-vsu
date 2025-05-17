package com.vsu.patent.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import com.vsu.patent.entity.common.Color;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Status {

	IN_THE_MAKING("Создаётся", new Color("#b3b3b3")),
	DRAFT("Черновик", new Color("#b3b3b3")),
	ACTIVE("Активно", new Color("#25B220")),
	INACTIVE("Неактивно", new Color("#f70505"))
	;

	@JsonValue
	private final String value;

	private final Color color;
	
	public static final Status[] FILTER_STATUSES = {DRAFT, ACTIVE, INACTIVE};

}