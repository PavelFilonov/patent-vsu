package com.vsu.patent.service.program;

import com.vsu.patent.dto.ProgramDTO;
import com.vsu.patent.entity.Program;
import com.vsu.patent.service.helper.ProgramHelper;
import io.tesler.core.crudma.bc.BusinessComponent;
import io.tesler.core.crudma.impl.VersionAwareResponseService;
import io.tesler.core.dto.rowmeta.ActionResultDTO;
import io.tesler.core.dto.rowmeta.CreateResult;
import io.tesler.core.service.action.Actions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import static com.vsu.patent.controller.TeslerRestController.databaseEdit;
import static com.vsu.patent.controller.TeslerRestController.databaseRead;
import static com.vsu.patent.entity.enums.ProgramEntityType.DATABASE;
import static com.vsu.patent.repository.ProgramRepository.isAvailableByEntityTypeSpecification;
import static com.vsu.patent.repository.ProgramRepository.isAvailableSpecification;
import static org.springframework.data.jpa.domain.Specification.where;

@Service
public class DatabaseReadService extends VersionAwareResponseService<ProgramDTO, Program> {

	@Autowired
	private ProgramHelper programHelper;

	public DatabaseReadService() {
		super(ProgramDTO.class, Program.class, null, DatabaseReadMeta.class);
	}

	@Override
	protected Specification<Program> getSpecification(BusinessComponent bc) {
		return where(super.getSpecification(bc))
				.and(isAvailableSpecification())
				.and(isAvailableByEntityTypeSpecification(DATABASE))
				.and(programHelper.isMyProgramsSpecification(bc));
	}

	@Override
	protected CreateResult<ProgramDTO> doCreateEntity(Program entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<ProgramDTO> doUpdateEntity(Program entity,
			ProgramDTO data, BusinessComponent bc) {
		return null;
	}

	@Override
	public Actions<ProgramDTO> getActions() {
		return programHelper.buildReadActions(databaseEdit, databaseRead);
	}

}
