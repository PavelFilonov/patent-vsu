package com.vsu.patent.conf.tesler.meta;

import io.tesler.core.ui.field.TeslerWidgetField;
import io.tesler.core.ui.model.json.field.FieldMeta.FieldMetaBase;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@TeslerWidgetField({"multipleSelect", "framedInput", "infoPopupLink", "multivalueField", "multipleCheckbox",
		"checkboxSelect", "hintLabel", "resultWithIcon", "iconifiedCheckbox", "withHintIcon", "filesAttachment", "range",
		"copyableText"})
public class EmptyFieldMeta extends FieldMetaBase {

}
