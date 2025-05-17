package com.vsu.patent.service.faculty;

import com.vsu.patent.dto.UniversityFacultyDTO;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.vsu.patent.dto.UniversityFacultyDTO_.name;

@Service
@RequiredArgsConstructor
public class FacultyEditMeta extends FieldMetaBuilder<UniversityFacultyDTO> {

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<UniversityFacultyDTO> fields,
			InnerBcDescription bcDescription,
			Long id, Long parentId) {
		fields.setEnabled(name);
		fields.setRequired(name);
		fields.setPlaceholder(name, "Наименование факультета");
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<UniversityFacultyDTO> fields, InnerBcDescription bcDescription,
			Long parentId) {

	}

}
