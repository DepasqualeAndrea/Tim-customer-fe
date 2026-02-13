import { AbstractControl, UntypedFormGroup, FormControl } from '@angular/forms';

export class PasswordHelper {

  static passwordValidator(minLength: number) {
    return function (ac: AbstractControl) {
      const val: string = ac.value;
      if (val) {
        if (val.length < minLength) {
          return { 'passwordLength': true };
        }
        if (
          !/[A-Z]/.test(val)
          || !/[a-z]/.test(val)
          || !/[0-9]/.test(val)
          || !/[@$!%*?&]/.test(val)
        ) {
          return { 'passwordUpperLowerNumberCharacter': true };
        }
      }
      return null;
    };
  }

  static checkPasswords(passwordFieldName: string, confirmPasswordFieldName: string) {

    return function (form: UntypedFormGroup) {
      const password: AbstractControl = form.get(passwordFieldName);
      const confirmPassword: AbstractControl = form.get(confirmPasswordFieldName);

      if (!confirmPassword)
        return null;

      if (password.value === confirmPassword.value)
        return null;
      else
        return { notSame: true };
    }
  }

}
