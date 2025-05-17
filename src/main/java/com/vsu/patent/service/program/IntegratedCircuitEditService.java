package com.vsu.patent.service.program;

import static com.vsu.patent.controller.TeslerRestController.integratedCircuitEdit;

import com.vsu.patent.dto.ProgramDTO;
import com.vsu.patent.entity.Program;
import com.vsu.patent.repository.ProgramRepository;
import com.vsu.patent.service.helper.ProgramHelper;
import io.tesler.core.crudma.bc.BusinessComponent;
import io.tesler.core.crudma.impl.VersionAwareResponseService;
import io.tesler.core.dto.rowmeta.ActionResultDTO;
import io.tesler.core.dto.rowmeta.CreateResult;
import io.tesler.core.service.action.Actions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IntegratedCircuitEditService extends VersionAwareResponseService<ProgramDTO, Program> {

	private static final String LIST_URL = "/screen/registry/view/circuitlist/";

	@Autowired
	private ProgramRepository programRepository;

	@Autowired
	private ProgramHelper programHelper;

	public IntegratedCircuitEditService() {
		super(ProgramDTO.class, Program.class, null, IntegratedCircuitEditMeta.class);
	}

	@Override
	protected CreateResult<ProgramDTO> doCreateEntity(Program entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<ProgramDTO> doUpdateEntity(Program entity, ProgramDTO dto, BusinessComponent bc) {
		programHelper.updateFields(entity, dto);
		programRepository.saveAndFlush(entity);
		return new ActionResultDTO<>(entityToDto(bc, entity));
	}

	@Override
	public Actions<ProgramDTO> getActions() {
		return programHelper.buildEditActions(LIST_URL, integratedCircuitEdit);
	}

}
