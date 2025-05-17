package com.vsu.patent.conf.db;

import org.hibernate.boot.MetadataBuilder;
import org.hibernate.boot.spi.MetadataBuilderContributor;
import org.hibernate.dialect.function.StandardSQLFunction;

public class FunctionContributor implements MetadataBuilderContributor {

	@Override
	public void contribute(MetadataBuilder metadataBuilder) {
		metadataBuilder.applySqlFunction("bool_or", BoolOrFunction.INSTANCE);
	}

	public static class BoolOrFunction extends StandardSQLFunction {

		public static final BoolOrFunction INSTANCE = new BoolOrFunction();

		public BoolOrFunction() {
			super("bool_or");
		}

	}
}
