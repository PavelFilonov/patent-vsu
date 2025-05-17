package com.vsu.patent.service.innovation;

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
public class InnovationEditMeta extends FieldMetaBuilder<InnovationDTO> {
	
	private final InnovationHelper innovationHelper;

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<InnovationDTO> fields,
			InnerBcDescription bcDescription,
			Long id, Long parentId) {
		innovationHelper.buildEditRowDependentMeta(fields);
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<InnovationDTO> fields, InnerBcDescription bcDescription,
			Long parentId) {
	}

}
