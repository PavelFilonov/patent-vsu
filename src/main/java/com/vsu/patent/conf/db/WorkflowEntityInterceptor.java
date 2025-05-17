package com.vsu.patent.conf.db;

import org.hibernate.EmptyInterceptor;

/**
 * Intercepts Hibernate events for WorkflowEntities.
 * If you are renaming this class, don't forget to re-register it in the properties file.
 */
public class WorkflowEntityInterceptor extends EmptyInterceptor {

	// TODO fix deletion issue
//	@Override
//	public void preFlush(Iterator entities) {
//		super.preFlush(entities);
//		var list = IteratorUtils.toList(entities);
//		list.forEach(entity -> {
//			if (WorkflowEntity.class.isAssignableFrom(entity.getClass())) {
//				var workflowEntity = (WorkflowEntity) entity;
//				workflowEntity.onUpdate();
//			}
//		});
//	}
}


