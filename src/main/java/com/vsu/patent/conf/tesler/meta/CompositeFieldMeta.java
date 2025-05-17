package com.vsu.patent.conf.tesler.meta;

import io.tesler.core.ui.field.TeslerWidgetField;
import io.tesler.core.ui.model.json.field.FieldMeta;
import io.tesler.core.ui.model.json.field.FieldMeta.FieldContainer;
import io.tesler.core.ui.model.json.field.FieldMeta.FieldMetaBase;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@TeslerWidgetField({"composite", "info", "splitRate"})
public class CompositeFieldMeta extends FieldMetaBase implements FieldContainer {

	List<FieldMeta> fields;

	Boolean ignoreHint;

	@Override
	public List<FieldMeta> getChildren() {
		return fields;
	}

}
