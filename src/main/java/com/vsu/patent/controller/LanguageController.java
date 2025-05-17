package com.vsu.patent.controller;

import com.fasterxml.jackson.annotation.JsonValue;
import io.tesler.api.data.dictionary.SimpleDictionary;
import io.tesler.core.dto.ResponseDTO;
import io.tesler.core.util.ResponseBuilder;
import lombok.Getter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
public class LanguageController {

	@GetMapping(path = "/api/v1/languages")
	public ResponseDTO getLanguages() {
		Collection<SimpleDictionary> all = Arrays.stream(LanguageEnum.values())
				.map(l -> new SimpleDictionary("LANGUAGE_NAME", l.name(), l.getValue(), null, null, 1, true, null)).collect(
						Collectors.toList());
		return ResponseBuilder.build(all);
	}

	private enum LanguageEnum {
		eng("English"),
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

		LanguageEnum(String value) {
			this.value = value;
		}

		public static LanguageEnum getByValue(String value) {
			return Arrays.stream(LanguageEnum.values()).filter(e -> e.getValue().equals(value)).findFirst().orElse(null);
		}

		public static LanguageEnum getByName(String name) {
			return Optional.of(LanguageEnum.valueOf(name)).orElse(null);
		}
	}

}
