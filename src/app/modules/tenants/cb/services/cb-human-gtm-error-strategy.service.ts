import {ErrorStrategy} from '../../../../core/errors-handler/error-strategy.interface';
import {GtmHandlerService} from '../../../../core/services/gtm/gtm-handler.service';
import {HumanError} from '../../../../shared/errors/human-error.model';

export class CbHumanGtmErrorStrategy implements ErrorStrategy<HumanError> {

  constructor(private gtmHandler: GtmHandlerService) {
  }

  handle(error: HumanError): void {
    this.gtmHandler.requireTenant("chebanca");
    this.gtmHandler.getModelHandler().reset();
    this.gtmHandler.getModelHandler().add({
      event: 'error',
      errorType: 'human',
      errorDescription: error.data.toString()
    });
    this.gtmHandler.push();
  }

}
