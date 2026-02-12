import {CustomError} from './custom-error.model';
import {ErrorCodes} from './error-codes.model';

export class SystemError extends CustomError {
  constructor(data?: any) {
    super('System error. Further information contained into data attribute');
    this.data = !!data ? data : 'No further information provided';
    this.type = ErrorCodes.SYSTEM_GENERIC;
  }
}
