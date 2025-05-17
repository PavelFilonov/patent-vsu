package com.vsu.patent.controller;

import com.vsu.patent.service.agreement.AgreementEditService;
import com.vsu.patent.service.agreement.AgreementReadService;
import com.vsu.patent.service.department.DepartmentEditService;
import com.vsu.patent.service.department.DepartmentReadService;
import com.vsu.patent.service.faculty.FacultyEditService;
import com.vsu.patent.service.faculty.FacultyReadService;
import com.vsu.patent.service.innovation.InnovationEditService;
import com.vsu.patent.service.innovation.InnovationReadService;
import com.vsu.patent.service.innovation.UsefulModelEditService;
import com.vsu.patent.service.innovation.UsefulModelReadService;
import com.vsu.patent.service.program.*;
import com.vsu.patent.service.secret.TradeSecretEditService;
import com.vsu.patent.service.secret.TradeSecretReadService;
import com.vsu.patent.service.user.UserEditService;
import com.vsu.patent.service.user.UserReadService;
import io.tesler.core.crudma.bc.BcIdentifier;
import io.tesler.core.crudma.bc.EnumBcIdentifier;
import io.tesler.core.crudma.bc.impl.AbstractEnumBcSupplier;
import io.tesler.core.crudma.bc.impl.BcDescription;
import lombok.Getter;
import org.springframework.stereotype.Component;

/**
 * This is actually an analog of a usual @RestController.
 * When you add enum, you just add rest endpoints, that tesler UI can call.
 * We could actually make a usual @RestController and make it Generic,
 * but current enum approach shows, that it is less error-prone in huge enterprise projects
 * (because single line in this enum creates >5 rest endpoints)
 */
@Getter
public enum TeslerRestController implements EnumBcIdentifier {

	userRead(UserReadService.class),
	userEdit(UserEditService.class),
	departmentRead(DepartmentReadService.class),
	departmentEdit(DepartmentEditService.class),
	facultyRead(FacultyReadService.class),
	facultyEdit(FacultyEditService.class),
	innovationRead(InnovationReadService.class),
	innovationEdit(InnovationEditService.class),
	usefulModelRead(UsefulModelReadService.class),
	usefulModelEdit(UsefulModelEditService.class),
	agreementRead(AgreementReadService.class),
	agreementEdit(AgreementEditService.class),
	programRead(ProgramReadService.class),
	programEdit(ProgramEditService.class),
	databaseRead(DatabaseReadService.class),
	databaseEdit(DatabaseEditService.class),
	integratedCircuitRead(IntegratedCircuitReadService.class),
	integratedCircuitEdit(IntegratedCircuitEditService.class),
	tradeSecretRead(TradeSecretReadService.class),
	tradeSecretEdit(TradeSecretEditService.class)
	;
	
	public static final EnumBcIdentifier.Holder<TeslerRestController> Holder = new Holder<>(TeslerRestController.class);

	private final BcDescription bcDescription;

	TeslerRestController(String parentName, Class<?> serviceClass, boolean refresh) {
		this.bcDescription = buildDescription(parentName, serviceClass, refresh);
	}

	TeslerRestController(String parentName, Class<?> serviceClass) {
		this(parentName, serviceClass, false);
	}

	TeslerRestController(BcIdentifier parent, Class<?> serviceClass, boolean refresh) {
		this(parent == null ? null : parent.getName(), serviceClass, refresh);
	}

	TeslerRestController(BcIdentifier parent, Class<?> serviceClass) {
		this(parent, serviceClass, false);
	}

	TeslerRestController(Class<?> serviceClass, boolean refresh) {
		this((String) null, serviceClass, refresh);
	}

	TeslerRestController(Class<?> serviceClass) {
		this((String) null, serviceClass, false);
	}

	@Component
	public static class BcSupplier extends AbstractEnumBcSupplier<TeslerRestController> {

		public BcSupplier() {
			super(TeslerRestController.Holder);
		}

	}

}
