package com.vsu.patent.repository;

import com.vsu.patent.entity.Innovation;
import com.vsu.patent.entity.SmUser_;
import com.vsu.patent.entity.UserInnovation_;
import com.vsu.patent.entity.enums.InnovationEntityType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import static com.vsu.patent.entity.Innovation_.*;
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
public interface InnovationRepository extends JpaRepository<Innovation, Long>, JpaSpecificationExecutor<Innovation> {

	static Specification<Innovation> isAvailableSpecification() {
		return (root, query, cb) -> cb.notEqual(root.get(STATUS), IN_THE_MAKING);
	}
	
	static Specification<Innovation> isAvailableByEntityTypeSpecification(InnovationEntityType entityType) {
		return (root, query, cb) -> cb.equal(root.get(ENTITY_TYPE), entityType);
	}
	
	static Specification<Innovation> isActiveSpecification() {
		return (root, query, cb) -> cb.equal(root.get(STATUS), ACTIVE);
	}

	static Specification<Innovation> authorSpecification() {
		return (root, query, cb) -> cb.and(
				cb.equal(
						cb.lower(root.joinList(AUTHORS, LEFT).join(UserInnovation_.USER, LEFT).get(SmUser_.LOGIN)),
						getCurrentUsername().toLowerCase()
				));
	}

	default boolean isAvailableForAuthor(Long id) {
		return !IS_AUTHOR() || 
				!this.findAll(where(authorSpecification()).and((root, query, cb) -> cb.equal(root.get(ID), id))).isEmpty();
	}

	static Specification<Innovation> unusefulData() {
		return (root, query, cb) -> cb.and(
				cb.equal(root.get(STATUS), IN_THE_MAKING),
				cb.lessThanOrEqualTo(root.get(CREATED_DATE), now().minusDays(1))
		);
	}
	
}

