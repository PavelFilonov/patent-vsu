package com.vsu.patent.service.department;

import static com.vsu.patent.controller.TeslerRestController.departmentRead;
import static com.vsu.patent.dto.UniversityDepartmentDTO_.*;
import static com.vsu.patent.entity.enums.Status.FILTER_STATUSES;
import static com.vsu.patent.repository.UniversityFacultyRepository.isActiveSpecification;
import static io.tesler.core.dto.DrillDownType.INNER;
import static java.util.stream.Collectors.toList;

import com.vsu.patent.dto.UniversityDepartmentDTO;
import com.vsu.patent.repository.UniversityFacultyRepository;
import io.tesler.api.data.dictionary.SimpleDictionary;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DepartmentReadMeta extends FieldMetaBuilder<UniversityDepartmentDTO> {

	private final UniversityFacultyRepository facultyRepository;

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<UniversityDepartmentDTO> fields, InnerBcDescription bcDescription,
			Long id, Long parentId) {
		String url = "/screen/administration/view/departmentinfo/" + departmentRead + "/" + id;
		fields.setDrilldown(name, INNER, url);	
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<UniversityDepartmentDTO> fields, InnerBcDescription bcDescription, Long parentId) {
		buildFilters(fields);
	}

	private void buildFilters(FieldsMeta<UniversityDepartmentDTO> fields) {
		fields.enableFilter(name, status, facultyName);
		fields.setEnumFilterValues(fields, status, FILTER_STATUSES);

		var faculties = facultyRepository.findAll(isActiveSpecification())
				.stream()
				.map(faculty -> new SimpleDictionary(faculty.getName(), faculty.getName()))
				.collect(toList());
		fields.setConcreteFilterValues(facultyName, faculties);
	}

}
