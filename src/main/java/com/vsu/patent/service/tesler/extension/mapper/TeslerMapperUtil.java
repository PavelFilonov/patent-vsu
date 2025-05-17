package com.vsu.patent.service.tesler.extension.mapper;

import io.tesler.api.data.dto.DataResponseDTO;
import io.tesler.constgen.DtoField;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

/**
 * Here we extend {@value io.tesler.core.crudma.impl.AbstractResponseService#setIfChanged} methods to support dto inheritance
 */
public class TeslerMapperUtil {

	public static <D, V, T extends DataResponseDTO> void setMappedIfChanged(
			final T dto, final DtoField<T, D> dtoField,
			final Consumer<V> entitySetter, final Supplier<D> dtoGetter, final Function<D, V> mapper) {
		if (dto.isFieldChanged(dtoField)) {
			entitySetter.accept(mapper.apply(dtoGetter.get()));
		}
	}

	/**
	 * Saving the value of the DTO field (when it changes) in the entity field (using the custom DTO-getter).
	 *
	 * @param <V> type of entity field to the value is to be saved
	 * @param dto DTO-object, which value to be saved to the entity field
	 * @param dtoField the DTO-object field, which value to be saved to the entity field
	 * @param entitySetter method for saving a value (when it changes) to an entity
	 * @param dtoGetter method for retrieving a value (when it changes) from the DTO
	 */
	public static final <V, T extends DataResponseDTO> void setIfChanged(
			final T dto, final DtoField<T, V> dtoField,
			final Consumer<V> entitySetter, final Supplier<V> dtoGetter) {
		setMappedIfChanged(dto, dtoField, entitySetter, dtoGetter, Function.identity());
	}

	/**
	 * Saving the value of the DTO field (when it changes) in the entity field.
	 *
	 * @param <D> type of DTO field value to be saved in the entity field
	 * @param <V> type of entity field to the value is to be saved
	 * @param dto DTO-object, which value to be saved to the entity field
	 * @param dtoField the DTO-object field, which value to be saved to the entity field
	 * @param entitySetter method for saving a value (when it changes) to an entity
	 * @param mapper converts the saving value into the corresponding entity field type
	 */
	public static final <D, V, T extends DataResponseDTO> void setMappedIfChanged(
			final T dto, final DtoField<T, D> dtoField,
			final Consumer<V> entitySetter, final Function<D, V> mapper) {
		setMappedIfChanged(dto, dtoField, entitySetter, () -> dtoField.getValue(dto), mapper);
	}

	/**
	 * Saving the value of the DTO field (when it changes) in the entity field.
	 *
	 * @param <V> type of entity field to the value is to be saved
	 * @param dto DTO-object, which value to be saved to the entity field
	 * @param dtoField the DTO-object field, which value to be saved to the entity field
	 * @param entitySetter method for saving a value (when it changes) to an entity
	 */
	public static final <V, T extends DataResponseDTO> void setIfChanged(final T dto, final DtoField<T, V> dtoField,
			final Consumer<V> entitySetter) {
		setMappedIfChanged(dto, dtoField, entitySetter, Function.identity());
	}

}
