package com.vsu.patent.service.tesler.extension.provider;


import static io.tesler.core.controller.param.SearchOperation.CONTAINS;
import static io.tesler.core.controller.param.SearchOperation.CONTAINS_ONE_OF;
import static io.tesler.core.controller.param.SearchOperation.EQUALS;
import static io.tesler.core.controller.param.SearchOperation.EQUALS_ONE_OF;

import io.tesler.core.controller.param.FilterParameter;
import io.tesler.core.dao.ClassifyDataParameter;
import io.tesler.core.util.filter.SearchParameter;
import io.tesler.core.util.filter.provider.ClassifyDataProvider;
import io.tesler.core.util.filter.provider.impl.AbstractClassifyDataProvider;
import java.lang.reflect.Field;
import java.util.Collections;
import java.util.List;
import lombok.EqualsAndHashCode;
import org.springframework.stereotype.Component;

@Component
@EqualsAndHashCode(callSuper = false)
public class CustomLongValueProvider extends AbstractClassifyDataProvider implements ClassifyDataProvider {

	@Override
	protected List<ClassifyDataParameter> getProviderParameterValues(Field dtoField, ClassifyDataParameter dataParameter,
			FilterParameter filterParam, SearchParameter searchParam,
			List<ClassifyDataProvider> providers) {
		List<ClassifyDataParameter> result;
		if (CONTAINS_ONE_OF.equals(dataParameter.getOperator()) || EQUALS_ONE_OF.equals(dataParameter.getOperator())) {
			dataParameter.setValue(filterParam.getLongValuesAsList());
		} else {
			dataParameter.setValue(filterParam.getLongValue());
		}
		if (CONTAINS == dataParameter.getOperator()) {
			dataParameter.setOperator(EQUALS);
		}
		result = Collections.singletonList(dataParameter);
		return result;
	}

}
