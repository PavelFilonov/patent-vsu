package com.vsu.patent.service.agreement;

import static com.vsu.patent.controller.TeslerRestController.agreementRead;
import static com.vsu.patent.dto.AgreementDTO_.agreementNumber;
import static com.vsu.patent.dto.AgreementDTO_.number;
import static com.vsu.patent.dto.AgreementDTO_.status;
import static com.vsu.patent.dto.AgreementDTO_.subjectName;
import static com.vsu.patent.dto.AgreementDTO_.subjectNumber;
import static com.vsu.patent.dto.AgreementDTO_.subjectType;
import static com.vsu.patent.dto.AgreementDTO_.type;
import static com.vsu.patent.entity.enums.Status.FILTER_STATUSES;
import static io.tesler.core.dto.DrillDownType.INNER;

import com.vsu.patent.dto.AgreementDTO;
import com.vsu.patent.entity.enums.SubjectAgreementType;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import org.springframework.stereotype.Service;

@Service
public class AgreementReadMeta extends FieldMetaBuilder<AgreementDTO> {

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<AgreementDTO> fields, InnerBcDescription bcDescription,
			Long id, Long parentId) {
		String url = "/screen/registry/view/agreementinfo/" + agreementRead + "/" + id;
		fields.setDrilldown(number, INNER, url);	
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<AgreementDTO> fields, InnerBcDescription bcDescription, Long parentId) {
		buildFilters(fields);
	}

	private void buildFilters(FieldsMeta<AgreementDTO> fields) {
		fields.enableFilter(status, number, agreementNumber, type, subjectNumber, subjectName, subjectType);
		fields.setEnumFilterValues(fields, status, FILTER_STATUSES);
		fields.setEnumFilterValues(fields, subjectType, SubjectAgreementType.values());
	}

}
