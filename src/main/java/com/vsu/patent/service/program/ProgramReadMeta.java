package com.vsu.patent.service.program;

import static com.vsu.patent.controller.TeslerRestController.programRead;
import static com.vsu.patent.dto.ProgramDTO_.name;
import static com.vsu.patent.service.util.PermissionHelper.IS_EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;

import com.vsu.patent.dto.ProgramDTO;
import com.vsu.patent.service.helper.ProgramHelper;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProgramReadMeta extends FieldMetaBuilder<ProgramDTO> {
	
	private final ProgramHelper programHelper;

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<ProgramDTO> fields, InnerBcDescription bcDescription,
			Long id, Long parentId) {
		if (IS_EMPLOYEE_PERMISSION()) {
			String url = "/screen/registry/view/programinfo/" + programRead + "/" + id;
			fields.setDrilldown(name, INNER, url);
		}
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<ProgramDTO> fields, InnerBcDescription bcDescription, Long parentId) {
		programHelper.buildFilters(fields);
	}

}
