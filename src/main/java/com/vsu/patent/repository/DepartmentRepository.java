package com.vsu.patent.repository;

import io.tesler.model.core.entity.Department;
import io.tesler.model.core.entity.Department_;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long>, JpaSpecificationExecutor<Department> {

	default Department findDefaultDepartment() {
		return findOne((root, query, cb) -> cb.equal(root.get(Department_.ID), 0)).orElseThrow();
	}

}
