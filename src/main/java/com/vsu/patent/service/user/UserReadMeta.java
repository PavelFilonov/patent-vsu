package com.vsu.patent.service.user;

import static com.vsu.patent.controller.TeslerRestController.userRead;
import static com.vsu.patent.dto.UserDTO_.firstName;
import static com.vsu.patent.dto.UserDTO_.lastName;
import static com.vsu.patent.dto.UserDTO_.login;
import static com.vsu.patent.dto.UserDTO_.patronymic;
import static com.vsu.patent.dto.UserDTO_.status;
import static com.vsu.patent.entity.enums.Status.FILTER_STATUSES;
import static io.tesler.core.dto.DrillDownType.INNER;

import com.vsu.patent.dto.UserDTO;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import org.springframework.stereotype.Service;

@Service
public class UserReadMeta extends FieldMetaBuilder<UserDTO> {

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<UserDTO> fields, InnerBcDescription bcDescription,
			Long id, Long parentId) {
		String url = "/screen/administration/view/userinfo/" + userRead + "/" + id;
		fields.setDrilldown(login, INNER, url);
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<UserDTO> fields, InnerBcDescription bcDescription, Long parentId) {
		buildFilters(fields);
	}

	private void buildFilters(FieldsMeta<UserDTO> fields) {
		fields.enableFilter(firstName, lastName, patronymic, login, status);
		fields.setEnumFilterValues(fields, status, FILTER_STATUSES);
	}

}
