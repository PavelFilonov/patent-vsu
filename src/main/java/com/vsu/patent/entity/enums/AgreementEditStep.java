package com.vsu.patent.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum AgreementEditStep {

	MAIN("screen/registry/view/agreementeditmain/", "Основные данные", null, null),
	SUBJECT("screen/registry/view/agreementeditsubject/", "Предмет договора", null, null);

	static {
		MAIN.nextStep = SUBJECT;
		SUBJECT.previousStep = MAIN;
	}

	private final String editView;

	@JsonValue
	private final String stepName;

	private AgreementEditStep previousStep;

	private AgreementEditStep nextStep;

}
