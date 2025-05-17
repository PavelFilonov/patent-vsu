package com.vsu.patent.helper;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.tesler.api.data.dictionary.SimpleDictionary;
import io.tesler.api.data.dto.DataResponseDTO;
import io.tesler.constgen.DtoField;
import io.tesler.core.dto.multivalue.MultivalueField;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import java.util.Arrays;
import java.util.stream.Collectors;
import javax.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class FieldsMetaHelper {

	private final ObjectMapper objectMapper;

	public <T extends DataResponseDTO, E extends Enum> void setEnumFilterValuesForMultivalue(
			@NonNull FieldsMeta<T> fieldsMeta, @Nullable DtoField<? super T, MultivalueField> field, E... values) {
		if (values == null) {
			throw new NullPointerException("values is marked non-null but is null");
		} else {
			if (field != null) {
				fieldsMeta.setConcreteFilterValues(
						field,
						Arrays.stream(values).map((en) -> new SimpleDictionary(en.name(), this.serialize(en)))
								.collect(Collectors.toList())
				);
			}

		}
	}

	public <T extends DataResponseDTO, E extends Enum> void setEnumValuesForMultivalue(RowDependentFieldsMeta fieldsMeta,
			@Nullable DtoField<? super T, MultivalueField> field,
			E... values) {
		if (values == null) {
			throw new NullPointerException("values is marked non-null but is null");
		} else {
			if (field != null) {
				fieldsMeta.setConcreteValues(field,
						Arrays.stream(values).map((en) -> new SimpleDictionary(en.name(), this.serialize(en)))
								.collect(Collectors.toList())
				);
			}

		}
	}

	@SneakyThrows
	String serialize(@NonNull Enum<?> en) {
		String serialize = this.objectMapper.writeValueAsString(en);
		return serialize.substring(1, serialize.length() - 1);
	}


}
