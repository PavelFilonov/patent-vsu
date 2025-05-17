package com.vsu.patent.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SubjectAgreementType {

	KNOW_HOW("Ноу-хау"),
	PATENT("Патент"),
	PROGRAM("Программа");

	@JsonValue
	private final String value;

}