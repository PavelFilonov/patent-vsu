package com.vsu.patent.entity.enums;

import static com.vsu.patent.controller.TeslerRestController.innovationEdit;
import static com.vsu.patent.controller.TeslerRestController.usefulModelEdit;

import com.fasterxml.jackson.annotation.JsonValue;
import com.vsu.patent.controller.TeslerRestController;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum InnovationEntityType {

	INNOVATION("INNOVATION"),
	USEFUL_MODEL("USEFUL_MODEL");

	@JsonValue
	private final String value;

	public static InnovationEntityType getInnovationEntityTypeByEditBc(TeslerRestController editBc) {
		if (editBc == innovationEdit) {
			return INNOVATION;
		}
		if (editBc == usefulModelEdit) {
			return USEFUL_MODEL;
		}
		throw new IllegalArgumentException();
	}
	
}
