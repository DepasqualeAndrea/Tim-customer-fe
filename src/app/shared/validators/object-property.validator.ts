import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function objectPropertyValidator(requiredValue: string[] | number[], objectProperty: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || typeof control.value !== 'object' || !control.value[objectProperty]) {
      return
    }
    requiredValue = requiredValue.map(value => typeof value === 'string' ? value.toLowerCase(): value);
    const controlValue = control.value[objectProperty];
    const lowerCaseValue = (typeof controlValue === 'string' ? controlValue.toLowerCase() : controlValue) as never;
    return requiredValue.includes(lowerCaseValue) ? null : { invalidValue: true };
  };
}