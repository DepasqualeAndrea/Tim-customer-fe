import { FormGroup, ValidatorFn } from "@angular/forms";

export class ValidatorsHelper {
  
  public static ChangePasswordValidator: ValidatorFn = (fg: FormGroup) => {
    const pwd1 = fg.get('newPwd') && fg.get('newPwd').value;
    const pwd2 = fg.get('confirmPwd') && fg.get('confirmPwd').value;
    return (!pwd1 && !pwd2) || (pwd1 === pwd2) ? null : { changePassword: true };
  }

  public static NotNullValidator: ValidatorFn = (fg: FormGroup) => {
    return Object.values(fg.value).every(controlValue => 
      controlValue !== undefined && controlValue !== null
    ) ? null
    : {hasNullValues: true};
  }
}