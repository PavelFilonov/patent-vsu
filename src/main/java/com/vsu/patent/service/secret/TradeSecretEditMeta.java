package com.vsu.patent.service.secret;

import static com.vsu.patent.dto.TradeSecretDTO_.documentDate;
import static com.vsu.patent.dto.TradeSecretDTO_.documentNumber;
import static com.vsu.patent.dto.TradeSecretDTO_.endDate;
import static com.vsu.patent.dto.TradeSecretDTO_.materialCarrier;
import static com.vsu.patent.dto.TradeSecretDTO_.mip;
import static com.vsu.patent.dto.TradeSecretDTO_.name;
import static com.vsu.patent.dto.TradeSecretDTO_.number;
import static com.vsu.patent.dto.TradeSecretDTO_.responsiblePerson;
import static com.vsu.patent.dto.TradeSecretDTO_.startDate;
import static com.vsu.patent.dto.TradeSecretDTO_.type;

import com.vsu.patent.dto.TradeSecretDTO;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TradeSecretEditMeta extends FieldMetaBuilder<TradeSecretDTO> {

	@Override
	public void buildRowDependentMeta(RowDependentFieldsMeta<TradeSecretDTO> fields,
			InnerBcDescription bcDescription,
			Long id, Long parentId) {
		fields.setEnabled(
				number,
				name,
				type,
				documentNumber,
				documentDate,
				materialCarrier,
				responsiblePerson,
				startDate,
				endDate,
				mip
		);
		setPlaceholders(fields);
	}

	private void setPlaceholders(RowDependentFieldsMeta<TradeSecretDTO> fields) {
		fields.setPlaceholder(number, "№ строки");
		fields.setPlaceholder(name, "Наименование охраняемой информации");
		fields.setPlaceholder(type, "Вид ОИС");
		fields.setPlaceholder(documentNumber, "Номер охранного документа");
		fields.setPlaceholder(documentDate, "Дата охранного документа");
		fields.setPlaceholder(materialCarrier, "Материальный носитель информации");
		fields.setPlaceholder(responsiblePerson, "Ответственный за проведение мероприятий по охране информации");
		fields.setPlaceholder(startDate, "Дата начала охраны");
		fields.setPlaceholder(endDate, "Дата окончания охраны");
		fields.setPlaceholder(mip, "МИП");
	}

	@Override
	public void buildIndependentMeta(FieldsMeta<TradeSecretDTO> fields, InnerBcDescription bcDescription,
			Long parentId) {
	}

}
