package com.vsu.patent.entity.enums;

import static com.vsu.patent.controller.TeslerRestController.databaseEdit;
import static com.vsu.patent.controller.TeslerRestController.integratedCircuitEdit;
import static com.vsu.patent.controller.TeslerRestController.programEdit;

import com.fasterxml.jackson.annotation.JsonValue;
import com.vsu.patent.controller.TeslerRestController;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum ProgramEntityType {

	PROGRAM("PROGRAM"),
	DATABASE("DATABASE"),
	INTEGRATED_CIRCUIT("INTEGRATED_CIRCUIT");

	@JsonValue
	private final String value;

	public static ProgramEntityType getProgramEntityTypeByEditBc(TeslerRestController editBc) {
		if (editBc == programEdit) {
			return PROGRAM;
		}
		if (editBc == databaseEdit) {
			return DATABASE;
		}
		if (editBc == integratedCircuitEdit) {
			return INTEGRATED_CIRCUIT;
		}
		throw new IllegalArgumentException();
	}

}
