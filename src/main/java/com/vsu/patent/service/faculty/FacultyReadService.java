package com.vsu.patent.service.faculty;

import com.vsu.patent.dto.UniversityFacultyDTO;
import com.vsu.patent.entity.UniversityFaculty;
import com.vsu.patent.repository.UniversityFacultyRepository;
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

import static com.vsu.patent.controller.TeslerRestController.facultyEdit;
import static com.vsu.patent.entity.enums.Status.*;
import static com.vsu.patent.repository.UniversityFacultyRepository.isAvailableSpecification;
import static com.vsu.patent.service.util.PermissionHelper.EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.BC;
import static io.tesler.core.service.action.ActionScope.RECORD;
import static org.springframework.data.jpa.domain.Specification.where;

@Service
public class FacultyReadService extends VersionAwareResponseService<UniversityFacultyDTO, UniversityFaculty> {

	private static final String EDIT_LINK = "screen/administration/view/facultyedit/";

	@Autowired
	private UniversityFacultyRepository facultyRepository;

	public FacultyReadService() {
		super(UniversityFacultyDTO.class, UniversityFaculty.class, null, FacultyReadMeta.class);
	}

	@Override
	protected Specification<UniversityFaculty> getSpecification(BusinessComponent bc) {
		return where(super.getSpecification(bc))
				.and(isAvailableSpecification());
	}

	@Override
	protected CreateResult<UniversityFacultyDTO> doCreateEntity(UniversityFaculty entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<UniversityFacultyDTO> doUpdateEntity(UniversityFaculty entity,
			UniversityFacultyDTO data, BusinessComponent bc) {
		return null;
	}

	@Override
	public Actions<UniversityFacultyDTO> getActions() {
		ActionsBuilder<UniversityFacultyDTO> builder = Actions.builder();
		return builder

				.newAction()
				.scope(BC)
				.available(EMPLOYEE_PERMISSION)
				.withoutAutoSaveBefore()
				.withoutIcon()
				.action("create_faculty", "Добавить")
				.invoker((bc, data) -> {
					var entity = new UniversityFaculty();
					facultyRepository.saveAndFlush(entity);
					String url = EDIT_LINK + facultyEdit + "/" + entity.getId();
					return new ActionResultDTO<UniversityFacultyDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.PLUS, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = facultyRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("delete_faculty", "Удалить")
				.invoker((bc, data) -> {
					var entity = facultyRepository.getById(bc.getIdAsLong());
					facultyRepository.delete(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.DELETE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = facultyRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == DRAFT;
				}))
				.withoutAutoSaveBefore()
				.action("edit_faculty", "Редактировать")
				.invoker((bc, data) -> {
					var entity = facultyRepository.getById(bc.getIdAsLong());
					String url = EDIT_LINK + facultyEdit + "/" + entity.getId();
					return new ActionResultDTO<UniversityFacultyDTO>().setAction(drillDown(INNER, url));
				})
				.withIcon(SmActionIconSpecifier.EDIT, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = facultyRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == ACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("deactivate_faculty", "Деактивировать")
				.invoker((bc, data) -> {
					var entity = facultyRepository.getById(bc.getIdAsLong());
					entity.setStatus(INACTIVE);
					facultyRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CLOSE, false)
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID, bc -> {
					var entity = facultyRepository.getById(bc.getIdAsLong());
					return entity.getStatus() == INACTIVE;
				}))
				.withoutAutoSaveBefore()
				.action("activate_faculty", "Активировать")
				.invoker((bc, data) -> {
					var entity = facultyRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					facultyRepository.saveAndFlush(entity);
					return new ActionResultDTO<>();
				})
				.withIcon(SmActionIconSpecifier.CHECK, false)
				.add()

				.build();
	}

}
