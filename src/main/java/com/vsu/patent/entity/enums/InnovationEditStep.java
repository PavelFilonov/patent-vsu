package com.vsu.patent.entity.enums;

import static com.vsu.patent.controller.TeslerRestController.innovationEdit;
import static com.vsu.patent.controller.TeslerRestController.innovationRead;
import static com.vsu.patent.controller.TeslerRestController.usefulModelEdit;
import static com.vsu.patent.controller.TeslerRestController.usefulModelRead;
import static java.lang.String.format;

import com.fasterxml.jackson.annotation.JsonValue;
import com.vsu.patent.controller.TeslerRestController;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum InnovationEditStep {

	MAIN("screen/registry/view/%seditmain/",
			"screen/registry/view/%sinfo/",
			"Основные данные", null, null),
	REQUEST("screen/registry/view/%seditrequest/",
			"screen/registry/view/%sinfo/",
			"Запрос", null, null),
	PATENT("screen/registry/view/%seditpatent/",
			"screen/registry/view/%sinfo/",
			"Патент", null, null),
	EXPERTISE("screen/registry/view/%seditexpertise/",
			"screen/registry/view/%sinfo/",
			"Экспертиза", null, null),
	ADDITIONAL("screen/registry/view/%seditadditional/",
			"screen/registry/view/%sinfo/",
			"Дополнения", null, null);

	static {
		MAIN.nextStep = REQUEST;
		REQUEST.previousStep = MAIN;
		REQUEST.nextStep = PATENT;
		PATENT.previousStep = REQUEST;
		PATENT.nextStep = EXPERTISE;
		EXPERTISE.previousStep = PATENT;
		EXPERTISE.nextStep = ADDITIONAL;
		ADDITIONAL.previousStep = EXPERTISE;
	}

	private final String editView;

	private final String infoView;

	@JsonValue
	private final String stepName;

	private InnovationEditStep previousStep;

	private InnovationEditStep nextStep;

	public String getEditView(TeslerRestController editBc) {
		if (editBc == innovationEdit) {
			return format(this.editView, "innovation");
		}
		if (editBc == usefulModelEdit) {
			return format(this.editView, "usefulmodel");
		}
		throw new IllegalArgumentException();
	}

	public String getInfoView(TeslerRestController readBc) {
		if (readBc == innovationRead) {
			return format(this.infoView, "innovation");
		}
		if (readBc == usefulModelRead) {
			return format(this.infoView, "usefulmodel");
		}
		throw new IllegalArgumentException();
	}
	
}
