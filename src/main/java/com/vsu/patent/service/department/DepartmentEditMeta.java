package com.vsu.patent.service.department;

import com.vsu.patent.dto.UniversityDepartmentDTO;
import com.vsu.patent.repository.UniversityFacultyRepository;
import io.tesler.api.data.dictionary.SimpleDictionary;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.vsu.patent.dto.UniversityDepartmentDTO_.facultyName;
import static com.vsu.patent.dto.UniversityDepartmentDTO_.name;
import static com.vsu.patent.repository.UniversityFacultyRepository.isActiveSpecification;
import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class DepartmentEditMeta extends FieldMetaBuilder<UniversityDepartmentDTO> {

	private final UniversityFacultyRepository facultyRepository;

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<UniversityDepartmentDTO> fields,
			InnerBcDescription bcDescription,
			Long id, Long parentId) {
		fields.setEnabled(name, facultyName);
		fields.setRequired(name, facultyName);
		fields.setPlaceholder(name, "Наименование кафедры");
		fields.setPlaceholder(facultyName, "Факультет");

		var faculties = facultyRepository.findAll(isActiveSpecification())
				.stream()
				.map(faculty -> new SimpleDictionary(faculty.getName(), faculty.getName()))
				.collect(toList());
		fields.setConcreteValues(facultyName, faculties);
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<UniversityDepartmentDTO> fields, InnerBcDescription bcDescription,
			Long parentId) {

	}

}
