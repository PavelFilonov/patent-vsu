package com.vsu.patent.repository;

import com.vsu.patent.entity.Program;
import com.vsu.patent.entity.SmUser;
import com.vsu.patent.entity.UserProgram;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProgramRepository extends JpaRepository<UserProgram, Long>, JpaSpecificationExecutor<UserProgram> {
	
	List<UserProgram> findAllByUserAndProgramAndIsActive(SmUser user, Program program, Boolean isActive);

	List<UserProgram> findAllByProgram(Program program);

	List<UserProgram> findAllByProgramAndIsActive(Program program, Boolean isActive);
	
}

