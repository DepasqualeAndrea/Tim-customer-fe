import { ResponseOrder, RequestOrder } from '@model';
import { Observable } from 'rxjs';

export interface ProductAddressStepController {
    addressFieldsToDisable$: Observable<string[]>;
    responseOrderChanged(): void;
    getRequest(requestOrder: RequestOrder): RequestOrder;
}
