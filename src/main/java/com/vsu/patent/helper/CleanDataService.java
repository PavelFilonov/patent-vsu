package com.vsu.patent.helper;

import com.vsu.patent.repository.AgreementRepository;
import com.vsu.patent.repository.InnovationRepository;
import com.vsu.patent.repository.ProgramRepository;
import com.vsu.patent.repository.SmUserRepository;
import com.vsu.patent.repository.TradeSecretRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CleanDataService {
	
	private final SmUserRepository userRepository;
	
	private final AgreementRepository agreementRepository;
	
	private final InnovationRepository innovationRepository;
	
	private final ProgramRepository programRepository;
	
	private final TradeSecretRepository tradeSecretRepository;
	
	@Transactional
	public void cleanUnusefulData() {
		userRepository.deleteAll(userRepository.findAll(SmUserRepository.unusefulData()));
//		agreementRepository.deleteAll(agreementRepository.findAll(AgreementRepository.unusefulData()));
//		innovationRepository.deleteAll(innovationRepository.findAll(InnovationRepository.unusefulData()));
//		programRepository.deleteAll(programRepository.findAll(ProgramRepository.unusefulData()));
//		tradeSecretRepository.deleteAll(tradeSecretRepository.findAll(TradeSecretRepository.unusefulData()));
	}

}
