package com.vsu.patent.repository;

import static com.vsu.patent.entity.Agreement_.STATUS;
import static com.vsu.patent.entity.enums.Status.IN_THE_MAKING;
import static io.tesler.model.core.entity.BaseEntity_.CREATED_DATE;
import static java.time.LocalDateTime.now;

import com.vsu.patent.entity.Agreement;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AgreementRepository extends JpaRepository<Agreement, Long>, JpaSpecificationExecutor<Agreement> {

	static Specification<Agreement> isAvailableSpecification() {
		return (root, query, cb) -> cb.notEqual(root.get(STATUS), IN_THE_MAKING);
	}

	static Specification<Agreement> unusefulData() {
		return (root, query, cb) -> cb.and(
				cb.equal(root.get(STATUS), IN_THE_MAKING),
				cb.lessThanOrEqualTo(root.get(CREATED_DATE), now().minusDays(1))
		);
	}
	
}

