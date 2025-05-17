package com.vsu.patent.service.faculty;

import com.vsu.patent.dto.UniversityFacultyDTO;
import com.vsu.patent.entity.UniversityFaculty;
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

import static com.vsu.patent.dto.UniversityFacultyDTO_.name;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.repository.UniversityFacultyRepository.checkUniqueNameSpecification;
import static com.vsu.patent.service.util.PermissionHelper.EMPLOYEE_PERMISSION;
import static io.tesler.core.dto.DrillDownType.INNER;
import static io.tesler.core.dto.rowmeta.PostAction.drillDown;
import static io.tesler.core.dto.rowmeta.PreActionType.CONFIRMATION;
import static io.tesler.core.service.action.ActionAvailableChecker.NOT_NULL_ID;
import static io.tesler.core.service.action.ActionAvailableChecker.and;
import static io.tesler.core.service.action.ActionScope.RECORD;
import static java.lang.String.format;

@Service
public class FacultyEditService extends VersionAwareResponseService<UniversityFacultyDTO, UniversityFaculty> {

	private static final String FACULTY_LIST_URL = "/screen/administration/view/facultylist/";

	@Autowired
	private UniversityFacultyRepository facultyRepository;

	public FacultyEditService() {
		super(UniversityFacultyDTO.class, UniversityFaculty.class, null, FacultyEditMeta.class);
	}

	@Override
	protected CreateResult<UniversityFacultyDTO> doCreateEntity(UniversityFaculty entity, BusinessComponent bc) {
		return null;
	}

	@Override
	protected ActionResultDTO<UniversityFacultyDTO> doUpdateEntity(UniversityFaculty entity,
			UniversityFacultyDTO dto, BusinessComponent bc) {
		TeslerMapperUtil.setIfChanged(dto, name, data -> {
			if (data != null && data.length() < 2) {
				throw new BusinessException().addPopup("Наименование должно содержать минимум 3 символа");
			}
			checkUniqueName(entity, data);
			entity.setName(data);
		});
		facultyRepository.saveAndFlush(entity);
		return new ActionResultDTO<>(entityToDto(bc, entity));
	}

	@Override
	public Actions<UniversityFacultyDTO> getActions() {
		ActionsBuilder<UniversityFacultyDTO> builder = Actions.builder();
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
				.invoker((bc, data) -> new ActionResultDTO<UniversityFacultyDTO>().setAction(drillDown(
						INNER,
						FACULTY_LIST_URL
				)))
				.add()

				.newAction()
				.scope(RECORD)
				.available(and(EMPLOYEE_PERMISSION, NOT_NULL_ID))
				.withAutoSaveBefore()
				.action("finish", "Сохранить")
				.invoker((bc, data) -> {
					var entity = facultyRepository.getById(bc.getIdAsLong());
					entity.setStatus(ACTIVE);
					facultyRepository.saveAndFlush(entity);
					return new ActionResultDTO<UniversityFacultyDTO>().setAction(drillDown(INNER, FACULTY_LIST_URL));
				})
				.add()

				.build();
	}

	private void checkUniqueName(UniversityFaculty entity, String dtoName) {
		Specification<UniversityFaculty> spec = checkUniqueNameSpecification(entity, dtoName);
		if (!facultyRepository.findAll(spec).isEmpty()) {
			throw new BusinessException().addPopup(format("Факультет с наименованием %s уже добавлена", dtoName));
		}
	}

}
