package com.vsu.patent.service.helper;

import static com.vsu.patent.dto.InnovationDTO_.action;
import static com.vsu.patent.dto.InnovationDTO_.authors;
import static com.vsu.patent.dto.InnovationDTO_.decisionDate;
import static com.vsu.patent.dto.InnovationDTO_.editStep;
import static com.vsu.patent.dto.InnovationDTO_.expertiseRequests;
import static com.vsu.patent.dto.InnovationDTO_.formalDecisionNotificationDate;
import static com.vsu.patent.dto.InnovationDTO_.isMyInnovations;
import static com.vsu.patent.dto.InnovationDTO_.name;
import static com.vsu.patent.dto.InnovationDTO_.note;
import static com.vsu.patent.dto.InnovationDTO_.number;
import static com.vsu.patent.dto.InnovationDTO_.outgoingNumber;
import static com.vsu.patent.dto.InnovationDTO_.patentNumber;
import static com.vsu.patent.dto.InnovationDTO_.petition;
import static com.vsu.patent.dto.InnovationDTO_.petitionDuties;
import static com.vsu.patent.dto.InnovationDTO_.petitionNotificationDate;
import static com.vsu.patent.dto.InnovationDTO_.priorityDate;
import static com.vsu.patent.dto.InnovationDTO_.registrationDate;
import static com.vsu.patent.dto.InnovationDTO_.requestNumber;
import static com.vsu.patent.dto.InnovationDTO_.status;
import static com.vsu.patent.dto.InnovationDTO_.submissionDate;
import static com.vsu.patent.dto.InnovationDTO_.usage;
import static com.vsu.patent.entity.enums.InnovationEntityType.getInnovationEntityTypeByEditBc;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.entity.enums.Status.DRAFT;
import static com.vsu.patent.entity.enums.Status.FILTER_STATUSES;
import static com.vsu.patent.entity.enums.Status.INACTIVE;
import static com.vsu.patent.repository.InnovationRepository.authorSpecification;
import static com.vsu.patent.service.util.PermissionHelper.EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.dto.rowmeta.PreActionType.CONFIRMATION;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.BC;
import static io.tesler.core.service.action.ActionScope.RECORD;
import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;
import static java.lang.Boolean.valueOf;
import static java.util.stream.Collectors.toList;

import com.vsu.patent.controller.TeslerRestController;
import com.vsu.patent.dto.InnovationDTO;
import com.vsu.patent.entity.Innovation;
import com.vsu.patent.entity.UserInnovation;
import com.vsu.patent.entity.UserInnovation_;
import com.vsu.patent.entity.enums.InnovationEditStep;
import com.vsu.patent.repository.InnovationRepository;
import com.vsu.patent.repository.SmUserRepository;
import com.vsu.patent.repository.UserInnovationRepository;
import com.vsu.patent.service.enums.SmActionIconSpecifier;
import com.vsu.patent.service.tesler.extension.mapper.TeslerMapperUtil;
import io.tesler.api.data.dictionary.SimpleDictionary;
import io.tesler.core.crudma.bc.BusinessComponent;
import io.tesler.core.dto.multivalue.MultivalueFieldSingleValue;
import io.tesler.core.dto.rowmeta.ActionResultDTO;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.PreAction;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.action.Actions;
import io.tesler.core.service.action.ActionsBuilder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import javax.persistence.criteria.Predicate;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InnovationHelper {
	
	private final InnovationRepository innovationRepository;

	private final UserInnovationRepository userInnovationRepository;

	private final SmUserRepository userRepository;
	
	public void updateFields(@NonNull Innovation entity, @NonNull InnovationDTO dto) {
		TeslerMapperUtil.setIfChanged(dto, name, entity::setName);
		TeslerMapperUtil.setIfChanged(dto, number, entity::setNumber);
		TeslerMapperUtil.setIfChanged(dto, patentNumber, entity::setPatentNumber);
		TeslerMapperUtil.setIfChanged(dto, registrationDate, entity::setRegistrationDate);
		TeslerMapperUtil.setIfChanged(dto, priorityDate, entity::setPriorityDate);
		TeslerMapperUtil.setIfChanged(dto, decisionDate, entity::setDecisionDate);
		TeslerMapperUtil.setIfChanged(dto, requestNumber, entity::setRequestNumber);
		TeslerMapperUtil.setIfChanged(dto, submissionDate, entity::setSubmissionDate);
		TeslerMapperUtil.setIfChanged(dto, outgoingNumber, entity::setOutgoingNumber);
		TeslerMapperUtil.setIfChanged(dto, note, entity::setNote);
		TeslerMapperUtil.setIfChanged(dto, action, entity::setAction);
		TeslerMapperUtil.setIfChanged(dto, usage, entity::setUsage);
		TeslerMapperUtil.setIfChanged(dto, petition, entity::setPetition);
		TeslerMapperUtil.setIfChanged(dto, expertiseRequests, entity::setExpertiseRequests);
		TeslerMapperUtil.setIfChanged(dto, petitionDuties, entity::setPetitionDuties);
		TeslerMapperUtil.setIfChanged(dto, formalDecisionNotificationDate, entity::setFormalDecisionNotificationDate);
		TeslerMapperUtil.setIfChanged(dto, petitionNotificationDate, entity::setPetitionNotificationDate);
		TeslerMapperUtil.setIfChanged(dto, authors, data -> {
			if (data != null) {
				var logins = data.getValues().stream()
						.map(MultivalueFieldSingleValue::getValue)
						.filter(Objects::nonNull)
						.map(s -> s.split("\\(")[1].split("\\)")[0])
						.filter(Objects::nonNull)
						.distinct()
						.collect(toList());
				var authorList = new ArrayList<UserInnovation>();
				var existingAuthors = new ArrayList<UserInnovation>();
				userRepository.findAllAuthorsByLogins(logins)
						.forEach(user -> {
							var existingAuthor = userInnovationRepository.findAllByUserAndInnovationAndIsActive(user, entity, TRUE);
							if (existingAuthor.isEmpty()) {
								var userInnovation = new UserInnovation();
								userInnovation.setInnovation(entity);
								userInnovation.setUser(user);
								authorList.add(userInnovation);
							} else {
								existingAuthors.addAll(existingAuthor);
							}
						});
				userInnovationRepository.saveAllAndFlush(authorList);
				var deleteAuthors = userInnovationRepository.findAll((root, query, cb) -> {
					List<Predicate> predicates = new ArrayList<>();
					predicates.add(cb.equal(root.get(UserInnovation_.INNOVATION), entity));
					var ids1 = authorList.stream().map(UserInnovation::getId).collect(toList());
					var ids2 = existingAuthors.stream().map(UserInnovation::getId).collect(toList());
					if (!ids1.isEmpty()) {
						predicates.add(cb.not(cb.in(root.get(UserInnovation_.ID)).value(ids1)));
					}
					if (!ids2.isEmpty()) {
						predicates.add(cb.not(cb.in(root.get(UserInnovation_.ID)).value(ids2)));
					}
					return cb.and(predicates.toArray(Predicate[]::new));
				});
				deactivateAuthors(deleteAuthors);
			} else {
				deactivateAuthors(userInnovationRepository.findAllByInnovation(entity));
			}
		});
	}

	private void deactivateAuthors(List<UserInnovation> authors) {
		authors.forEach(author -> author.setIsActive(FALSE));
		userInnovationRepository.saveAllAndFlush(authors);
	}
	
	public Actions<InnovationDTO> buildEditActions(String listUrl, TeslerRestController editBc) {
		ActionsBuilder<InnovationDTO> builder = Actions.builder();
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
				.invoker((bc, data) -> new ActionResultDTO<InnovationDTO>().setAction(drillDown(INNER, listUrl)))
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					return entity.getEditStep().getPreviousStep() != null;
				}))
				.withAutoSaveBefore()
				.action("previous", "Назад")
				.invoker((bc, data) -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					var previousStep = entity.getEditStep().getPreviousStep();
					entity.setEditStep(previousStep);
					innovationRepository.saveAndFlush(entity);
					String url = previousStep.getEditView(editBc) + editBc + "/" + bc.getId();
					return new ActionResultDTO<InnovationDTO>().setAction(drillDown(INNER, url));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					return entity.getEditStep().getNextStep() != null;
				}))
				.withAutoSaveBefore()
				.action("next", "Далее")
				.invoker((bc, data) -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					var nextStep = entity.getEditStep().getNextStep();
					entity.setEditStep(nextStep);
					innovationRepository.saveAndFlush(entity);
					String url = nextStep.getEditView(editBc) + editBc + "/" + bc.getId();
					return new ActionResultDTO<InnovationDTO>().setAction(drillDown(INNER, url));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID))
				.withAutoSaveBefore()
				.action("saveAsDraft", "Сохранить как Черновик")
				.invoker((bc, data) -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					entity.setStatus(DRAFT);
					innovationRepository.saveAndFlush(entity);
					return new ActionResultDTO<InnovationDTO>().setAction(drillDown(INNER, listUrl));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					return entity.getEditStep().getNextStep() == null;
				}))
				.withAutoSaveBefore()
				.action("finish", "Сохранить")
				.invoker((bc, data) -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					innovationRepository.saveAndFlush(entity);
					return new ActionResultDTO<InnovationDTO>().setAction(drillDown(INNER, listUrl));
				})
				.add()

				.build();
	}

	public Actions<InnovationDTO> buildReadActions(TeslerRestController editBc, TeslerRestController readBc) {
		ActionsBuilder<InnovationDTO> builder = Actions.builder();
		return builder

				.newAction()
				.scope(BC)
				.available(EMPLOYEE_PERMISSION)
				.withoutAutoSaveBefore()
				.withoutIcon()
				.action("create_innovation", "Добавить")
				.invoker((bc, data) -> {
					var entity = new Innovation();
					entity.setEntityType(getInnovationEntityTypeByEditBc(editBc));
					innovationRepository.saveAndFlush(entity);
					String url = entity.getEditStep().getEditView(editBc) + editBc + "/" + entity.getId();
					return new ActionResultDTO<InnovationDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.PLUS, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("delete_innovation", "Удалить")
				.invoker((bc, data) -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					innovationRepository.delete(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.DELETE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("edit_innovation", "Редактировать")
				.invoker((bc, data) -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					String url = entity.getEditStep().getEditView(editBc) + editBc + "/" + entity.getId();
					return new ActionResultDTO<InnovationDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.EDIT, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == ACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("deactivate_innovation", "Деактивировать")
				.invoker((bc, data) -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					entity.setStatus(INACTIVE);
					innovationRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CLOSE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == INACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("activate_innovation", "Активировать")
				.invoker((bc, data) -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					innovationRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CHECK, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID, bc -> innovationRepository.isAvailableForAuthor(bc.getIdAsLong())))
				.withoutAutoSaveBefore()
				.action("open_innovation", "Посмотреть подробнее")
				.invoker((bc, data) -> {
					var entity = innovationRepository.getById(bc.getIdAsLong());
					String url = entity.getEditStep().getInfoView(readBc) + readBc + "/" + entity.getId();
					return new ActionResultDTO<InnovationDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.INFO, false)
				.add()

				.build();
	}
	
	public void buildEditRowDependentMeta(RowDependentFieldsMeta<InnovationDTO> fields) {
		fields.setEnabled(
				name,
				number,
				patentNumber,
				registrationDate,
				priorityDate,
				decisionDate,
				requestNumber,
				submissionDate,
				outgoingNumber,
				note,
				action,
				usage,
				petition,
				expertiseRequests,
				petitionDuties,
				formalDecisionNotificationDate,
				petitionNotificationDate,
				authors
		);

		var authorsList = userRepository.findAllAuthors().stream()
				.map(user -> new SimpleDictionary(user.getFullNameWithLogin(), user.getFullNameWithLogin()))
				.collect(toList());
		fields.setConcreteValues(authors, authorsList);
		
		buildStepper(fields);
		setPlaceholders(fields);
	}

	private void buildStepper(RowDependentFieldsMeta<InnovationDTO> fields) {
		fields.setEnabled(editStep);
		fields.setDictionaryTypeWithCustomValues(editStep, Arrays.stream(InnovationEditStep.values())
				.map(InnovationEditStep::getStepName).toArray(String[]::new));
	}

	private void setPlaceholders(RowDependentFieldsMeta<InnovationDTO> fields) {
		fields.setPlaceholder(name, "Наименование");
		fields.setPlaceholder(number, "Дело №");
		fields.setPlaceholder(patentNumber, "№ патента");
		fields.setPlaceholder(registrationDate, "Дата государственной регистрации");
		fields.setPlaceholder(priorityDate, "Дата приоритета патента");
		fields.setPlaceholder(decisionDate, "Решение о выдаче патента");
		fields.setPlaceholder(requestNumber, "№ заявки");
		fields.setPlaceholder(submissionDate, "Дата подачи заявки");
		fields.setPlaceholder(outgoingNumber, "Исходящий номер");
		fields.setPlaceholder(note, "Примечания");
		fields.setPlaceholder(action, "Действие");
		fields.setPlaceholder(usage, "Использование");
		fields.setPlaceholder(petition, "Ходатайство об экспертизе по существу");
		fields.setPlaceholder(expertiseRequests, "Запросы экспертизы");
		fields.setPlaceholder(petitionDuties, "Ходатайство о начислении пошлин в уменьшенном размере");
		fields.setPlaceholder(formalDecisionNotificationDate, "Уведомление о решении формальной экспертизы");
		fields.setPlaceholder(petitionNotificationDate, "Уведомление о рассмотрении ход-ва о проведении экспертизы по существу");
		fields.setPlaceholder(authors, "ФИО авторов");
	}

	public void buildFilters(FieldsMeta<InnovationDTO> fields) {
		fields.enableFilter(name, status, number, patentNumber, requestNumber, outgoingNumber, isMyInnovations);
		fields.setEnumFilterValues(fields, status, FILTER_STATUSES);
	}

	public Specification<Innovation> isMyInnovationsSpecification(BusinessComponent bc) {
		String isMyInnovations = bc.getParameters().getParameters().get("isMyInnovations.specified");
		return isMyInnovations != null && TRUE.equals(valueOf(isMyInnovations))
				? authorSpecification()
				: null;
	}

}
