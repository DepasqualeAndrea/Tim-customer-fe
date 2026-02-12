import { FormControl } from '@angular/forms';

export function insuredSubjectCountValidatorFactory(minsubjects: number, maxsubjects: number) {
    return (c: FormControl) => {
        let isValid = false;
        if (!isNaN(c.value) && c.value >= minsubjects && c.value <= maxsubjects) {
            isValid = true;
        }
        return isValid ? null : { validateInsuredSubjectsCount: { valid: false } };
    }
}
