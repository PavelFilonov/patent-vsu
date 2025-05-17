package com.vsu.patent.service.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum YesNoEnum {
	YES("Yes"),
	NO("No");

	@Getter
	@JsonValue
	private final String value;

	public static YesNoEnum getByValue(String value) {
		return Arrays.stream(YesNoEnum.values()).filter(e -> e.getValue().equals(value)).findFirst()
				.orElse(null);
	}
}
