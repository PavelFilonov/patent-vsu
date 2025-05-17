package com.vsu.patent.service.agreement;

import static com.vsu.patent.controller.TeslerRestController.agreementEdit;
import static com.vsu.patent.dto.AgreementDTO_.additionalAgreement;
import static com.vsu.patent.dto.AgreementDTO_.agreementNumber;
import static com.vsu.patent.dto.AgreementDTO_.amount;
import static com.vsu.patent.dto.AgreementDTO_.endDate;
import static com.vsu.patent.dto.AgreementDTO_.licensee;
import static com.vsu.patent.dto.AgreementDTO_.licenseeContactInfo;
import static com.vsu.patent.dto.AgreementDTO_.note;
import static com.vsu.patent.dto.AgreementDTO_.number;
import static com.vsu.patent.dto.AgreementDTO_.parentAgreement;
import static com.vsu.patent.dto.AgreementDTO_.period;
import static com.vsu.patent.dto.AgreementDTO_.registrationNumber;
import static com.vsu.patent.dto.AgreementDTO_.signDate;
import static com.vsu.patent.dto.AgreementDTO_.subjectName;
import static com.vsu.patent.dto.AgreementDTO_.subjectNumber;
import static com.vsu.patent.dto.AgreementDTO_.subjectType;
import static com.vsu.patent.dto.AgreementDTO_.type;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.entity.enums.Status.DRAFT;
import static com.vsu.patent.service.util.PermissionHelper.EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.dto.rowmeta.PreActionType.CONFIRMATION;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.RECORD;

import com.vsu.patent.dto.AgreementDTO;
import com.vsu.patent.entity.Agreement;
import com.vsu.patent.repository.AgreementRepository;
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
public class AgreementEditService extends VersionAwareResponseService<AgreementDTO, Agreement> {

	private static final String LIST_URL = "/screen/registry/view/agreementlist/";

	@Autowired
	private AgreementRepository agreementRepository;

	public AgreementEditService() {
		super(AgreementDTO.class, Agreement.class, null, AgreementEditMeta.class);
	}

	@Override
	protected CreateResult<AgreementDTO> doCreateEntity(Agreement entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<AgreementDTO> doUpdateEntity(Agreement entity,
			AgreementDTO dto, BusinessComponent bc) {
		TeslerMapperUtil.setIfChanged(dto, number, entity::setNumber);
		TeslerMapperUtil.setIfChanged(dto, agreementNumber, entity::setAgreementNumber);
		TeslerMapperUtil.setIfChanged(dto, signDate, entity::setSignDate);
		TeslerMapperUtil.setIfChanged(dto, endDate, entity::setEndDate);
		TeslerMapperUtil.setIfChanged(dto, type, entity::setType);
		TeslerMapperUtil.setIfChanged(dto, subjectNumber, entity::setSubjectNumber);
		TeslerMapperUtil.setIfChanged(dto, subjectName, entity::setSubjectName);
		TeslerMapperUtil.setIfChanged(dto, subjectType, entity::setSubjectType);
		TeslerMapperUtil.setIfChanged(dto, period, entity::setPeriod);
		TeslerMapperUtil.setIfChanged(dto, amount, entity::setAmount);
		TeslerMapperUtil.setIfChanged(dto, licensee, entity::setLicensee);
		TeslerMapperUtil.setIfChanged(dto, additionalAgreement, entity::setAdditionalAgreement);
		TeslerMapperUtil.setIfChanged(dto, licenseeContactInfo, entity::setLicenseeContactInfo);
		TeslerMapperUtil.setIfChanged(dto, registrationNumber, entity::setRegistrationNumber);
		TeslerMapperUtil.setIfChanged(dto, parentAgreement, entity::setParentAgreement);
		TeslerMapperUtil.setIfChanged(dto, note, entity::setNote);
		agreementRepository.saveAndFlush(entity);
		return new ActionResultDTO<>(entityToDto(bc, entity));
	}

	@Override
	public Actions<AgreementDTO> getActions() {
		ActionsBuilder<AgreementDTO> builder = Actions.builder();
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
				.invoker((bc, data) -> new ActionResultDTO<AgreementDTO>().setAction(drillDown(INNER, LIST_URL)))
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					return entity.getEditStep().getPreviousStep() != null;
				}))
				.withAutoSaveBefore()
				.action("previous", "Назад")
				.invoker((bc, data) -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					var previousStep = entity.getEditStep().getPreviousStep();
					entity.setEditStep(previousStep);
					agreementRepository.saveAndFlush(entity);
					String url = previousStep.getEditView() + agreementEdit + "/" + bc.getId();
					return new ActionResultDTO<AgreementDTO>().setAction(drillDown(INNER, url));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					return entity.getEditStep().getNextStep() != null;
				}))
				.withAutoSaveBefore()
				.action("next", "Далее")
				.invoker((bc, data) -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					var nextStep = entity.getEditStep().getNextStep();
					entity.setEditStep(nextStep);
					agreementRepository.saveAndFlush(entity);
					String url = nextStep.getEditView() + agreementEdit + "/" + bc.getId();
					return new ActionResultDTO<AgreementDTO>().setAction(drillDown(INNER, url));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID))
				.withAutoSaveBefore()
				.action("saveAsDraft", "Сохранить как Черновик")
				.invoker((bc, data) -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					entity.setStatus(DRAFT);
					agreementRepository.saveAndFlush(entity);
					return new ActionResultDTO<AgreementDTO>().setAction(drillDown(INNER, LIST_URL));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					return entity.getEditStep().getNextStep() == null;
				}))
				.withAutoSaveBefore()
				.action("finish", "Сохранить")
				.invoker((bc, data) -> {
					var entity = agreementRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					agreementRepository.saveAndFlush(entity);
					return new ActionResultDTO<AgreementDTO>().setAction(drillDown(INNER, LIST_URL));
				})
				.add()

				.build();
	}

}
