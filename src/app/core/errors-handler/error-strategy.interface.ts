import {CustomError} from '../../shared/errors/custom-error.model';

export interface ErrorStrategy<T extends CustomError> {
  handle(error: T): void;
}
