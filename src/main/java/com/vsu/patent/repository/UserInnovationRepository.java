package com.vsu.patent.repository;

import com.vsu.patent.entity.Innovation;
import com.vsu.patent.entity.SmUser;
import com.vsu.patent.entity.UserInnovation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInnovationRepository extends JpaRepository<UserInnovation, Long>, JpaSpecificationExecutor<UserInnovation> {
	
	List<UserInnovation> findAllByUserAndInnovationAndIsActive(SmUser user, Innovation innovation, Boolean isActive);
	
	List<UserInnovation> findAllByInnovation(Innovation innovation);
	
	List<UserInnovation> findAllByInnovationAndIsActive(Innovation innovation, Boolean isActive);
	
}

