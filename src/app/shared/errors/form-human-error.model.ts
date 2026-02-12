import {HumanError} from './human-error.model';
import {ErrorCodes} from './error-codes.model';

export class FormHumanError extends HumanError {
  constructor(data: any) {
    super(data);
    this.type = ErrorCodes.HUMAN_FORM;
  }
}
