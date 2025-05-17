package com.vsu.patent.service.agreement;

import static com.vsu.patent.controller.TeslerRestController.agreementEdit;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.entity.enums.Status.DRAFT;
import static com.vsu.patent.entity.enums.Status.INACTIVE;
import static com.vsu.patent.repository.AgreementRepository.isAvailableSpecification;
import static com.vsu.patent.service.util.PermissionHelper.EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.BC;
import static io.tesler.core.service.action.ActionScope.RECORD;
import static org.springframework.data.jpa.domain.Specification.where;

import com.vsu.patent.dto.AgreementDTO;
import com.vsu.patent.entity.Agreement;
import com.vsu.patent.repository.AgreementRepository;
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
public class AgreementReadService extends VersionAwareResponseService<AgreementDTO, Agreement> {

	@Autowired
	private AgreementRepository agreementRepository;

	public AgreementReadService() {
		super(AgreementDTO.class, Agreement.class, null, AgreementReadMeta.class);
	}

	@Override
	protected Specification<Agreement> getSpecification(BusinessComponent bc) {
		return where(super.getSpecification(bc))
				.and(isAvailableSpecification());
	}

	@Override
	protected CreateResult<AgreementDTO> doCreateEntity(Agreement entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<AgreementDTO> doUpdateEntity(Agreement entity,
			AgreementDTO data, BusinessComponent bc) {
		return null;
	}

	@Override
	public Actions<AgreementDTO> getActions() {
		ActionsBuilder<AgreementDTO> builder = Actions.builder();
		return builder

				.newAction()
				.scope(BC)
				.available(EMPLOYEE_PERMISSION)
				.withoutAutoSaveBefore()
				.withoutIcon()
				.action("create_agreement", "Добавить")
				.invoker((bc, data) -> {
					var entity = new Agreement();
					agreementRepository.saveAndFlush(entity);
					String url = entity.getEditStep().getEditView() + agreementEdit + "/" + entity.getId();
					return new ActionResultDTO<AgreementDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.PLUS, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("delete_agreement", "Удалить")
				.invoker((bc, data) -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					agreementRepository.delete(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.DELETE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("edit_agreement", "Редактировать")
				.invoker((bc, data) -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					String url = entity.getEditStep().getEditView() + agreementEdit + "/" + entity.getId();
					return new ActionResultDTO<AgreementDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.EDIT, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == ACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("deactivate_agreement", "Деактивировать")
				.invoker((bc, data) -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					entity.setStatus(INACTIVE);
					agreementRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CLOSE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == INACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("activate_agreement", "Активировать")
				.invoker((bc, data) -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					agreementRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CHECK, false)
				.add()

				.build();
	}

}
