package com.vsu.patent.repository;

import com.vsu.patent.entity.CustomDictionaryItem;
import lombok.NonNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.vsu.patent.entity.CustomDictionaryItem_.ACTIVE;
import static com.vsu.patent.entity.CustomDictionaryItem_.TYPE;

@Repository
public interface CustomDictionaryItemRepository extends JpaRepository<CustomDictionaryItem, Long>,
		JpaSpecificationExecutor<CustomDictionaryItem> {

	@NonNull
	static Specification<CustomDictionaryItem> dictionaryItemByType(String type) {
		return (root, query, cb) -> cb.equal(root.get(TYPE), type);
	}

	Optional<CustomDictionaryItem> findByTypeAndKey(String type, String key);

	Optional<CustomDictionaryItem> findByTypeAndValue(String type, String value);

	default List<CustomDictionaryItem> findAllActiveByType(String type) {
		return findAll((root, query, cb) -> cb.and(
				cb.equal(root.get(TYPE), type),
				cb.isTrue(root.get(ACTIVE))
		));
	}

}
