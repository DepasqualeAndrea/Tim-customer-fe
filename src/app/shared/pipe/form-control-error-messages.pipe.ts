import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

export function formControlErrorMessages(formControlErrors: ValidationErrors, errorMessages: { [key:string]: string }): string[]{
  if(formControlErrors !== undefined && formControlErrors !== null && !Array.isArray(formControlErrors) && typeof formControlErrors === 'object'){
    const currentErrors = Object.keys(formControlErrors);
    return currentErrors.reduce((acc, err) => {
      if(errorMessages[err] !== undefined && errorMessages[err] !== null && errorMessages[err] !== ''){
        acc.push(errorMessages[err]);
      }
      return acc;
    }, []);
  }
  return [];
}

@Pipe({
  name: 'formControlErrorMessages'
})
export class FormControlErrorMessagesPipe implements PipeTransform {

  transform(formControlErrors: ValidationErrors, errorMessages: { [key:string]: string }): string[] {
    return formControlErrorMessages(formControlErrors, errorMessages);
  }

}
