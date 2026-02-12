import {ErrorCodes} from '../../../../shared/errors/error-codes.model';

export class CbErrors {
  constructor() {
  }

  initErrorCodes() {
    ErrorCodes.HUMAN_FORM = 'cb-human-form';
  }
}
