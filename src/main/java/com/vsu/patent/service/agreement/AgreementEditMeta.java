package com.vsu.patent.service.agreement;

import com.vsu.patent.dto.AgreementDTO;
import com.vsu.patent.entity.enums.AgreementEditStep;
import com.vsu.patent.entity.enums.SubjectAgreementType;
import io.tesler.core.crudma.bc.impl.InnerBcDescription;
import io.tesler.core.dto.rowmeta.FieldsMeta;
import io.tesler.core.dto.rowmeta.RowDependentFieldsMeta;
import io.tesler.core.service.rowmeta.FieldMetaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;

import static com.vsu.patent.dto.AgreementDTO_.*;

@Service
@RequiredArgsConstructor
public class AgreementEditMeta extends FieldMetaBuilder<AgreementDTO> {

    @Override
    public void buildRowDependentMeta(RowDependentFieldsMeta<AgreementDTO> fields,
                                      InnerBcDescription bcDescription,
                                      Long id, Long parentId) {
        fields.setEnabled(
                number,
                agreementNumber,
                signDate,
                endDate,
                type,
                subjectNumber,
                subjectName,
                subjectType,
                period,
                amount,
                licensee,
                additionalAgreement,
                licenseeContactInfo,
                registrationNumber,
                parentAgreement,
                note
        );
        fields.setEnumValues(subjectType, SubjectAgreementType.values());
        buildStepper(fields);
        setPlaceholders(fields);
    }

    private void buildStepper(RowDependentFieldsMeta<AgreementDTO> fields) {
        fields.setEnabled(editStep);
        fields.setDictionaryTypeWithCustomValues(editStep, Arrays.stream(AgreementEditStep.values())
                .map(AgreementEditStep::getStepName).toArray(String[]::new));
    }

    private void setPlaceholders(RowDependentFieldsMeta<AgreementDTO> fields) {
        fields.setPlaceholder(number, "№ п/п");
        fields.setPlaceholder(agreementNumber, "№ договора");
        fields.setPlaceholder(signDate, "Дата подписания");
        fields.setPlaceholder(endDate, "Дата окончания");
        fields.setPlaceholder(type, "Вид договора");
        fields.setPlaceholder(subjectNumber, "№ охранного документа");
        fields.setPlaceholder(subjectName, "Название");
        fields.setPlaceholder(subjectType, "Вид объекта");
        fields.setPlaceholder(period, "Срок договора");
        fields.setPlaceholder(amount, "Сумма по договору, % в уставном капитале");
        fields.setPlaceholder(licensee, "Лицензиат");
        fields.setPlaceholder(additionalAgreement, "Доп. соглашения");
        fields.setPlaceholder(licenseeContactInfo, "Контактные данные Лицензиата");
        fields.setPlaceholder(registrationNumber, "Регистрационный номер Роспатента");
        fields.setPlaceholder(parentAgreement, "Соглашение, в рамках которого подписан договор");
        fields.setPlaceholder(note, "Примечение");
    }

    @Override
    public void buildIndependentMeta(FieldsMeta<AgreementDTO> fields, InnerBcDescription bcDescription,
                                     Long parentId) {
    }

}
