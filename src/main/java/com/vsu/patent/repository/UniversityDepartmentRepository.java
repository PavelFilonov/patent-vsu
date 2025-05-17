package com.vsu.patent.repository;

import static com.vsu.patent.entity.UniversityDepartment_.NAME;
import static com.vsu.patent.entity.UniversityDepartment_.STATUS;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.entity.enums.Status.DRAFT;
import static com.vsu.patent.entity.enums.Status.IN_THE_MAKING;
import static io.tesler.model.core.entity.BaseEntity_.ID;

import com.vsu.patent.entity.UniversityDepartment;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityDepartmentRepository extends JpaRepository<UniversityDepartment, Long>, 
		JpaSpecificationExecutor<UniversityDepartment> {
	
	static Specification<UniversityDepartment> isAvailableSpecification() {
		return (root, query, cb) -> cb.notEqual(root.get(STATUS), IN_THE_MAKING);
	}

	static Specification<UniversityDepartment> isActiveSpecification() {
		return (root, query, cb) -> cb.equal(root.get(STATUS), ACTIVE);
	}
	
	static Specification<UniversityDepartment> byNameSpecification(String name) {
		return (root, query, cb) -> cb.equal(root.get(NAME), name);
	}

	static Specification<UniversityDepartment> checkUniqueNameSpecification(UniversityDepartment entity, String name) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			predicates.add(cb.equal(root.get(NAME), name));
			predicates.add(cb.notEqual(root.get(STATUS), IN_THE_MAKING));
			predicates.add(cb.notEqual(root.get(STATUS), DRAFT));
			if (entity.getId() != null) {
				predicates.add(cb.notEqual(root.get(ID), entity.getId()));
			}
			return cb.and(predicates.toArray(Predicate[]::new));
		};
	}
	
}

