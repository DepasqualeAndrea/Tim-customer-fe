import {ErrorStrategy} from '../../../../core/errors-handler/error-strategy.interface';
import {FormHumanError} from '../../../../shared/errors/form-human-error.model';
import {GtmHandlerService} from '../../../../core/services/gtm/gtm-handler.service';
import {SystemError} from '../../../../shared/errors/system-error.model';

export class CbSystemGenericGtmErrorStrategy implements ErrorStrategy<SystemError> {

  constructor(private gtmHandler: GtmHandlerService) {
  }

  handle(error: SystemError): void {
    this.gtmHandler.requireTenant("chebanca");
    this.gtmHandler.getModelHandler().reset();
    this.gtmHandler.getModelHandler().add({
      event: 'error',
      errorType: 'system',
      errorDescription: error.data.toString()
    });
    this.gtmHandler.push();
  }

}
