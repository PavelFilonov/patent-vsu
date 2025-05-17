package com.vsu.patent.service.enums;


import io.tesler.core.service.action.ActionIconSpecifier;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SmActionIconSpecifier implements ActionIconSpecifier {
	WITHOUT_ICON(null),
	PLUS("plus"),
	CHECKBOX_ON("checkbox-on"),
	CHECKBOX_OFF("checkbox-off"),
	PLUS_CIRCLE("plus-circle"),
	DELETE("delete"),
	SAVE("save"),
	COPY("copy"),
	BARS("bars"),
	CLOSE("close"),
	EDIT("edit"),
	RETWEET("retweet"),
	FILE_ADD("file-add"),
	DOWNLOAD("download"),
	CAMERA("camera"),
	STACK("stack"),
	FILE_SEARCH("file-search"),
	NEW_DOC("new-doc"),
	TRANSLATIONS("translation"),
	WARNING("warning"),
	CHECK_CIRCLE("check-circle"),
	FLAG("flag"),
	PRINTER("printer"),
	CHECK("check"),
	INFO("info-circle");

	final String actionIconCode;
}
