package com.vsu.patent.service.department;

import com.vsu.patent.dto.UniversityDepartmentDTO;
import com.vsu.patent.entity.UniversityDepartment;
import com.vsu.patent.repository.UniversityDepartmentRepository;
import com.vsu.patent.repository.UniversityFacultyRepository;
import com.vsu.patent.service.tesler.extension.mapper.TeslerMapperUtil;
import io.tesler.core.crudma.bc.BusinessComponent;
import io.tesler.core.crudma.impl.VersionAwareResponseService;
import io.tesler.core.dto.rowmeta.ActionResultDTO;
import io.tesler.core.dto.rowmeta.CreateResult;
import io.tesler.core.dto.rowmeta.PreAction;
import io.tesler.core.exception.BusinessException;
import io.tesler.core.service.action.Actions;
import io.tesler.core.service.action.ActionsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import static com.vsu.patent.dto.UniversityDepartmentDTO_.facultyName;
import static com.vsu.patent.dto.UniversityDepartmentDTO_.name;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.repository.UniversityDepartmentRepository.checkUniqueNameSpecification;
import static com.vsu.patent.repository.UniversityFacultyRepository.byNameSpecification;
import static com.vsu.patent.repository.UniversityFacultyRepository.isActiveSpecification;
import static com.vsu.patent.service.util.PermissionHelper.EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.dto.rowmeta.PreActionType.CONFIRMATION;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.RECORD;
import static java.lang.String.format;
import static org.springframework.data.jpa.domain.Specification.where;

@Service
public class DepartmentEditService extends VersionAwareResponseService<UniversityDepartmentDTO, UniversityDepartment> {

	private static final String DEPARTMENT_LIST_URL = "/screen/administration/view/departmentlist/";

	@Autowired
	private UniversityDepartmentRepository departmentRepository;

	@Autowired
	private UniversityFacultyRepository facultyRepository;

	public DepartmentEditService() {
		super(UniversityDepartmentDTO.class, UniversityDepartment.class, null, DepartmentEditMeta.class);
	}

	@Override
	protected CreateResult<UniversityDepartmentDTO> doCreateEntity(UniversityDepartment entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<UniversityDepartmentDTO> doUpdateEntity(UniversityDepartment entity,
			UniversityDepartmentDTO dto, BusinessComponent bc) {
		TeslerMapperUtil.setIfChanged(dto, name, data -> {
			if (data != null && data.length() < 2) {
				throw new BusinessException().addPopup("Наименование должно содержать минимум 2 символа");
			}
			checkUniqueName(entity, data);
			entity.setName(data);
		});
		TeslerMapperUtil.setIfChanged(dto, facultyName, data ->
				facultyRepository.findOne(where(byNameSpecification(data)).and(isActiveSpecification()))
						.ifPresent(entity::setFaculty));
		departmentRepository.saveAndFlush(entity);
		return new ActionResultDTO<>(entityToDto(bc, entity));
	}

	@Override
	public Actions<UniversityDepartmentDTO> getActions() {
		ActionsBuilder<UniversityDepartmentDTO> builder = Actions.builder();
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
				.invoker((bc, data) -> new ActionResultDTO<UniversityDepartmentDTO>().setAction(drillDown(
						INNER,
						DEPARTMENT_LIST_URL
				)))
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID))
				.withAutoSaveBefore()
				.action("finish", "Сохранить")
				.invoker((bc, data) -> {
					var entity = departmentRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					departmentRepository.saveAndFlush(entity);
					return new ActionResultDTO<UniversityDepartmentDTO>().setAction(drillDown(INNER, DEPARTMENT_LIST_URL));
				})
				.add()

				.build();
	}

	private void checkUniqueName(UniversityDepartment entity, String dtoName) {
		Specification<UniversityDepartment> spec = checkUniqueNameSpecification(entity, dtoName);
		if (!departmentRepository.findAll(spec).isEmpty()) {
			throw new BusinessException().addPopup(format("Кафедра с наименованием %s уже добавлена", dtoName));
		}
	}

}
