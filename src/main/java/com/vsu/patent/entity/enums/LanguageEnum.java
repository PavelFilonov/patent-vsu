package com.vsu.patent.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public enum LanguageEnum {
	en("English"),
	deu("German"),
	por("Portuguese"),
	zho("Chinese"),
	fra("French"),
	spa("Spanish"),
	ces("Czech"),
	dan("Danish"),
	ell("Greek"),
	hun("Hungarian"),
	ita("Italian"),
	jpn("Japanese"),
	kor("Korean"),
	nld("Dutch"),
	nno("Norwegian"),
	pol("Polish"),
	ron("Romanian"),
	rus("Russian"),
	srp("Serbian"),
	swe("Swedish"),
	tha("Thai"),
	tur("Turkish"),
	fin("Finnish");

	@Getter
	@JsonValue
	private final String value;

	public static LanguageEnum getByValue(String value) {
		return Arrays.stream(LanguageEnum.values()).filter(e -> e.getValue().equals(value)).findFirst().orElse(null);
	}

	public static LanguageEnum getByName(String name) {
		return Optional.of(LanguageEnum.valueOf(name)).orElse(null);
	}

}
