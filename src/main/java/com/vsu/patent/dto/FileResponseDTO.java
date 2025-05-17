package com.vsu.patent.dto;

import io.tesler.core.dto.multivalue.MultivalueField;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileResponseDTO {

	private MultivalueField files;

	public FileResponseDTO() {
		this.files = new MultivalueField();
	}

	public FileResponseDTO(MultivalueField files) {
		this.files = files;
	}

}
