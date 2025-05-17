package com.vsu.patent.dto;


import com.vsu.patent.entity.UniversityFaculty;
import com.vsu.patent.entity.enums.Status;
import io.tesler.api.data.dto.DataResponseDTO;
import io.tesler.core.util.filter.SearchParameter;
import io.tesler.core.util.filter.provider.impl.EnumValueProvider;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UniversityFacultyDTO extends DataResponseDTO {

	@SearchParameter(provider = EnumValueProvider.class)
	private Status status;

	@SearchParameter
	private String name;

	private String statusBgColor;

	public UniversityFacultyDTO(UniversityFaculty entity) {
		this.id = entity.getId().toString();
		Status entityStatus = entity.getStatus();
		this.status = entityStatus;
		this.statusBgColor = entityStatus.getColor().getHex();
		this.name = entity.getName();
	}

}
