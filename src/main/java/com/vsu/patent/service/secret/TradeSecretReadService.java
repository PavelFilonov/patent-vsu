package com.vsu.patent.service.secret;

import static com.vsu.patent.controller.TeslerRestController.tradeSecretEdit;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.entity.enums.Status.DRAFT;
import static com.vsu.patent.entity.enums.Status.INACTIVE;
import static com.vsu.patent.repository.TradeSecretRepository.isAvailableSpecification;
import static com.vsu.patent.service.util.PermissionHelper.EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.BC;
import static io.tesler.core.service.action.ActionScope.RECORD;
import static org.springframework.data.jpa.domain.Specification.where;

import com.vsu.patent.dto.TradeSecretDTO;
import com.vsu.patent.entity.TradeSecret;
import com.vsu.patent.repository.TradeSecretRepository;
import com.vsu.patent.service.enums.SmActionIconSpecifier;
import io.tesler.core.crudma.bc.BusinessComponent;
import io.tesler.core.crudma.impl.VersionAwareResponseService;
import io.tesler.core.dto.rowmeta.ActionResultDTO;
import io.tesler.core.dto.rowmeta.CreateResult;
import io.tesler.core.service.action.Actions;
import io.tesler.core.service.action.ActionsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class TradeSecretReadService extends VersionAwareResponseService<TradeSecretDTO, TradeSecret> {

	@Autowired
	private TradeSecretRepository tradeSecretRepository;

	public TradeSecretReadService() {
		super(TradeSecretDTO.class, TradeSecret.class, null, TradeSecretReadMeta.class);
	}

	@Override
	protected Specification<TradeSecret> getSpecification(BusinessComponent bc) {
		return where(super.getSpecification(bc))
				.and(isAvailableSpecification());
	}

	@Override
	protected CreateResult<TradeSecretDTO> doCreateEntity(TradeSecret entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<TradeSecretDTO> doUpdateEntity(TradeSecret entity,
			TradeSecretDTO data, BusinessComponent bc) {
		return null;
	}

	@Override
	public Actions<TradeSecretDTO> getActions() {
		ActionsBuilder<TradeSecretDTO> builder = Actions.builder();
		return builder

				.newAction()
				.scope(BC)
				.available(EMPLOYEE_PERMISSION)
				.withoutAutoSaveBefore()
				.withoutIcon()
				.action("create_trade_secret", "Добавить")
				.invoker((bc, data) -> {
					var entity = new TradeSecret();
					tradeSecretRepository.saveAndFlush(entity);
					String url = entity.getEditStep().getEditView() + tradeSecretEdit + "/" + entity.getId();
					return new ActionResultDTO<TradeSecretDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.PLUS, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = tradeSecretRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("delete_trade_secret", "Удалить")
				.invoker((bc, data) -> {
					var entity = tradeSecretRepository.getById(bc.getIdAsLong());
					tradeSecretRepository.delete(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.DELETE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = tradeSecretRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("edit_trade_secret", "Редактировать")
				.invoker((bc, data) -> {
					var entity = tradeSecretRepository.getById(bc.getIdAsLong());
					String url = entity.getEditStep().getEditView() + tradeSecretEdit + "/" + entity.getId();
					return new ActionResultDTO<TradeSecretDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.EDIT, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = tradeSecretRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == ACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("deactivate_trade_secret", "Деактивировать")
				.invoker((bc, data) -> {
					var entity = tradeSecretRepository.getById(bc.getIdAsLong());
					entity.setStatus(INACTIVE);
					tradeSecretRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CLOSE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = tradeSecretRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == INACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("activate_trade_secret", "Активировать")
				.invoker((bc, data) -> {
					var entity = tradeSecretRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					tradeSecretRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CHECK, false)
				.add()

				.build();
	}

}
