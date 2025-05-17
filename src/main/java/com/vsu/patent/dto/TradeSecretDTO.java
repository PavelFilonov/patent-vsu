package com.vsu.patent.dto;


import com.vsu.patent.entity.TradeSecret;
import com.vsu.patent.entity.enums.Status;
import com.vsu.patent.service.tesler.extension.provider.CustomLongValueProvider;
import io.tesler.api.data.dto.DataResponseDTO;
import io.tesler.core.util.filter.SearchParameter;
import io.tesler.core.util.filter.provider.impl.EnumValueProvider;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TradeSecretDTO extends DataResponseDTO {

	@SearchParameter(provider = EnumValueProvider.class)
	private Status status;

	private String statusBgColor;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long number;

	@SearchParameter
	private String name;

	@SearchParameter
	private String type;

	@SearchParameter(provider = CustomLongValueProvider.class)
	private Long documentNumber;

	private LocalDate documentDate;

	private String materialCarrier;

	private String responsiblePerson;

	private LocalDate startDate;

	private LocalDate endDate;
	
	private String mip;
	
	public TradeSecretDTO(TradeSecret entity) {
		this.id = entity.getId().toString();
		Status entityStatus = entity.getStatus();
		this.status = entityStatus;
		this.statusBgColor = entityStatus.getColor().getHex();
		this.number = entity.getNumber();
		this.name = entity.getName();
		this.type = entity.getType();
		this.documentNumber = entity.getDocumentNumber();
		this.documentDate = entity.getDocumentDate();
		this.materialCarrier = entity.getMaterialCarrier();
		this.responsiblePerson = entity.getResponsiblePerson();
		this.startDate = entity.getStartDate();
		this.endDate = entity.getEndDate();
		this.mip = entity.getMip();
	}

}
