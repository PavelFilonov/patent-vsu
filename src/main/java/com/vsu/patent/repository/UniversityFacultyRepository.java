package com.vsu.patent.repository;

import com.vsu.patent.entity.UniversityFaculty;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

import static com.vsu.patent.entity.UniversityFaculty_.NAME;
import static com.vsu.patent.entity.UniversityFaculty_.STATUS;
import static com.vsu.patent.entity.enums.Status.*;
import static io.tesler.model.core.entity.BaseEntity_.ID;

@Repository
public interface UniversityFacultyRepository extends JpaRepository<UniversityFaculty, Long>,
		JpaSpecificationExecutor<UniversityFaculty> {
	
	static Specification<UniversityFaculty> isAvailableSpecification() {
		return (root, query, cb) -> cb.notEqual(root.get(STATUS), IN_THE_MAKING);
	}

	static Specification<UniversityFaculty> isActiveSpecification() {
		return (root, query, cb) -> cb.equal(root.get(STATUS), ACTIVE);
	}
	
	static Specification<UniversityFaculty> byNameSpecification(String name) {
		return (root, query, cb) -> cb.equal(root.get(NAME), name);
	}

	static Specification<UniversityFaculty> checkUniqueNameSpecification(UniversityFaculty entity, String name) {
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

