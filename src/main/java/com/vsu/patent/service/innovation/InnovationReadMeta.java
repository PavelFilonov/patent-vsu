package com.vsu.patent.service.innovation;

import static com.vsu.patent.controller.TeslerRestController.innovationRead;
import static com.vsu.patent.dto.InnovationDTO_.number;
import static com.vsu.patent.service.util.PermissionHelper.IS_EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;

import com.vsu.patent.dto.InnovationDTO;
import com.vsu.patent.service.helper.InnovationHelper;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InnovationReadMeta extends FieldMetaBuilder<InnovationDTO> {
	
	private final InnovationHelper innovationHelper;

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<InnovationDTO> fields, InnerBcDescription bcDescription,
			Long id, Long parentId) {
		if (IS_EMPLOYEE_PERMISSION()) {
			String url = "/screen/registry/view/innovationinfo/" + innovationRead + "/" + id;
			fields.setDrilldown(number, INNER, url);
		}
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<InnovationDTO> fields, InnerBcDescription bcDescription, Long parentId) {
		innovationHelper.buildFilters(fields);
	}

}
