import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs';
import {interval} from 'rxjs/internal/observable/interval';

declare var braintree: any;

@Injectable({
  providedIn: 'root'
})
export class CheckoutStepPaymentService {

  private braintreeProviderSource: Subject<any> = new BehaviorSubject<any>(null);

  braintreeProvider$: Observable<any> = this.braintreeProviderSource.asObservable();

  constructor() {
    const intervalSubscription = interval(100).subscribe(() => {
      if (typeof braintree !== 'undefined') {
        this.braintreeProviderSource.next(braintree);
        intervalSubscription.unsubscribe();
      }
    });
  }
}
