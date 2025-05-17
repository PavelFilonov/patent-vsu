package com.vsu.patent.entity;

import static com.vsu.patent.entity.enums.Status.IN_THE_MAKING;
import static com.vsu.patent.entity.enums.TradeSecretEditStep.MAIN;
import static javax.persistence.EnumType.STRING;

import com.vsu.patent.entity.enums.Status;
import com.vsu.patent.entity.enums.TradeSecretEditStep;
import io.tesler.model.core.entity.BaseEntity;
import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "trade_secret")
public class TradeSecret extends BaseEntity {

	private Long number;
	
	private String name;
	
	private String type;
	
	private Long documentNumber;
	
	private LocalDate documentDate;
	
	private String materialCarrier;
	
	private String responsiblePerson;
	
	private LocalDate startDate;
	
	private LocalDate endDate;
	
	@Column(length = -1)
	private String mip;

	@Enumerated(value = STRING)
	private Status status = IN_THE_MAKING;

	@Enumerated(value = STRING)
	private TradeSecretEditStep editStep = MAIN;

}
