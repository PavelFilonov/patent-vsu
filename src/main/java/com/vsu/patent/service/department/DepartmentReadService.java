package com.vsu.patent.service.department;

import static com.vsu.patent.controller.TeslerRestController.departmentEdit;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.entity.enums.Status.DRAFT;
import static com.vsu.patent.entity.enums.Status.INACTIVE;
import static com.vsu.patent.repository.UniversityDepartmentRepository.isAvailableSpecification;
import static com.vsu.patent.service.util.PermissionHelper.EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.BC;
import static io.tesler.core.service.action.ActionScope.RECORD;
import static org.springframework.data.jpa.domain.Specification.where;

import com.vsu.patent.dto.UniversityDepartmentDTO;
import com.vsu.patent.entity.UniversityDepartment;
import com.vsu.patent.repository.UniversityDepartmentRepository;
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
public class DepartmentReadService extends VersionAwareResponseService<UniversityDepartmentDTO, UniversityDepartment> {

	private static final String EDIT_LINK = "screen/administration/view/departmentedit/";

	@Autowired
	private UniversityDepartmentRepository departmentRepository;

	public DepartmentReadService() {
		super(UniversityDepartmentDTO.class, UniversityDepartment.class, null, DepartmentReadMeta.class);
	}

	@Override
	protected Specification<UniversityDepartment> getSpecification(BusinessComponent bc) {
		return where(super.getSpecification(bc))
				.and(isAvailableSpecification());
	}

	@Override
	protected CreateResult<UniversityDepartmentDTO> doCreateEntity(UniversityDepartment entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<UniversityDepartmentDTO> doUpdateEntity(UniversityDepartment entity,
			UniversityDepartmentDTO data, BusinessComponent bc) {
		return null;
	}

	@Override
	public Actions<UniversityDepartmentDTO> getActions() {
		ActionsBuilder<UniversityDepartmentDTO> builder = Actions.builder();
		return builder

				.newAction()
				.scope(BC)
				.available(EMPLOYEE_PERMISSION)
				.withoutAutoSaveBefore()
				.withoutIcon()
				.action("create_department", "Добавить")
				.invoker((bc, data) -> {
					var entity = new UniversityDepartment();
					departmentRepository.saveAndFlush(entity);
					String url = EDIT_LINK + departmentEdit + "/" + entity.getId();
					return new ActionResultDTO<UniversityDepartmentDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.PLUS, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = departmentRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("delete_department", "Удалить")
				.invoker((bc, data) -> {
					var entity = departmentRepository.getById(bc.getIdAsLong());
					departmentRepository.delete(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.DELETE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = departmentRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("edit_department", "Редактировать")
				.invoker((bc, data) -> {
					var entity = departmentRepository.getById(bc.getIdAsLong());
					String url = EDIT_LINK + departmentEdit + "/" + entity.getId();
					return new ActionResultDTO<UniversityDepartmentDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.EDIT, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = departmentRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == ACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("deactivate_department", "Деактивировать")
				.invoker((bc, data) -> {
					var entity = departmentRepository.getById(bc.getIdAsLong());
					entity.setStatus(INACTIVE);
					departmentRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CLOSE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = departmentRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == INACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("activate_department", "Активировать")
				.invoker((bc, data) -> {
					var entity = departmentRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					departmentRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CHECK, false)
				.add()

				.build();
	}

}
