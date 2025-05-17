package com.vsu.patent.repository;

import com.vsu.patent.entity.SmUser;
import com.vsu.patent.entity.SmUserRole;
import io.tesler.api.data.dictionary.LOV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SmUserRoleRepository extends JpaRepository<SmUserRole, Long>, JpaSpecificationExecutor<SmUserRole> {
	
	void deleteAllByUser(SmUser user);
	
	List<SmUserRole> findByUser(SmUser user);
	
	List<SmUserRole> findByUserAndInternalRoleCd(SmUser user, LOV internalRoleCd);
	
}
