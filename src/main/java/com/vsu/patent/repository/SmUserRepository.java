package com.vsu.patent.repository;

import com.vsu.patent.entity.SmUser;
import com.vsu.patent.entity.SmUserRole_;
import com.vsu.patent.entity.SmUser_;
import io.tesler.api.data.dictionary.LOV;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

import static com.vsu.patent.entity.SmUser_.*;
import static com.vsu.patent.entity.enums.Status.ACTIVE;
import static com.vsu.patent.entity.enums.Status.*;
import static com.vsu.patent.service.util.CurrentUserService.getCurrentUsername;
import static io.tesler.model.core.entity.BaseEntity_.CREATED_DATE;
import static io.tesler.model.core.entity.BaseEntity_.ID;
import static java.time.LocalDateTime.now;
import static javax.persistence.criteria.JoinType.LEFT;
import static org.springframework.data.jpa.domain.Specification.where;

@Repository
public interface SmUserRepository extends JpaRepository<SmUser, Long>, JpaSpecificationExecutor<SmUser> {
	
	static Specification<SmUser> isAvailableSpecification() {
		return (root, query, cb) -> cb.notEqual(root.get(STATUS), IN_THE_MAKING);
	}
	
	static Specification<SmUser> unusefulData() {
		return (root, query, cb) -> cb.and(
				cb.equal(root.get(STATUS), IN_THE_MAKING),
				cb.lessThanOrEqualTo(root.get(CREATED_DATE), now().minusDays(1))
		);
	}

	static Specification<SmUser> isActiveSpecification() {
		return (root, query, cb) -> cb.and(
				cb.equal(root.get(STATUS), ACTIVE),
				cb.isTrue(root.get(SmUser_.ACTIVE))
		);
	}

	static Specification<SmUser> isNotSystemUserSpecification() {
		return (root, query, cb) -> cb.not(cb.in(root.get(LOGIN)).value(List.of("vanilla")));
	}
	
	static Specification<SmUser> isNotCurrentUserSpecification() {
		return (root, query, cb) -> cb.notEqual(root.get(LOGIN), getCurrentUsername());
	}

	static Specification<SmUser> checkUniqueLoginSpecification(SmUser entity, String login) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();
			predicates.add(cb.equal(root.get(LOGIN), login));
			predicates.add(cb.notEqual(root.get(STATUS), IN_THE_MAKING));
			predicates.add(cb.notEqual(root.get(STATUS), DRAFT));
			if (entity != null && entity.getId() != null) {
				predicates.add(cb.notEqual(root.get(ID), entity.getId()));
			}
			return cb.and(predicates.toArray(Predicate[]::new));
		};
	}
	
	static Specification<SmUser> authorSpecification() {
		return (root, query, cb) -> cb.equal(
				root.joinList(USER_ROLE_LIST, LEFT).get(SmUserRole_.INTERNAL_ROLE_CD), new LOV("Автор")
		);
	}

	static Specification<SmUser> loginsSpecification(List<String> logins) {
		return (root, query, cb) -> cb.in(root.get(LOGIN)).value(logins);
	}
	
	default List<SmUser> findAllAuthors() {
		return this.findAll(where(isActiveSpecification())
				.and(isNotSystemUserSpecification())
				.and(authorSpecification()));
	}

	default List<SmUser> findAllAuthorsByLogins(List<String> logins) {
		return this.findAll(where(isActiveSpecification())
				.and(isNotSystemUserSpecification())
				.and(authorSpecification())
				.and(loginsSpecification(logins)));
	}

}

