import {CustomError} from './custom-error.model';
import {ErrorCodes} from './error-codes.model';

export class HumanError extends CustomError {


  constructor(data?: any) {
    super('Human error. Something went wrong with user ux interaction. more details in data attribute');
    this.type = ErrorCodes.HUMAN_GENERIC;
    this.data = !!data ? data : 'No further info';
  }
}
