import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

export function controlIsInvalid(controlInvalid: boolean, formControlDirty: boolean, formControlTouched: boolean, formControlErrors: ValidationErrors): boolean{
  return !!(controlInvalid && (formControlDirty || formControlTouched) && formControlErrors);
}

@Pipe({
  name: 'controlIsInvalid',
})
export class ControlIsInvalidPipe implements PipeTransform {

  transform(controlInvalid: boolean, formControlDirty: boolean, formControlTouched: boolean, formControlErrors: ValidationErrors): boolean {
    return controlIsInvalid(controlInvalid, formControlDirty, formControlTouched, formControlErrors);
  }

}
