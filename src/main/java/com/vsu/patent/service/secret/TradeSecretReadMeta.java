package com.vsu.patent.service.secret;

import static com.vsu.patent.controller.TeslerRestController.tradeSecretRead;
import static com.vsu.patent.dto.TradeSecretDTO_.documentNumber;
import static com.vsu.patent.dto.TradeSecretDTO_.name;
import static com.vsu.patent.dto.TradeSecretDTO_.number;
import static com.vsu.patent.dto.TradeSecretDTO_.status;
import static com.vsu.patent.dto.TradeSecretDTO_.type;
import static com.vsu.patent.entity.enums.Status.FILTER_STATUSES;
import static io.tesler.core.dto.DrillDownType.INNER;

import com.vsu.patent.dto.TradeSecretDTO;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import org.springframework.stereotype.Service;

@Service
public class TradeSecretReadMeta extends FieldMetaBuilder<TradeSecretDTO> {

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<TradeSecretDTO> fields, InnerBcDescription bcDescription,
			Long id, Long parentId) {
		String url = "/screen/registry/view/tradesecretinfo/" + tradeSecretRead + "/" + id;
		fields.setDrilldown(number, INNER, url);
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<TradeSecretDTO> fields, InnerBcDescription bcDescription, Long parentId) {
		buildFilters(fields);
	}

	private void buildFilters(FieldsMeta<TradeSecretDTO> fields) {
		fields.enableFilter(name, status, number, type, documentNumber);
		fields.setEnumFilterValues(fields, status, FILTER_STATUSES);
	}

}
