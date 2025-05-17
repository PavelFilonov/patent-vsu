package com.vsu.patent.repository;

import com.vsu.patent.entity.Program;
import com.vsu.patent.entity.SmUser_;
import com.vsu.patent.entity.UserProgram_;
import com.vsu.patent.entity.enums.ProgramEntityType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import static com.vsu.patent.entity.Program_.*;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.entity.enums.Status.IN_THE_MAKING;
import static com.vsu.patent.service.util.CurrentUserService.getCurrentUsername;
import static com.vsu.patent.service.util.PermissionHelper.IS_AUTHOR;
import static io.tesler.model.core.entity.BaseEntity_.CREATED_DATE;
import static io.tesler.model.core.entity.BaseEntity_.ID;
import static java.time.LocalDateTime.now;
import static javax.persistence.criteria.JoinType.LEFT;
import static org.springframework.data.jpa.domain.Specification.where;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long>, JpaSpecificationExecutor<Program> {

	static Specification<Program> isAvailableSpecification() {
		return (root, query, cb) -> cb.notEqual(root.get(STATUS), IN_THE_MAKING);
	}

	static Specification<Program> isAvailableByEntityTypeSpecification(ProgramEntityType entityType) {
		return (root, query, cb) -> cb.equal(root.get(ENTITY_TYPE), entityType);
	}

	static Specification<Program> isActiveSpecification() {
		return (root, query, cb) -> cb.equal(root.get(STATUS), ACTIVE);
	}
	
	static Specification<Program> authorSpecification() {
		return (root, query, cb) -> cb.and(
				cb.equal(
						cb.lower(root.joinList(AUTHORS, LEFT).join(UserProgram_.USER, LEFT).get(SmUser_.LOGIN)),
						getCurrentUsername().toLowerCase()
				));
	}
	
	default boolean isAvailableForAuthor(Long id) {
		return !IS_AUTHOR() || 
				!this.findAll(where(authorSpecification()).and((root, query, cb) -> cb.equal(root.get(ID), id))).isEmpty();
	}

	static Specification<Program> unusefulData() {
		return (root, query, cb) -> cb.and(
				cb.equal(root.get(STATUS), IN_THE_MAKING),
				cb.lessThanOrEqualTo(root.get(CREATED_DATE), now().minusDays(1))
		);
	}

}

