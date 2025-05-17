package com.vsu.patent.service.tesler.extension.translatableEnum;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.BeanProperty;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.deser.ContextualDeserializer;
import com.vsu.patent.entity.enums.LanguageEnum;
import java.io.IOException;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CustomEnumDeserializer extends JsonDeserializer<TranslatableEnum> implements ContextualDeserializer {

	private final JavaType type;

	private final ApplicationContext applicationContext;

	public CustomEnumDeserializer(@NonNull JavaType type, @NonNull ApplicationContext applicationContext) {
		this.type = type;
		this.applicationContext = applicationContext;
	}

	@Autowired
	public CustomEnumDeserializer(@NonNull ApplicationContext applicationContext) {
		this.type = null;
		this.applicationContext = applicationContext;
	}

	@Override
	public TranslatableEnum deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
			throws IOException {
		String value = jsonParser.readValueAs(String.class);
		if (null == value) {
			return null;
		}
		return TranslatableEnum.getByValue(
				value,
				LanguageEnum.getByName(LocaleContextHolder.getLocale().getLanguage()),
				type.getRawClass(), applicationContext
		);
	}


	@Override
	public JsonDeserializer<?> createContextual(DeserializationContext deserializationContext, BeanProperty beanProperty)
			throws JsonMappingException {
		JavaType type = deserializationContext.getContextualType() != null
				? deserializationContext.getContextualType()
				: beanProperty.getMember().getType();
		return new CustomEnumDeserializer(type, applicationContext);
	}

}
