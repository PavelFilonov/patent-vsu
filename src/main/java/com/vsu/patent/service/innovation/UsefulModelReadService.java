package com.vsu.patent.service.innovation;

import com.vsu.patent.dto.InnovationDTO;
import com.vsu.patent.entity.Innovation;
import com.vsu.patent.service.helper.InnovationHelper;
import io.tesler.core.crudma.bc.BusinessComponent;
import io.tesler.core.crudma.impl.VersionAwareResponseService;
import io.tesler.core.dto.rowmeta.ActionResultDTO;
import io.tesler.core.dto.rowmeta.CreateResult;
import io.tesler.core.service.action.Actions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import static com.vsu.patent.controller.TeslerRestController.usefulModelEdit;
import static com.vsu.patent.controller.TeslerRestController.usefulModelRead;
import static com.vsu.patent.entity.enums.InnovationEntityType.USEFUL_MODEL;
import static com.vsu.patent.repository.InnovationRepository.isAvailableByEntityTypeSpecification;
import static com.vsu.patent.repository.InnovationRepository.isAvailableSpecification;
import static org.springframework.data.jpa.domain.Specification.where;

@Service
public class UsefulModelReadService extends VersionAwareResponseService<InnovationDTO, Innovation> {

	@Autowired
	private InnovationHelper innovationHelper;

	public UsefulModelReadService() {
		super(InnovationDTO.class, Innovation.class, null, UsefulModelReadMeta.class);
	}

	@Override
	protected Specification<Innovation> getSpecification(BusinessComponent bc) {
		return where(super.getSpecification(bc))
				.and(isAvailableSpecification())
				.and(isAvailableByEntityTypeSpecification(USEFUL_MODEL))
				.and(innovationHelper.isMyInnovationsSpecification(bc));
	}

	@Override
	protected CreateResult<InnovationDTO> doCreateEntity(Innovation entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<InnovationDTO> doUpdateEntity(Innovation entity, InnovationDTO data, BusinessComponent bc) {
		return null;
	}

	@Override
	public Actions<InnovationDTO> getActions() {
		return innovationHelper.buildReadActions(usefulModelEdit, usefulModelRead);
	}

}
