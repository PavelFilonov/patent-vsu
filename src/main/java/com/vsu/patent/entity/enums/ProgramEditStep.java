package com.vsu.patent.entity.enums;

import static com.vsu.patent.controller.TeslerRestController.databaseEdit;
import static com.vsu.patent.controller.TeslerRestController.databaseRead;
import static com.vsu.patent.controller.TeslerRestController.integratedCircuitEdit;
import static com.vsu.patent.controller.TeslerRestController.integratedCircuitRead;
import static com.vsu.patent.controller.TeslerRestController.programEdit;
import static com.vsu.patent.controller.TeslerRestController.programRead;
import static java.lang.String.format;

import com.fasterxml.jackson.annotation.JsonValue;
import com.vsu.patent.controller.TeslerRestController;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum ProgramEditStep {

	MAIN("screen/registry/view/%seditmain/", 
			"screen/registry/view/%sinfo/",
			"Основные данные", null, null),
	REQUEST("screen/registry/view/%seditrequest/", 
			"screen/registry/view/%sinfo/",
			"Регистрация", null, null);

	static {
		MAIN.nextStep = REQUEST;
		REQUEST.previousStep = MAIN;
	}

	private final String editView;
	
	private final String infoView;

	@JsonValue
	private final String stepName;

	private ProgramEditStep previousStep;

	private ProgramEditStep nextStep;
	
	public String getEditView(TeslerRestController editBc) {
		if (editBc == programEdit) {
			return format(this.editView, "program");
		}
		if (editBc == databaseEdit) {
			return format(this.editView, "database");
		}
		if (editBc == integratedCircuitEdit) {
			return format(this.editView, "circuit");
		}
		throw new IllegalArgumentException();
	}

	public String getInfoView(TeslerRestController readBc) {
		if (readBc == programRead) {
			return format(this.infoView, "program");
		}
		if (readBc == databaseRead) {
			return format(this.infoView, "database");
		}
		if (readBc == integratedCircuitRead) {
			return format(this.infoView, "circuit");
		}
		throw new IllegalArgumentException();
	}

}
