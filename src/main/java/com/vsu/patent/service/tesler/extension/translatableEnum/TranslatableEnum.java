package com.vsu.patent.service.tesler.extension.translatableEnum;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vsu.patent.entity.enums.LanguageEnum;
import java.util.Arrays;
import org.springframework.context.ApplicationContext;

@JsonSerialize(using = CustomEnumSerializer.class)
@JsonDeserialize(using = CustomEnumDeserializer.class)
public interface TranslatableEnum {

	static TranslatableEnum getByValue(String value, LanguageEnum languageEnum, Class enumType,
			ApplicationContext applicationContext) {
		Object obj = Arrays.stream(enumType.getEnumConstants()).filter(e -> {
					TranslatableEnum a = (TranslatableEnum) e;
					return a.getValue(languageEnum, applicationContext).equals(value);
				}).findFirst()
				.orElse(null);
		return (TranslatableEnum) obj;
	}

	String getValue(LanguageEnum languageEnum, ApplicationContext applicationContext);

}
