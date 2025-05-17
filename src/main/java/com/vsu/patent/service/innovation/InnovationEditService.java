package com.vsu.patent.service.innovation;

import static com.vsu.patent.controller.TeslerRestController.innovationEdit;

import com.vsu.patent.dto.InnovationDTO;
import com.vsu.patent.entity.Innovation;
import com.vsu.patent.repository.InnovationRepository;
import com.vsu.patent.service.helper.InnovationHelper;
import io.tesler.core.crudma.bc.BusinessComponent;
import io.tesler.core.crudma.impl.VersionAwareResponseService;
import io.tesler.core.dto.rowmeta.ActionResultDTO;
import io.tesler.core.dto.rowmeta.CreateResult;
import io.tesler.core.service.action.Actions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InnovationEditService extends VersionAwareResponseService<InnovationDTO, Innovation> {

	private static final String LIST_URL = "/screen/registry/view/innovationlist/";

	@Autowired
	private InnovationRepository innovationRepository;
	
	@Autowired
	private InnovationHelper innovationHelper;

	public InnovationEditService() {
		super(InnovationDTO.class, Innovation.class, null, InnovationEditMeta.class);
	}

	@Override
	protected CreateResult<InnovationDTO> doCreateEntity(Innovation entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<InnovationDTO> doUpdateEntity(Innovation entity, InnovationDTO dto, BusinessComponent bc) {
		innovationHelper.updateFields(entity, dto);
		innovationRepository.saveAndFlush(entity);
		return new ActionResultDTO<>(entityToDto(bc, entity));
	}

	@Override
	public Actions<InnovationDTO> getActions() {
		return innovationHelper.buildEditActions(LIST_URL, innovationEdit);
	}

}
