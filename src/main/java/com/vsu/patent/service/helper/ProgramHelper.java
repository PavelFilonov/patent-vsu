package com.vsu.patent.service.helper;

import com.vsu.patent.controller.TeslerRestController;
import com.vsu.patent.dto.ProgramDTO;
import com.vsu.patent.entity.Program;
import com.vsu.patent.entity.UserProgram;
import com.vsu.patent.entity.UserProgram_;
import com.vsu.patent.entity.enums.ProgramEditStep;
import com.vsu.patent.repository.*;
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
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static com.vsu.patent.dto.ProgramDTO_.*;
import static com.vsu.patent.entity.enums.ProgramEntityType.getProgramEntityTypeByEditBc;
import static com.vsu.patent.entity.enums.Status.*;
import static com.vsu.patent.repository.ProgramRepository.authorSpecification;
import static com.vsu.patent.repository.UniversityDepartmentRepository.byNameSpecification;
import static com.vsu.patent.repository.UniversityDepartmentRepository.isActiveSpecification;
import static com.vsu.patent.service.util.PermissionHelper.EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.dto.rowmeta.PreActionType.CONFIRMATION;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.BC;
import static io.tesler.core.service.action.ActionScope.RECORD;
import static java.lang.Boolean.valueOf;
import static java.lang.Boolean.*;
import static java.util.stream.Collectors.toList;
import static org.springframework.data.jpa.domain.Specification.where;

@Service
@RequiredArgsConstructor
public class ProgramHelper {
	
	private final ProgramRepository programRepository;

	private final UniversityDepartmentRepository universityDepartmentRepository;
	
	private final UserProgramRepository userProgramRepository;
	
	private final SmUserRepository userRepository;

	private final UniversityFacultyRepository facultyRepository;

	public void updateFields(@NonNull Program entity, @NonNull ProgramDTO dto) {
		TeslerMapperUtil.setIfChanged(dto, name, entity::setName);
		TeslerMapperUtil.setIfChanged(dto, registrationPlace, entity::setRegistrationPlace);
		TeslerMapperUtil.setIfChanged(dto, registrationDate, entity::setRegistrationDate);
		TeslerMapperUtil.setIfChanged(dto, certificateNumber, entity::setCertificateNumber);
		TeslerMapperUtil.setIfChanged(dto, sendDocumentDate, entity::setSendDocumentDate);
		TeslerMapperUtil.setIfChanged(dto, note, entity::setNote);
		TeslerMapperUtil.setIfChanged(dto, notificationCreationDate, entity::setNotificationCreationDate);
		TeslerMapperUtil.setIfChanged(dto, requestNumber, entity::setRequestNumber);
		TeslerMapperUtil.setIfChanged(dto, ownersCopyright, entity::setOwnersCopyright);
		TeslerMapperUtil.setIfChanged(dto, departmentName, data ->
				universityDepartmentRepository.findOne(where(byNameSpecification(data)).and(isActiveSpecification()))
						.ifPresent(entity::setDepartment));
		TeslerMapperUtil.setIfChanged(dto, authors, data -> {
			if (data != null) {
				var logins = data.getValues().stream()
						.map(MultivalueFieldSingleValue::getValue)
						.filter(Objects::nonNull)
						.map(s -> s.split("\\(")[1].split("\\)")[0])
						.filter(Objects::nonNull)
						.distinct()
						.collect(toList());
				var authorList = new ArrayList<UserProgram>();
				var existingAuthors = new ArrayList<UserProgram>();
				userRepository.findAllAuthorsByLogins(logins)
						.forEach(user -> {
							var existingAuthor = userProgramRepository.findAllByUserAndProgramAndIsActive(user, entity, TRUE);
							if (existingAuthor.isEmpty()) {
								var userProgram = new UserProgram();
								userProgram.setProgram(entity);
								userProgram.setUser(user);
								authorList.add(userProgram);
							} else {
								existingAuthors.addAll(existingAuthor);
							}
						});
				userProgramRepository.saveAllAndFlush(authorList);
				var deleteAuthors = userProgramRepository.findAll((root, query, cb) -> {
					List<Predicate> predicates = new ArrayList<>();
					predicates.add(cb.equal(root.get(UserProgram_.PROGRAM), entity));
					var ids1 = authorList.stream().map(UserProgram::getId).collect(toList());
					var ids2 = existingAuthors.stream().map(UserProgram::getId).collect(toList());
					if (!ids1.isEmpty()) {
						predicates.add(cb.not(cb.in(root.get(UserProgram_.ID)).value(ids1)));
					}
					if (!ids2.isEmpty()) {
						predicates.add(cb.not(cb.in(root.get(UserProgram_.ID)).value(ids2)));
					}
					return cb.and(predicates.toArray(Predicate[]::new));
				});
				deactivateAuthors(deleteAuthors);
			} else {
				deactivateAuthors(userProgramRepository.findAllByProgram(entity));
			}
		});
	}
	
	private void deactivateAuthors(List<UserProgram> authors) {
		authors.forEach(author -> author.setIsActive(FALSE));
		userProgramRepository.saveAllAndFlush(authors);
	}

	public Actions<ProgramDTO> buildEditActions(String listUrl, TeslerRestController editBc) {
		ActionsBuilder<ProgramDTO> builder = Actions.builder();
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
				.invoker((bc, data) -> new ActionResultDTO<ProgramDTO>().setAction(drillDown(INNER, listUrl)))
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					return entity.getEditStep().getPreviousStep() != null;
				}))
				.withAutoSaveBefore()
				.action("previous", "Назад")
				.invoker((bc, data) -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					var previousStep = entity.getEditStep().getPreviousStep();
					entity.setEditStep(previousStep);
					programRepository.saveAndFlush(entity);
					String url = previousStep.getEditView(editBc) + editBc + "/" + bc.getId();
					return new ActionResultDTO<ProgramDTO>().setAction(drillDown(INNER, url));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					return entity.getEditStep().getNextStep() != null;
				}))
				.withAutoSaveBefore()
				.action("next", "Далее")
				.invoker((bc, data) -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					var nextStep = entity.getEditStep().getNextStep();
					entity.setEditStep(nextStep);
					programRepository.saveAndFlush(entity);
					String url = nextStep.getEditView(editBc) + editBc + "/" + bc.getId();
					return new ActionResultDTO<ProgramDTO>().setAction(drillDown(INNER, url));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID))
				.withAutoSaveBefore()
				.action("saveAsDraft", "Сохранить как Черновик")
				.invoker((bc, data) -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					entity.setStatus(DRAFT);
					programRepository.saveAndFlush(entity);
					return new ActionResultDTO<ProgramDTO>().setAction(drillDown(INNER, listUrl));
				})
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					return entity.getEditStep().getNextStep() == null;
				}))
				.withAutoSaveBefore()
				.action("finish", "Сохранить")
				.invoker((bc, data) -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					programRepository.saveAndFlush(entity);
					return new ActionResultDTO<ProgramDTO>().setAction(drillDown(INNER, listUrl));
				})
				.add()

				.build();
	}

	public Actions<ProgramDTO> buildReadActions(TeslerRestController editBc, TeslerRestController readBc) {
		ActionsBuilder<ProgramDTO> builder = Actions.builder();
		return builder

				.newAction()
				.scope(BC)
				.available(EMPLOYEE_PERMISSION)
				.withoutAutoSaveBefore()
				.withoutIcon()
				.action("create_program", "Добавить")
				.invoker((bc, data) -> {
					var entity = new Program();
					entity.setEntityType(getProgramEntityTypeByEditBc(editBc));
					programRepository.saveAndFlush(entity);
					String url = entity.getEditStep().getEditView(editBc) + editBc + "/" + entity.getId();
					return new ActionResultDTO<ProgramDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.PLUS, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("delete_program", "Удалить")
				.invoker((bc, data) -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					programRepository.delete(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.DELETE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("edit_program", "Редактировать")
				.invoker((bc, data) -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					String url = entity.getEditStep().getEditView(editBc) + editBc + "/" + entity.getId();
					return new ActionResultDTO<ProgramDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.EDIT, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == ACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("deactivate_program", "Деактивировать")
				.invoker((bc, data) -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					entity.setStatus(INACTIVE);
					programRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CLOSE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == INACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("activate_program", "Активировать")
				.invoker((bc, data) -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					programRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CHECK, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(NOT_NULL_ID, bc -> programRepository.isAvailableForAuthor(bc.getIdAsLong())))
				.withoutAutoSaveBefore()
				.action("open_program", "Посмотреть подробнее")
				.invoker((bc, data) -> {
					var entity = programRepository.getById(bc.getIdAsLong());
					String url = entity.getEditStep().getInfoView(readBc) + readBc + "/" + entity.getId();
					return new ActionResultDTO<ProgramDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.INFO, false)
				.add()

				.build();
	}

	public void buildEditRowDependentMeta(RowDependentFieldsMeta<ProgramDTO> fields) {
		fields.setEnabled(
				name,
				registrationPlace,
				registrationDate,
				certificateNumber,
				departmentName,
				sendDocumentDate,
				note,
				notificationCreationDate,
				requestNumber,
				ownersCopyright,
				authors
		);

		var departments = universityDepartmentRepository.findAll(isActiveSpecification())
				.stream()
				.map(department -> new SimpleDictionary(department.getName(), department.getName()))
				.collect(toList());
		fields.setConcreteValues(departmentName, departments);
		
		var authorsList = userRepository.findAllAuthors().stream()
				.map(user -> new SimpleDictionary(user.getFullNameWithLogin(), user.getFullNameWithLogin()))
				.collect(toList());
		fields.setConcreteValues(authors, authorsList);
		
		buildStepper(fields);
		setPlaceholders(fields);
	}

	private void buildStepper(RowDependentFieldsMeta<ProgramDTO> fields) {
		fields.setEnabled(editStep);
		fields.setDictionaryTypeWithCustomValues(editStep, Arrays.stream(ProgramEditStep.values())
				.map(ProgramEditStep::getStepName).toArray(String[]::new));
	}

	private void setPlaceholders(RowDependentFieldsMeta<ProgramDTO> fields) {
		fields.setPlaceholder(name, "Наименование");
		fields.setPlaceholder(registrationPlace, "Где зарегистрировано");
		fields.setPlaceholder(registrationDate, "Дата регистрации");
		fields.setPlaceholder(certificateNumber, "№ регистрационного свидетельства");
		fields.setPlaceholder(departmentName, "Кафедра");
		fields.setPlaceholder(sendDocumentDate, "Дата направления документов");
		fields.setPlaceholder(note, "Примечание");
		fields.setPlaceholder(notificationCreationDate, "Дата уведомления о создании объекта");
		fields.setPlaceholder(requestNumber, "№ заявки");
		fields.setPlaceholder(ownersCopyright, "Обладатели имущественных авторских прав");
		fields.setPlaceholder(authors, "ФИО авторов");
	}

	public void buildFilters(FieldsMeta<ProgramDTO> fields) {
		fields.enableFilter(name, status, certificateNumber, departmentName, requestNumber, isMyPrograms, facultyName);
		fields.setEnumFilterValues(fields, status, FILTER_STATUSES);
		var departments = universityDepartmentRepository.findAll(isActiveSpecification())
				.stream()
				.map(department -> new SimpleDictionary(department.getName(), department.getName()))
				.collect(toList());
		fields.setConcreteFilterValues(departmentName, departments);
		var faculties = facultyRepository.findAll(UniversityFacultyRepository.isActiveSpecification())
				.stream()
				.map(faculty -> new SimpleDictionary(faculty.getName(), faculty.getName()))
				.collect(toList());
		fields.setConcreteFilterValues(facultyName, faculties);
	}
	
	public Specification<Program> isMyProgramsSpecification(BusinessComponent bc) {
		String isMyPrograms = bc.getParameters().getParameters().get("isMyPrograms.specified");
		return isMyPrograms != null && TRUE.equals(valueOf(isMyPrograms))
				? authorSpecification()
				: null;
	}

}
