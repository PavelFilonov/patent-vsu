package com.vsu.patent.entity;

import io.tesler.api.data.dictionary.CoreDictionaries;
import io.tesler.api.data.dictionary.LOV;
import io.tesler.api.file.entity.TeslerFile;
import io.tesler.model.core.entity.BaseEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "FILE_ENTITY")
public class FileEntity extends BaseEntity implements TeslerFile {

	@Column(name = "FILE_STORAGE_CD", nullable = false)
	private LOV fileStorageCd;

	@Lob
	private byte[] fileContent;

	private String fileName;

	private String fileType;

	@Column(name = "FILE_SIZE")
	private Long size;

	@Column(name = "IS_TEMPORARY")
	private boolean temporary;

	private String fileUrl;

	private String objectId;

	@Column(name = "RESTRICTED_FLG")
	private boolean restrictedFlg;

	@Column(name = "ACTIVE_FLG")
	private boolean activeFlg;

	@PrePersist
	protected void onCreate() {
		restrictedFlg = fileStorageCd.equals(CoreDictionaries.FileStorage.FILENET);
	}

	public void setFileContent(byte[] fileContent) {
		this.fileContent = fileContent;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

}
