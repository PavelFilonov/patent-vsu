package com.vsu.patent.service.secret;

import static com.vsu.patent.dto.TradeSecretDTO_.documentDate;
import static com.vsu.patent.dto.TradeSecretDTO_.documentNumber;
import static com.vsu.patent.dto.TradeSecretDTO_.endDate;
import static com.vsu.patent.dto.TradeSecretDTO_.materialCarrier;
import static com.vsu.patent.dto.TradeSecretDTO_.mip;
import static com.vsu.patent.dto.TradeSecretDTO_.name;
import static com.vsu.patent.dto.TradeSecretDTO_.number;
import static com.vsu.patent.dto.TradeSecretDTO_.responsiblePerson;
import static com.vsu.patent.dto.TradeSecretDTO_.startDate;
import static com.vsu.patent.dto.TradeSecretDTO_.type;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.entity.enums.Status.DRAFT;
import static com.vsu.patent.service.util.PermissionHelper.EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.dto.rowmeta.PreActionType.CONFIRMATION;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.RECORD;

import com.vsu.patent.dto.TradeSecretDTO;
import com.vsu.patent.entity.TradeSecret;
import com.vsu.patent.repository.TradeSecretRepository;
import com.vsu.patent.service.tesler.extension.mapper.TeslerMapperUtil;
import io.tesler.core.crudma.bc.BusinessComponent;
import io.tesler.core.crudma.impl.VersionAwareResponseService;
import io.tesler.core.dto.rowmeta.ActionResultDTO;
import io.tesler.core.dto.rowmeta.CreateResult;
import io.tesler.core.dto.rowmeta.PreAction;
import io.tesler.core.service.action.Actions;
import io.tesler.core.service.action.ActionsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TradeSecretEditService extends VersionAwareResponseService<TradeSecretDTO, TradeSecret> {

	private static final String LIST_URL = "/screen/registry/view/tradesecretlist/";

	@Autowired
	private TradeSecretRepository tradeSecretRepository;

	public TradeSecretEditService() {
		super(TradeSecretDTO.class, TradeSecret.class, null, TradeSecretEditMeta.class);
	}

	@Override
	protected CreateResult<TradeSecretDTO> doCreateEntity(TradeSecret entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<TradeSecretDTO> doUpdateEntity(TradeSecret entity,
			TradeSecretDTO dto, BusinessComponent bc) {
		TeslerMapperUtil.setIfChanged(dto, number, entity::setNumber);
		TeslerMapperUtil.setIfChanged(dto, name, entity::setName);
		TeslerMapperUtil.setIfChanged(dto, type, entity::setType);
		TeslerMapperUtil.setIfChanged(dto, documentNumber, entity::setDocumentNumber);
		TeslerMapperUtil.setIfChanged(dto, documentDate, entity::setDocumentDate);
		TeslerMapperUtil.setIfChanged(dto, materialCarrier, entity::setMaterialCarrier);
		TeslerMapperUtil.setIfChanged(dto, responsiblePerson, entity::setResponsiblePerson);
		TeslerMapperUtil.setIfChanged(dto, startDate, entity::setStartDate);
		TeslerMapperUtil.setIfChanged(dto, endDate, entity::setEndDate);
		TeslerMapperUtil.setIfChanged(dto, mip, entity::setMip);
		tradeSecretRepository.saveAndFlush(entity);
		return new ActionResultDTO<>(entityToDto(bc, entity));
	}

	@Override
	public Actions<TradeSecretDTO> getActions() {
		ActionsBuilder<TradeSecretDTO> builder = Actions.builder();
		return builder
				.save()
				.add()

				.newAction()
				.scope(RECORD)
				.available(EMPLOYEE_PERMISSION)
				.withoutAutoSaveBefore()
				.action("cancel", "Отменить")
				.withPreAction(bc -> PreAction.builder()
						.preActionType(CONFIRMATION)
						.message("Вы действительно хотите отменить? Вся добавленная информация будет утеряна.")
						.build())
				.invoker((bc, data) -> new ActionResultDTO<TradeSecretDTO>().setAction(drillDown(INNER, LIST_URL)))
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID))
				.withAutoSaveBefore()
				.action("saveAsDraft", "Сохранить как Черновик")
				.invoker((bc, data) -> {
					var entity = tradeSecretRepository.getById(bc.getIdAsLong());
					entity.setStatus(DRAFT);
					tradeSecretRepository.saveAndFlush(entity);
					return new ActionResultDTO<TradeSecretDTO>().setAction(drillDown(INNER, LIST_URL));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID))
				.withAutoSaveBefore()
				.action("finish", "Сохранить")
				.invoker((bc, data) -> {
					var entity = tradeSecretRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					tradeSecretRepository.saveAndFlush(entity);
					return new ActionResultDTO<TradeSecretDTO>().setAction(drillDown(INNER, LIST_URL));
				})
				.add()

				.build();
	}

}
