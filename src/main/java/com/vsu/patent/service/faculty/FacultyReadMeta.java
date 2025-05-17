package com.vsu.patent.service.faculty;

import com.vsu.patent.dto.UniversityFacultyDTO;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import org.springframework.stereotype.Service;

import static com.vsu.patent.controller.TeslerRestController.facultyRead;
import static com.vsu.patent.dto.UniversityFacultyDTO_.name;
import static com.vsu.patent.dto.UniversityFacultyDTO_.status;
import static com.vsu.patent.entity.enums.Status.FILTER_STATUSES;
import static io.tesler.core.dto.DrillDownType.INNER;

@Service
public class FacultyReadMeta extends FieldMetaBuilder<UniversityFacultyDTO> {

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<UniversityFacultyDTO> fields, InnerBcDescription bcDescription,
			Long id, Long parentId) {
		String url = "/screen/administration/view/facultyinfo/" + facultyRead + "/" + id;
		fields.setDrilldown(name, INNER, url);	
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<UniversityFacultyDTO> fields, InnerBcDescription bcDescription, Long parentId) {
		buildFilters(fields);
	}

	private void buildFilters(FieldsMeta<UniversityFacultyDTO> fields) {
		fields.enableFilter(name, status);
		fields.setEnumFilterValues(fields, status, FILTER_STATUSES);
	}

}
