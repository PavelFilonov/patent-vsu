package com.vsu.patent.service.program;

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
public class DatabaseEditMeta extends FieldMetaBuilder<ProgramDTO> {
	
	private final ProgramHelper programHelper;

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<ProgramDTO> fields,
			InnerBcDescription bcDescription,
			Long id, Long parentId) {
		programHelper.buildEditRowDependentMeta(fields);
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<ProgramDTO> fields, InnerBcDescription bcDescription,
			Long parentId) {
	}

}
