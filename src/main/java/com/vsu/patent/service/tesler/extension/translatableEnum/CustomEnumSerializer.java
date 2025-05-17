package com.vsu.patent.service.tesler.extension.translatableEnum;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.vsu.patent.entity.enums.LanguageEnum;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomEnumSerializer extends JsonSerializer<TranslatableEnum> {

	private final ApplicationContext applicationContext;

	@Override
	public void serialize(TranslatableEnum value, JsonGenerator gen, SerializerProvider serializers)
			throws IOException {
		gen.writeString(value.getValue(LanguageEnum.getByName(LocaleContextHolder.getLocale().getLanguage()), applicationContext));
	}

}
