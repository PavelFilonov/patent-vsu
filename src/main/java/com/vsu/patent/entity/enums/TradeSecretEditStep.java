package com.vsu.patent.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum TradeSecretEditStep {

	MAIN("screen/registry/view/tradesecretedit/", "Основные данные");

	private final String editView;

	@JsonValue
	private final String stepName;

}
